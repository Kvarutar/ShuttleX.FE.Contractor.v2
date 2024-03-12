import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import BootSplash from 'react-native-bootsplash';

import AuthScreen from '../screens/auth/AuthScreen';
import SignInEmailCodeScreen from '../screens/auth/SignInEmailCodeScreen';
import SignInPhoneCodeScreen from '../screens/auth/SignInPhoneCodeScreen';
import SignUpPhoneCodeScreen from '../screens/auth/SignUpPhoneCodeScreen';
import SplashScreen from '../screens/auth/SplashScreen';
import BackgroundCheckScreen from '../screens/docs/BackgroundCheck';
import DocsScreen from '../screens/docs/DocsScreen';
import DriversLicenseScreen from '../screens/docs/DriversLicenseScreen';
import ProfilePhotoScreen from '../screens/docs/ProfilePhotoScreen';
import VehicleInspectionScreen from '../screens/docs/VehicleInspectionScreen';
import VehicleInsuranceScreen from '../screens/docs/VehicleInsuranceScreen';
import VehicleRegistrationScreen from '../screens/docs/VehicleRegistrationScreen';
import RatingScreen from '../screens/ride/RatingScreen';
import RideScreen from '../screens/ride/RideScreen';
import { RootStackParamList } from './props';

const Stack = createNativeStackNavigator<RootStackParamList>();

const Navigate = (): JSX.Element => (
  <NavigationContainer onReady={() => BootSplash.hide({ fade: true })}>
    <Stack.Navigator
      initialRouteName="Splash"
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
      <Stack.Screen name="Rating" component={RatingScreen} />
      <Stack.Screen name="Docs" component={DocsScreen} />
      <Stack.Screen name="BackgroundCheck" component={BackgroundCheckScreen} />
      <Stack.Screen name="ProfilePhoto" component={ProfilePhotoScreen} />
      <Stack.Screen name="DriversLicense" component={DriversLicenseScreen} />
      <Stack.Screen name="VehicleInsurance" component={VehicleInsuranceScreen} />
      <Stack.Screen name="VehicleRegistration" component={VehicleRegistrationScreen} />
      <Stack.Screen name="VehicleInspection" component={VehicleInspectionScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default Navigate;
