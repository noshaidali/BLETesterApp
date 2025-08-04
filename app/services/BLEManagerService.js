// import BleManager from 'react-native-ble-manager';
import BleManager, {
  BleDisconnectPeripheralEvent,
  BleManagerDidUpdateValueForCharacteristicEvent,
  BleScanCallbackType,
  BleScanMatchMode,
  BleScanMode,
  Peripheral,
  PeripheralInfo,
} from 'react-native-ble-manager';

import { PermissionsAndroid, Platform } from 'react-native';
import { krakenDeviceUUID, krakenDisplayNameCharacteristicUUID, krakenManfacturerNameCharacteristicUUID } from '../utils/KrakenUUIDs';
import { Buffer } from 'buffer'; // npm install buffer if missing

class BLEManagerService {
  constructor() {
    this.devices = new Map();

    // Listen to BLE state changes
    // BleManager.start({ showAlert: false });

    // BleManager.onStateChange((state) => {
    //     console.log(state);
    // }, true);
  }

  async requestPermissions() {
    if (Platform.OS === 'android') {
      const permissions = [];
      if (Platform.Version >= 23 && Platform.Version <= 30) {
        permissions.push(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
      } else if (Platform.Version >= 31) {
        permissions.push(
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        );
      }

      if (permissions.length === 0) {
        return true;
      }
      const granted = await PermissionsAndroid.requestMultiple(permissions);
      return Object.values(granted).every(
        result => result === PermissionsAndroid.RESULTS.GRANTED,
      );
    }
    return true;
  }

  startScan(onDeviceFound, onError) {
    setTimeout(() => {
      try {
        console.log('[startScan] starting scan...');
        // setIsScanning(true);
        BleManager.scan([krakenDeviceUUID], 100000, false, {
          matchMode: BleScanMatchMode.Sticky,
          scanMode: BleScanMode.LowLatency,
          callbackType: BleScanCallbackType.AllMatches,
        })
          .then(() => {
            console.debug('[startScan] scan promise returned successfully.');
          })
          .catch((err) => {
            console.error('[startScan] ble scan returned in error', err);
          });
      } catch (error) {
        console.error('[startScan] ble scan error thrown', error);
      }
      // this.devices.clear();
      // BleManager.scan([], 10, true); // Scan for 10 seconds

      // // Listen for discovered devices
      // BleManager.on('BleManagerDiscoverPeripheral', (device) => {
      //     if (device && !this.devices.has(device.id) && device.name === "Kraken v2") {
      //         const serviceUUIDs = device.advertising?.serviceUUIDs || [];
      //         if (serviceUUIDs.includes(krakenDeviceUUID)) {
      //             console.log("DEVICE: ", device);
      //             this.devices.set(device.id, device);
      //             onDeviceFound?.(device);
      //         }
      //     }
      // });

    }, 1000);
  }

  stopScan() {
    BleManager.stopScan();
  }

  async connectAndDiscover(deviceId) {
    try {
      const device = await BleManager.connect(deviceId);
      const services = await BleManager.retrieveServices(deviceId);
      const results = [];

      if (!services || services.length === 0) {
        return results;
      }

      for (const service of services) {
        const characteristics = await BleManager.characteristicsForService(deviceId, service.uuid);
        let name = 'N/A';
        for (const char of characteristics) {
          if (char.uuid.toLowerCase().includes(krakenDisplayNameCharacteristicUUID) && char.isReadable) {
            const base64Value = await BleManager.read(deviceId, service.uuid, char.uuid);
            const decoded = Buffer.from(base64Value, 'base64').toString('utf8');
            name = decoded;
          }
        }
        results.push({
          name: name,
          serviceUUID: service.uuid,
          characteristics: characteristics.map((char) => ({
            uuid: char.uuid,
            isReadable: char.isReadable,
            isWritableWithResponse: char.isWritableWithResponse,
            isNotifiable: char.isNotifiable,
          })),
        });
      }

      return results;
    } catch (error) {
      throw error;
    }
  }

  destroy() {
    BleManager.stop();
  }
}

export default new BLEManagerService();
