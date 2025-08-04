import React, { useEffect } from 'react';
import { NativeModules, NativeEventEmitter, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './app/navigation/AppNavigator';
import BleManager from 'react-native-ble-manager';

export default function App() {
  useEffect(() => {
    BleManager.start({ showAlert: false }).then(() => {
      console.log("BLE MANAGER Module initialized");
    });

    if (Platform.OS === 'android') {
      // Optional: enable Bluetooth on Android start
      const BleManagerModule = NativeModules.BleManager;
      const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);
    }
  }, []);

  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}
