import { BleManager } from 'react-native-ble-plx';
import { PermissionsAndroid, Platform } from 'react-native';

class BLEPlxService {
  constructor() {
    this.manager = new BleManager();
    this.devices = new Map();
  }

  async requestPermissions() {
    if (Platform.OS === 'android' && Platform.Version >= 23) {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ]);
    }
  }

  startScan(onDeviceFound, onError) {
    this.devices.clear();

    this.manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        onError?.(error);
        return;
      }

      if (device && !this.devices.has(device.id)) {
        this.devices.set(device.id, device);
        onDeviceFound?.(device);
      }
    });
  }

  stopScan() {
    this.manager.stopDeviceScan();
  }

  async connectToDevice(deviceId) {
    try {
      const device = await this.manager.connectToDevice(deviceId);
      await device.discoverAllServicesAndCharacteristics();
      return device;
    } catch (error) {
      throw error;
    }
  }

  destroy() {
    this.manager.destroy();
  }
}

export default new BLEPlxService();
