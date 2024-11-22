import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BootSplash from 'react-native-bootsplash';
import { useSelector } from 'react-redux';

import { isLoggedInSelector } from '../core/auth/redux/selectors';
import AuthScreen from '../screens/auth/AuthScreen';
import SignInCodeScreen from '../screens/auth/SignInCodeScreen';
import SplashScreen from '../screens/auth/SplashScreen';
import TermsScreen from '../screens/auth/TermsScreen';
import DocMediaScreen from '../screens/docs/DocMediaScreen';
import DocsScreen from '../screens/docs/DocsScreen';
import ProfilePhotoScreen from '../screens/docs/ProfilePhotoScreen';
import AccountSettings from '../screens/menu/AccountSettings';
import AccountVerificateCodeScreen from '../screens/menu/AccountVerificateCodeScreen';
import NotificationScreen from '../screens/menu/NotificationsScreen';
import WalletScreen from '../screens/menu/wallet/WalletScreen';
import WithdrawScreen from '../screens/menu/wallet/WithdrawScreen';
import RatingScreen from '../screens/ride/RatingScreen';
import RideScreen from '../screens/ride/RideScreen';
import VerificationScreen from '../screens/verification/VerificationScreen';
import ZoneScreen from '../screens/verification/ZoneScreen';
import { RootStackParamList } from './props';

const Stack = createNativeStackNavigator<RootStackParamList>();

const Navigate = (): JSX.Element => {
  const isLoggedIn = useSelector(isLoggedInSelector);

  return (
    <NavigationContainer onReady={() => BootSplash.hide({ fade: true })}>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
        }}
      >
        {isLoggedIn ? (
          <>
            <Stack.Screen name="Ride" component={RideScreen} />
            <Stack.Screen name="Notifications" component={NotificationScreen} />
            <Stack.Screen name="Rating" component={RatingScreen} />
            <Stack.Screen name="Zone" component={ZoneScreen} />
            <Stack.Screen name="ProfilePhoto" component={ProfilePhotoScreen} />
            <Stack.Screen name="Docs" component={DocsScreen} />
            <Stack.Screen name="Wallet" component={WalletScreen} />
            <Stack.Screen name="Withdraw" component={WithdrawScreen} />
            <Stack.Screen name="Verification" component={VerificationScreen} />
            <Stack.Screen name="AccountSettings" component={AccountSettings} />
            <Stack.Screen name="AccountVerificateCode" component={AccountVerificateCodeScreen} />
            <Stack.Screen name="DocMedia" component={DocMediaScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Auth" component={AuthScreen} />
            <Stack.Screen name="SignInCode" component={SignInCodeScreen} />
          </>
        )}
        <Stack.Screen name="Terms" component={TermsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigate;
