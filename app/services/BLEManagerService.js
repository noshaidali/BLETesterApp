import BleManager from 'react-native-ble-manager';
import { NativeModules, NativeEventEmitter, Platform, PermissionsAndroid } from 'react-native';

const BleManagerModule = NativeModules.BleManager;
const bleEmitter = new NativeEventEmitter(BleManagerModule);

class BLEManagerService {
  devices = new Map();
  listeners = [];

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

  async startScan(onDeviceFound, onError) {
    this.devices.clear();
    try {
      await BleManager.scan([], 10, true);
      const discoverListener = bleEmitter.addListener('BleManagerDiscoverPeripheral', (device) => {
        if (
          device &&
          !this.devices.has(device.id) &&
          Array.isArray(device.advertising?.serviceUUIDs) &&
          device.advertising.serviceUUIDs.includes(TARGET_UUID)
        ) {
          this.devices.set(device.id, device);
          onDeviceFound?.(device);
        }
      });

      this.listeners.push(discoverListener);
    } catch (err) {
      onError?.(err);
    }
  }

  stopScan() {
    BleManager.stopScan();
    this.listeners.forEach((l) => l.remove());
    this.listeners = [];
  }

  async connect(deviceId) {
    await BleManager.connect(deviceId);
    await BleManager.retrieveServices(deviceId);
  }
}

export default new BLEManagerService();
