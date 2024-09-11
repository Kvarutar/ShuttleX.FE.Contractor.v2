import notifee from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import {
  check,
  checkLocationAccuracy,
  LocationAccuracy,
  PERMISSIONS,
  request,
  RESULTS,
} from 'react-native-permissions';

export const requestGeolocationPermission = async (): Promise<void> => {
  if (Platform.OS === 'ios') {
    await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
  } else {
    await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
  }
};

export const checkGeolocationPermissionAndAccuracy = async (): Promise<{
  isGranted: boolean;
  accuracy: LocationAccuracy;
}> => {
  if (Platform.OS === 'ios') {
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
  if (Platform.OS === 'ios') {
    await request(PERMISSIONS.IOS.CAMERA);
  } else {
    await request(PERMISSIONS.ANDROID.CAMERA);
  }
};

export const checkCameraUsagePermission = async (): Promise<boolean> => {
  if (Platform.OS === 'ios') {
    return (await check(PERMISSIONS.IOS.CAMERA)) === RESULTS.GRANTED;
  } else {
    return (await check(PERMISSIONS.ANDROID.CAMERA)) === RESULTS.GRANTED;
  }
};

export const requestGalleryUsagePermission = async (): Promise<void> => {
  if (Platform.OS === 'ios') {
    await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
  } else {
    await request(PERMISSIONS.ANDROID.READ_MEDIA_IMAGES);
  }
};

export const checkGalleryUsagePermission = async (): Promise<boolean> => {
  if (Platform.OS === 'ios') {
    const result = await check(PERMISSIONS.IOS.PHOTO_LIBRARY);
    return result === RESULTS.GRANTED || result === RESULTS.LIMITED;
  } else {
    const result = await check(PERMISSIONS.ANDROID.READ_MEDIA_IMAGES);
    return result === RESULTS.GRANTED;
  }
};

//notifications permission
export const requestNotificationsPermission = async () => {
  if (Platform.OS === 'android') {
    await notifee.requestPermission();
  } else {
    await messaging().requestPermission();
  }
};
