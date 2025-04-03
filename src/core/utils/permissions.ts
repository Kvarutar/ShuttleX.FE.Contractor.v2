import notifee, { AuthorizationStatus } from '@notifee/react-native';
import { Alert, Linking } from 'react-native';
import {
  check,
  checkLocationAccuracy,
  LocationAccuracy,
  PERMISSIONS,
  request,
  RESULTS,
} from 'react-native-permissions';
import { IS_IOS } from 'shuttlex-integration';

export const requestGeolocationPermission = async (): Promise<void> => {
  if (IS_IOS) {
    await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
  } else {
    await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
  }
};

export const checkGeolocationPermissionAndAccuracy = async (): Promise<{
  isGranted: boolean;
  accuracy: LocationAccuracy;
}> => {
  if (IS_IOS) {
    const result = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    const accuracy: LocationAccuracy = result === RESULTS.GRANTED ? await checkLocationAccuracy() : 'reduced';
    return { isGranted: result === RESULTS.GRANTED, accuracy };
  } else {
    const [resultFine, resultCoarse] = await Promise.all([
      check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION),
      check(PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION),
    ]);
    const isGranted = resultFine === RESULTS.GRANTED || resultCoarse === RESULTS.GRANTED;
    const accuracy: LocationAccuracy =
      resultFine === RESULTS.GRANTED && resultCoarse === RESULTS.GRANTED ? 'full' : 'reduced';

    return { isGranted, accuracy };
  }
};

export const requestCameraUsagePermission = async (): Promise<void> => {
  if (IS_IOS) {
    await request(PERMISSIONS.IOS.CAMERA);
  } else {
    await request(PERMISSIONS.ANDROID.CAMERA);
  }
};

export const checkCameraUsagePermission = async (): Promise<boolean> => {
  if (IS_IOS) {
    return (await check(PERMISSIONS.IOS.CAMERA)) === RESULTS.GRANTED;
  } else {
    return (await check(PERMISSIONS.ANDROID.CAMERA)) === RESULTS.GRANTED;
  }
};

export const requestGalleryUsagePermission = async (): Promise<void> => {
  if (IS_IOS) {
    await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
  } else {
    await request(PERMISSIONS.ANDROID.READ_MEDIA_IMAGES);
  }
};

export const checkGalleryUsagePermission = async (): Promise<boolean> => {
  if (IS_IOS) {
    const result = await check(PERMISSIONS.IOS.PHOTO_LIBRARY);
    return result === RESULTS.GRANTED || result === RESULTS.LIMITED;
  } else {
    const result = await check(PERMISSIONS.ANDROID.READ_MEDIA_IMAGES);
    return result === RESULTS.GRANTED;
  }
};

//notifications permission
export const requestNotificationsPermission = async () => {
  const settings = await notifee.requestPermission();

  if (
    settings.authorizationStatus === AuthorizationStatus.DENIED ||
    settings.authorizationStatus === AuthorizationStatus.NOT_DETERMINED
  ) {
    Alert.alert(
      'Turn on notifications',
      'Please turn on notifications to receive information about trips, new events and more',
      [
        {
          text: 'Not now',
        },
        {
          text: 'Settings',
          onPress: Linking.openSettings,
        },
      ],
    );
  }
};
