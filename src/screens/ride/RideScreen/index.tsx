import { useEffect, useState } from 'react';
import { Platform, SafeAreaView, StyleSheet, View } from 'react-native';
import { openSettings } from 'react-native-permissions';
import { useSelector } from 'react-redux';
import {
  Button,
  ButtonShapes,
  ButtonSizes,
  CircleButtonModes,
  IntegrationModule,
  LocationUnavailable,
  LocationUnavailableProps,
  MenuIcon,
  NotificationIcon,
  NotificationType,
  sizes,
  Text,
  useTheme,
} from 'shuttlex-integration';

import { setProfile } from '../../../core/contractor/redux';
import { profileSelector } from '../../../core/contractor/redux/selectors';
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
import { orderSelector } from '../../../core/ride/redux/trip/selectors';
import Menu from '../Menu';
import MapCameraModeButton from './MapCameraModeButton';
import MapView from './MapView';
import Order from './Order';
import { type RideScreenProps } from './props';
import Start from './Start';

const RideScreen = ({ navigation }: RideScreenProps): JSX.Element => {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();

  useGeolocationStartWatch();
  useNetworkConnectionStartWatch();

  const order = useSelector(orderSelector);
  const isPermissionGranted = useSelector(geolocationIsPermissionGrantedSelector);
  const isLocationEnabled = useSelector(geolocationIsLocationEnabledSelector);
  const geolocationAccuracy = useSelector(geolocationAccuracySelector);
  const unreadNotifications = useSelector(numberOfUnreadNotificationsSelector);
  const profile = useSelector(profileSelector);

  const [isMenuVisible, setIsMenuVisible] = useState<boolean>(false);

  const computedStyles = StyleSheet.create({
    topButtonsContainer: {
      paddingTop: Platform.OS === 'android' ? sizes.paddingVertical : 0,
    },
    unreadNotificationsMarker: {
      backgroundColor: colors.errorColor,
    },
    unreadNotificationsText: {
      color: colors.backgroundPrimaryColor,
    },
  });

  useEffect(() => {
    if (!profile) {
      dispatch(
        setProfile({
          fullName: 'John Smith',
          email: 'mail@mail.ru',
          phone: '+79990622720',
          imageUri:
            'https://sun9-34.userapi.com/impg/ZGuJiFBAp-93En3yLK7LWZNPxTGmncHrrtVgbg/hd6uHaUv1zE.jpg?size=1200x752&quality=96&sign=e79799e4b75c839d0ddb1a2232fe5d60&type=album',
        }),
      );
    }
  }, [dispatch, profile]);

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
          IntegrationModule.navigateToLocationSettings();
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
    <>
      <SafeAreaView style={styles.wrapper}>
        <MapView />
        <View style={[styles.topButtonsContainer, computedStyles.topButtonsContainer]}>
          <Button
            circleSubContainerStyle={styles.topButton}
            onPress={() => setIsMenuVisible(true)}
            shape={ButtonShapes.Circle}
            mode={CircleButtonModes.Mode2}
            size={ButtonSizes.S}
            disableShadow
          >
            <MenuIcon />
          </Button>
          <View style={styles.topRightButtonContainer}>
            <View>
              <Button
                circleSubContainerStyle={styles.topButton}
                onPress={() => navigation.navigate('Notifications')}
                shape={ButtonShapes.Circle}
                mode={CircleButtonModes.Mode2}
                size={ButtonSizes.S}
              >
                <NotificationIcon />
              </Button>
              {unreadNotificationsMarker}
            </View>
          </View>
        </View>
        {order ? (
          <>
            <MapCameraModeButton />
            <Order />
          </>
        ) : (
          <Start />
        )}
        {locationUnavailableProps && <LocationUnavailable {...locationUnavailableProps} />}
      </SafeAreaView>
      {isMenuVisible && <Menu onClose={() => setIsMenuVisible(false)} />}
    </>
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
  topButton: {
    borderWidth: 0,
  },
  topRightButtonContainer: {
    alignItems: 'center',
  },
});

export default RideScreen;
