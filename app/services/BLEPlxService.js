import { BleManager } from 'react-native-ble-plx';
import { PermissionsAndroid, Platform } from 'react-native';
import { krakenDeviceUUID, krakenDisplayNameCharacteristicUUID, krakenManfacturerNameCharacteristicUUID } from '../utils/KrakenUUIDs';
import { Buffer } from 'buffer'; // npm install buffer if missing


class BLEPlxService {
    constructor() {
        this.manager = new BleManager();
        this.devices = new Map();

        this.manager.onStateChange((state) => {
            console.log(state);
        }, true);
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
            this.devices.clear();
            this.manager.startDeviceScan(null, null, (error, device) => {
                if (error) {
                    onError?.(error);
                    return;
                }
                if (Platform.OS === 'android') {
                    if (device && !this.devices.has(device.id)) {
                        const serviceUUIDs = device.serviceUUIDs || [];
                        if (serviceUUIDs.includes(krakenDeviceUUID)) {
                            console.log("DEVICE: ", device)
                            this.devices.set(device.id, device);
                            onDeviceFound?.(device);
                        }
                    }
                } else {
                    if (device && !this.devices.has(device.id) && device.name === "Kraken v2") {
                        const serviceUUIDs = device.serviceUUIDs || [];
                        if (serviceUUIDs.includes(krakenDeviceUUID)) {
                            console.log("DEVICE: ", device)
                            this.devices.set(device.id, device);
                            onDeviceFound?.(device);
                        }
                    }
                }

            });
        }, 1000);
    }

    stopScan() {
        this.manager.stopDeviceScan();
    }

    async connectAndDiscover(deviceId) {
        try {
            const device = await this.manager.connectToDevice(deviceId);
            await device.discoverAllServicesAndCharacteristics();

            const services = await device.services();
            const results = [];
            if (!services || services.length === 0) {
                return results
            }

            for (const service of services) {
                const characteristics = await device.characteristicsForService(service.uuid);
                let name = 'N/A'
                for (const char of characteristics) {
                    if (char.uuid.toLowerCase().includes(krakenDisplayNameCharacteristicUUID) && char.isReadable) {
                        const readChar = await char.read();
                        const base64Value = readChar.value;
                        const decoded = Buffer.from(base64Value, 'base64').toString('utf8');
                        name = decoded

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
        this.manager.destroy();
    }
}

export default new BLEPlxService();
