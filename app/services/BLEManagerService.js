import BleManager from 'react-native-ble-manager';
import { NativeModules, NativeEventEmitter, Platform, PermissionsAndroid } from 'react-native';

const BleManagerModule = NativeModules.BleManager;
const bleEmitter = new NativeEventEmitter(BleManagerModule);

class BLEManagerService {
  devices = new Map();
  listeners = [];

  async requestPermissions() {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ]);
    }
  }

  async startScan(onDeviceFound, onError) {
    this.devices.clear();
    try {
      await BleManager.scan([], 10, true);
      const discoverListener = bleEmitter.addListener('BleManagerDiscoverPeripheral', (device) => {
        console.log(device)
        if (device && !this.devices.has(device.id)) {
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
