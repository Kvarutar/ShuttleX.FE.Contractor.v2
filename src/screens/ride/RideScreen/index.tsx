import React, { useEffect, useState } from 'react';
import { NativeModules, Platform, SafeAreaView, StyleSheet, View } from 'react-native';
import { openSettings } from 'react-native-permissions';
import { useSelector } from 'react-redux';
import {
  LocationUnavailable,
  LocationUnavailableProps,
  MenuIcon,
  NotificationIcon,
  NotificationType,
  RoundButton,
  sizes,
  StopWatch,
  Text,
  useTheme,
} from 'shuttlex-integration';

import { setNotificationList } from '../../../core/menu/redux/notifications';
import { numberOfUnreadNotificationsSelector } from '../../../core/menu/redux/notifications/selectors';
import { useAppDispatch } from '../../../core/redux/hooks';
import { useGeolocationStartWatch, useNetworkConnectionStartWatch } from '../../../core/ride/hooks';
import {
  setGeolocationAccuracy,
  setGeolocationIsLocationEnabled,
  setGeolocationIsPermissionGranted,
} from '../../../core/ride/redux/geolocation';
import {
  geolocationAccuracySelector,
  geolocationIsLocationEnabledSelector,
  geolocationIsPermissionGrantedSelector,
} from '../../../core/ride/redux/geolocation/selectors';
import { orderSelector, tripStatusSelector } from '../../../core/ride/redux/trip/selectors';
import { TripStatus } from '../../../core/ride/redux/trip/types';
import MapCameraModeButton from './MapCameraModeButton';
import MapView from './MapView';
import Order from './Order';
import PassengerTimer from './PassengerTimer';
import { type RideScreenProps } from './props';
import Start from './Start';

const RideScreen = ({ navigation }: RideScreenProps): JSX.Element => {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();

  useGeolocationStartWatch();
  useNetworkConnectionStartWatch();

  const order = useSelector(orderSelector);
  const tripStatus = useSelector(tripStatusSelector);
  const isPermissionGranted = useSelector(geolocationIsPermissionGrantedSelector);
  const isLocationEnabled = useSelector(geolocationIsLocationEnabledSelector);
  const geolocationAccuracy = useSelector(geolocationAccuracySelector);
  const unreadNotifications = useSelector(numberOfUnreadNotificationsSelector);

  const [isPassengerLate, setIsPassengerLate] = useState<boolean>(false);

  const computedStyles = StyleSheet.create({
    topButtonsContainer: {
      paddingTop: Platform.OS === 'android' ? sizes.paddingVertical : 0,
    },
    unreadNotificationsMarker: {
      backgroundColor: colors.primaryColor,
    },
    unreadNotificationsText: {
      color: colors.backgroundPrimaryColor,
    },
  });

  useEffect(() => {
    if (tripStatus === TripStatus.Ride || tripStatus === TripStatus.Idle) {
      setIsPassengerLate(false);
    }
  }, [tripStatus]);

  useEffect(() => {
    dispatch(
      setNotificationList([
        {
          type: NotificationType.TripWasRated,
          title: 'Jack Johnson',
          description: 'rated the trip with you',
          isRead: true,
          time: '5m ago',
          image: {
            uri: 'https://sun9-34.userapi.com/impg/ZGuJiFBAp-93En3yLK7LWZNPxTGmncHrrtVgbg/hd6uHaUv1zE.jpg?size=1200x752&quality=96&sign=e79799e4b75c839d0ddb1a2232fe5d60&type=album',
          },
        },
        {
          type: NotificationType.RatingIncreased,
          title: 'Rating increased',
          description: 'Your rating was increased to 4.6',
          isRead: false,
          time: '5m ago',
        },
        {
          type: NotificationType.PlannedTrip,
          title: 'Booked time',
          description: 'You have to make booked trip right now',
          isRead: true,
          time: '5m ago',
        },
        {
          type: NotificationType.RatingIncreased,
          title: 'Jack Johnson',
          description: 'rated the trip with you',
          isRead: true,
          time: '5m ago',
        },
        {
          type: NotificationType.RatingIncreased,
          title: 'Jack Johnson',
          description: 'rated the trip with you',
          isRead: false,
          time: '5m ago',
        },
        {
          type: NotificationType.RatingIncreased,
          title: 'Jack Johnson',
          description: 'rated the trip with you',
          isRead: true,
          time: '5m ago',
        },
        {
          type: NotificationType.RatingIncreased,
          title: 'Jack Johnson',
          description: 'rated the trip with you',
          isRead: true,
          time: '5m ago',
        },
      ]),
    );
  }, [dispatch]);

  let locationUnavailableProps: LocationUnavailableProps | null = null;
  if (!isPermissionGranted) {
    locationUnavailableProps = {
      reason: 'permission_denied',
      onButtonPress: () => {
        openSettings();
        dispatch(setGeolocationIsPermissionGranted(true));
      },
    };
  } else if (!isLocationEnabled) {
    locationUnavailableProps = {
      reason: 'location_disabled',
      onButtonPress: () => {
        if (Platform.OS === 'ios') {
          openSettings();
        } else {
          NativeModules.CustomModule.navigateToLocationSettings(); // only for android
        }
        dispatch(setGeolocationIsLocationEnabled(true));
      },
    };
  } else if (geolocationAccuracy !== 'full') {
    locationUnavailableProps = {
      reason: 'accuracy_reduced',
      onButtonPress: () => {
        openSettings();
        dispatch(setGeolocationAccuracy('full'));
      },
    };
  }

  let unreadNotificationsMarker = null;
  if (unreadNotifications > 0) {
    unreadNotificationsMarker = (
      <View style={[styles.unreadNotificationsMarker, computedStyles.unreadNotificationsMarker]}>
        <Text style={[styles.unreadNotificationsText, computedStyles.unreadNotificationsText]}>
          {unreadNotifications}
        </Text>
      </View>
    );
  } else if (unreadNotifications > 99) {
    unreadNotificationsMarker = (
      <View style={[styles.unreadNotificationsMarker, computedStyles.unreadNotificationsMarker]}>
        <Text style={[styles.unreadNotificationsText, computedStyles.unreadNotificationsText]}>99+</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.wrapper}>
      <MapView />
      <View style={[styles.topButtonsContainer, computedStyles.topButtonsContainer]}>
        <RoundButton>
          <MenuIcon />
        </RoundButton>
        <StopWatch initialDate={new Date()} mask="{h}h {m}m" />
        <View style={styles.topRightButtonContainer}>
          <RoundButton onPress={() => navigation.navigate('Notifications')}>
            <NotificationIcon />
            {unreadNotificationsMarker}
          </RoundButton>
          {(tripStatus === TripStatus.Arrived || tripStatus === TripStatus.ArrivedAtStopPoint) && (
            <PassengerTimer isPassengerLate={isPassengerLate} setIsPassengerLate={() => setIsPassengerLate(true)} />
          )}
        </View>
      </View>
      {order ? (
        <>
          <Order />
          <MapCameraModeButton />
        </>
      ) : (
        <Start />
      )}
      {locationUnavailableProps && <LocationUnavailable {...locationUnavailableProps} />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  unreadNotificationsMarker: {
    position: 'absolute',
    right: -4,
    bottom: -4,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
  },
  unreadNotificationsText: {
    fontFamily: 'Inter Medium',
    fontSize: 9,
  },
  wrapper: {
    flex: 1,
  },
  topButtonsContainer: {
    paddingHorizontal: sizes.paddingHorizontal,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  topRightButtonContainer: {
    alignItems: 'center',
  },
});

export default RideScreen;
