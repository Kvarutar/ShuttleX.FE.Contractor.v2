import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, SafeAreaView, StyleSheet, View } from 'react-native';
import { openSettings } from 'react-native-permissions';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import {
  Alert,
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
  SquareButtonModes,
  Text,
  useTheme,
} from 'shuttlex-integration';

import { getFullTariffsInfo } from '../../../core/contractor/redux/thunks';
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
import UnclosablePopupWithModes from './popups/UnclosablePopupWithModes';
import { UnclosablePopupModes } from './popups/UnclosablePopupWithModes/props';
import { DocResponseStatus, type RideScreenProps } from './props';
import Start from './Start';

const RideScreen = ({ navigation }: RideScreenProps): JSX.Element => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const dispatch = useAppDispatch();

  useGeolocationStartWatch();
  useNetworkConnectionStartWatch();

  const order = useSelector(orderSelector);
  const isPermissionGranted = useSelector(geolocationIsPermissionGrantedSelector);
  const isLocationEnabled = useSelector(geolocationIsLocationEnabledSelector);
  const geolocationAccuracy = useSelector(geolocationAccuracySelector);
  const unreadNotifications = useSelector(numberOfUnreadNotificationsSelector);

  const insets = useSafeAreaInsets();
  const iosPaddingVertical = insets.bottom ? 0 : sizes.paddingVertical / 2;

  //TODO add logic for getting confirmed email
  const [isEmailVerified, setEmailVerified] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState<boolean>(false);
  const [docStatus, setDocStatus] = useState<DocResponseStatus | null>(null);

  const computedStyles = StyleSheet.create({
    topButtonsContainer: {
      paddingTop: Platform.OS === 'android' ? sizes.paddingVertical : iosPaddingVertical,
    },
    unreadNotificationsMarker: {
      backgroundColor: colors.errorColor,
    },
    unreadNotificationsText: {
      color: colors.backgroundPrimaryColor,
    },
  });

  useEffect(() => {
    //TODO: Add receiving zones and zoneId
    dispatch(getFullTariffsInfo());
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

  //TODO add correct logic for get Document status from backend
  const fetchDocumentStatus = async (): Promise<DocResponseStatus> => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(DocResponseStatus.Approved);
        setEmailVerified(true);
      }, 5000);
    });
  };

  useEffect(() => {
    (async () => {
      const result = await fetchDocumentStatus();
      setDocStatus(result);
    })();
  }, []);

  const determinePopupMode = (status: DocResponseStatus): UnclosablePopupModes | null => {
    switch (status) {
      case DocResponseStatus.None:
        return UnclosablePopupModes.DocumentRejectedError;
      case DocResponseStatus.UnderReview:
        return UnclosablePopupModes.DocumentUnderReview;
      case DocResponseStatus.RequireUpdate:
        return UnclosablePopupModes.DocumentRejected;
      case DocResponseStatus.Expired:
        return UnclosablePopupModes.CompleteVerification;
      default:
        return null;
    }
  };

  const determinePopupButton = (status: DocResponseStatus): JSX.Element | null => {
    switch (status) {
      case DocResponseStatus.None:
      case DocResponseStatus.UnderReview:
        return (
          <Button
            style={styles.popupButton}
            shape={ButtonShapes.Square}
            mode={SquareButtonModes.Mode2}
            text={t('ride_Ride_supportButton')}
            onPress={() => {
              /* TODO: add logic for navigate */
            }}
          />
        );
      case DocResponseStatus.RequireUpdate:
        return (
          <Button
            style={styles.popupButton}
            shape={ButtonShapes.Square}
            mode={SquareButtonModes.Mode2}
            text={t('ride_Ride_completeButton')}
            onPress={() => navigation.navigate('Docs')}
          />
        );
      case DocResponseStatus.Expired:
        return (
          <Button
            style={styles.popupButton}
            shape={ButtonShapes.Square}
            text={t('ride_Ride_completeButton')}
            onPress={() => navigation.navigate('Docs')}
          />
        );
      default:
        return null;
    }
  };

  const statusMode = docStatus ? determinePopupMode(docStatus) : null;
  const popupButton = docStatus ? determinePopupButton(docStatus) : null;

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
          <Alert
            isVisible={isEmailVerified}
            text={t('ride_Ride_EmailAlert')}
            backgroundColor={colors.errorColor}
            textColor={colors.textTertiaryColor}
          />
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
      {docStatus && statusMode && <UnclosablePopupWithModes mode={statusMode} bottomAdditionalContent={popupButton} />}
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
  popupButton: {
    marginTop: 76,
  },
});

export default RideScreen;
