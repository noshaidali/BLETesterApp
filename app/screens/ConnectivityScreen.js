import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import BLEPlxService from '../services/BLEPlxService';
import BLEManagerService from '../services/BLEManagerService';

export default function ConnectivityScreen({ route }) {
  const { method } = route.params;
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);

  const bleService = method === 'plx' ? BLEPlxService : BLEManagerService;

  useEffect(() => {
    (async () => {
      await bleService.requestPermissions();
      setDevices([]);
      setLoading(true);

      bleService.startScan(
        (device) => setDevices((prev) => [...prev, device]),
        (err) => Alert.alert('Scan Error', err.message)
      );

      setTimeout(() => {
        bleService.stopScan();
        setLoading(false);
      }, 10000);
    })();

    return () => bleService.stopScan();
  }, [method]);

  const connectToDevice = async (device) => {
    try {
      await bleService.connect(device.id);
      Alert.alert('Connected', `Connected to ${device.name || device.id}`);
    } catch (err) {
      Alert.alert('Connection Failed', err.message);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => connectToDevice(item)}
      style={styles.device}
    >
      <Text style={styles.deviceName}>{item.name || 'Unnamed Device'}</Text>
      <Text style={styles.deviceId}>{item.id}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        BLE Devices ({method === 'plx' ? 'BLE-PLX' : 'BLE-Manager'})
      </Text>
      {loading && <ActivityIndicator size="large" color="#2563EB" />}
      <FlatList
        data={devices}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 50 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  device: {
    padding: 15,
    backgroundColor: '#F3F4F6',
    marginVertical: 8,
    borderRadius: 10,
  },
  deviceName: { fontSize: 16, fontWeight: 'bold' },
  deviceId: { fontSize: 12, color: '#6B7280' },
});
