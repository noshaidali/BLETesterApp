import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen.js';
// import ConnectivityScreen from '../screens/ConnectivityScreen.js';


const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      {/* <Stack.Screen name="Connectivity" component={ConnectivityScreen} /> */}
    </Stack.Navigator>
  );
}