import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ConnectivityScreen({ route }) {
  const { method } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        BLE Testing with {method === 'plx' ? 'react-native-ble-plx' : 'react-native-ble-manager'}
      </Text>
      {/* BLE logic will go here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold' },
});
