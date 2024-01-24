import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import AuthScreen from '../screens/AuthScreen';
import RideScreen from '../screens/RideScreen';
import SignInEmailCodeScreen from '../screens/SignInEmailCodeScreen';
import SignInPhoneCodeScreen from '../screens/SignInPhoneCodeScreen';
import SignUpPhoneCodeScreen from '../screens/SignUpPhoneCodeScreen';
import SplashScreen from '../screens/SplashScreen';
import { RootStackParamList } from './props';

const Stack = createNativeStackNavigator<RootStackParamList>();

const Navigate = (): JSX.Element => (
  <NavigationContainer>
    <Stack.Navigator
      initialRouteName="Ride"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Auth" component={AuthScreen} />
      <Stack.Screen name="Ride" component={RideScreen} />
      <Stack.Screen name="SignUpPhoneCode" component={SignUpPhoneCodeScreen} />
      <Stack.Screen name="SignInPhoneCode" component={SignInPhoneCodeScreen} />
      <Stack.Screen name="SignInEmailCode" component={SignInEmailCodeScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default Navigate;
