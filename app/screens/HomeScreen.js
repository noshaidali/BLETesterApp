import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>BLE Tester</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Connectivity', { method: 'plx' })}
      >
        <Text style={styles.buttonText}>Test with BLE-PLX</Text>
      </TouchableOpacity>
{/* 
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#4B5563' }]}
        onPress={() => navigation.navigate('Connectivity', { method: 'manager' })}
      >
        <Text style={styles.buttonText}>Test with BLE-Manager</Text>
      </TouchableOpacity> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  heading: { fontSize: 26, fontWeight: 'bold', marginBottom: 40 },
  button: {
    backgroundColor: '#2563EB',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 18 },
});
