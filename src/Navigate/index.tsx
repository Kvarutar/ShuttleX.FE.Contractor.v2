import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import BootSplash from 'react-native-bootsplash';
import { useTheme } from 'shuttlex-integration';

import AuthScreen from '../screens/auth/AuthScreen';
import PhoneSelectScreen from '../screens/auth/PhoneSelectScreen';
import SignInEmailCodeScreen from '../screens/auth/SignInEmailCodeScreen';
import SignInPhoneCodeScreen from '../screens/auth/SignInPhoneCodeScreen';
import SignUpPhoneCodeScreen from '../screens/auth/SignUpPhoneCodeScreen';
import SplashScreen from '../screens/auth/SplashScreen';
import TermsScreen from '../screens/auth/TermsScreen';
import BackgroundCheckScreen from '../screens/docs/BackgroundCheck';
import DocsScreen from '../screens/docs/DocsScreen';
import DriversLicenseScreen from '../screens/docs/DriversLicenseScreen';
import ProfilePhotoScreen from '../screens/docs/ProfilePhotoScreen';
import VehicleInspectionScreen from '../screens/docs/VehicleInspectionScreen';
import VehicleInsuranceScreen from '../screens/docs/VehicleInsuranceScreen';
import VehicleRegistrationScreen from '../screens/docs/VehicleRegistrationScreen';
import NotificationScreen from '../screens/menu/NotificationsScreen';
import AddPaymentScreen from '../screens/menu/wallet/AddPaymentScreen';
import WalletScreen from '../screens/menu/wallet/WalletScreen';
import WithdrawScreen from '../screens/menu/wallet/WithdrawScreen';
import RatingScreen from '../screens/ride/RatingScreen';
import RideScreen from '../screens/ride/RideScreen';
import VerificationScreen from '../screens/verification/VerificationScreen';
import ZoneScreen from '../screens/verification/ZoneScreen';
import { RootStackParamList } from './props';

const Stack = createNativeStackNavigator<RootStackParamList>();

const Navigate = (): JSX.Element => {
  const { setThemeMode } = useTheme();

  useEffect(() => {
    setThemeMode('dark');
  }, [setThemeMode]);

  return (
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
        <Stack.Screen name="Notifications" component={NotificationScreen} />
        <Stack.Screen name="Rating" component={RatingScreen} />
        <Stack.Screen name="Zone" component={ZoneScreen} />
        <Stack.Screen name="Docs" component={DocsScreen} />
        <Stack.Screen name="BackgroundCheck" component={BackgroundCheckScreen} />
        <Stack.Screen name="ProfilePhoto" component={ProfilePhotoScreen} />
        <Stack.Screen name="DriversLicense" component={DriversLicenseScreen} />
        <Stack.Screen name="VehicleInsurance" component={VehicleInsuranceScreen} />
        <Stack.Screen name="VehicleRegistration" component={VehicleRegistrationScreen} />
        <Stack.Screen name="VehicleInspection" component={VehicleInspectionScreen} />
        <Stack.Screen name="Wallet" component={WalletScreen} />
        <Stack.Screen name="AddPayment" component={AddPaymentScreen} />
        <Stack.Screen name="Withdraw" component={WithdrawScreen} />
        <Stack.Screen name="PhoneSelect" component={PhoneSelectScreen} />
        <Stack.Screen name="Terms" component={TermsScreen} />
        <Stack.Screen name="Verification" component={VerificationScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigate;
