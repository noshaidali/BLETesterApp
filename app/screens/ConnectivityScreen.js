import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import BLEPlxService from '../services/BLEPlxService';
import { krakenDeviceUUID } from '../utils/KrakenUUIDs';

export default function ConnectivityScreen() {
  const [status, setStatus] = useState('🔍 Scanning...');
  const [devicesData, setDevicesData] = useState([]);
  const [connectedDevices, setConnectedDevices] = useState([]);

  useEffect(() => {
    const connectToDevice = async (device) => {
      try {
        const result = await BLEPlxService.connectAndDiscover(device.id);
        setDevicesData((prev) => [
          ...prev,
          {
            device,
            services: result,
          },
        ]);
        setConnectedDevices((prev) => [...prev, device.id]);
      } catch (err) {
        setStatus(`❌ Error connecting to ${device.name || device.id}: ${err.message}`);
      }
    };

    const start = async () => {
      setConnectedDevices([])
      setDevicesData([])
      await BLEPlxService.requestPermissions();
      BLEPlxService.startScan(
        (device) => {
          const serviceUUIDs = device.serviceUUIDs || device.advertisementServiceUUIDs || [];
          if (
            serviceUUIDs.includes(krakenDeviceUUID) &&
            !connectedDevices.includes(device.id)
          ) {
            connectToDevice(device);
          }
        },
        (err) => {
          setStatus(`❌ Scan Error: ${err.message}`);
        }
      );

      setTimeout(() => {
        BLEPlxService.stopScan();
        setStatus('✅ Scan complete.');
      }, 10000);
    };

    start();

    return () => {
      BLEPlxService.stopScan();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.status}>{status}</Text>

      <FlatList
        data={devicesData}
        keyExtractor={(item) => item.device.id}
        renderItem={({ item }) => {
          let name = 'N/A'
          for (const obj of item.services) {
            if (obj.name !== 'N/A') {
              name = obj.name
            }
          }
          const totalServices = item.services.length;
          const totalCharacteristics = item.services.reduce(
            (sum, svc) => sum + svc.characteristics.length,
            0
          );

          return (
            <View style={styles.serviceBox}>
              <Text style={styles.connected}>Connected to: {name}</Text>
              <Text style={styles.serviceTitle}>
                Found {totalServices} Services and {totalCharacteristics} Characteristics
              </Text>
              <Text style={styles.connected}>RSSI: {item.device.rssi}</Text>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  status: {
    marginVertical: 10,
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    color: '#0F766E',
  },
  connected: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 10,
    color: '#4B5563',
  },
  serviceBox: {
    backgroundColor: '#E5E7EB',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  serviceTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#1F2937',
    textAlign: 'center',
  },
  charItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  charFlags: {
    fontSize: 12,
    color: '#6B7280',
  },
});