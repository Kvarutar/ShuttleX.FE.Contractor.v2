//TODO uncoment all notification related code when we will need it
import { useNavigationState } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import { openSettings } from 'react-native-permissions';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import {
  Alert,
  Button,
  ButtonShapes,
  IntegrationModule,
  LocationUnavailable,
  LocationUnavailableProps,
  MenuHeader,
  sizes,
  SquareButtonModes,
  useTheme,
} from 'shuttlex-integration';

import { signOut } from '../../../core/auth/redux/thunks';
import {
  contractorInfoStateSelector,
  contractorStatusSelector,
  isContractorInfoLoadingSelector,
} from '../../../core/contractor/redux/selectors';
import { ContractorStatusAPIResponse } from '../../../core/contractor/redux/types';
import { getAccountSettingsVerifyStatus } from '../../../core/menu/redux/accountSettings/thunks';
// import { setNotificationList } from '../../../core/menu/redux/notifications';
// import { numberOfUnreadNotificationsSelector } from '../../../core/menu/redux/notifications/selectors';
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
import { getCancelTripLongPolling, getNewOfferLongPolling } from '../../../core/ride/redux/trip/thunks';
import Menu from '../Menu';
import MapCameraModeButton from './MapCameraModeButton';
import MapView from './MapView';
import Order from './Order';
import UnclosablePopupWithModes from './popups/UnclosablePopupWithModes';
import { UnclosablePopupModes } from './popups/UnclosablePopupWithModes/props';
import { type RideScreenProps } from './props';
import Start from './Start';

//TODO: add logic for repeat request on contractorInfo
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
  // const unreadNotifications = useSelector(numberOfUnreadNotificationsSelector);
  const contractorDocsStatus = useSelector(contractorInfoStateSelector);
  const contractorStatus = useSelector(contractorStatusSelector);

  const isContractorInfoLoading = useSelector(isContractorInfoLoadingSelector);

  const insets = useSafeAreaInsets();
  const iosPaddingVertical = insets.bottom ? 0 : sizes.paddingVertical / 2;

  //TODO add logic for getting confirmed email
  const isEmailVerified = false;
  const [isMenuVisible, setIsMenuVisible] = useState<boolean>(false);

  const androidPaddingTop = StatusBar.currentHeight
    ? StatusBar.currentHeight?.valueOf() + sizes.paddingHorizontal
    : sizes.paddingHorizontal;

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
    menuHeader: {
      paddingTop: Platform.OS === 'android' ? androidPaddingTop : 8,
    },
  });

  //TODO for test
  console.log('contractorDocsStatus', contractorDocsStatus);

  useEffect(() => {
    if (contractorDocsStatus === 'None' && !isContractorInfoLoading) {
      navigation.replace('Verification');
    }
  }, [contractorDocsStatus, navigation, isContractorInfoLoading]);

  useEffect(() => {
    if (order) {
      dispatch(getCancelTripLongPolling({ orderId: order.id }));
    }
  }, [dispatch, order]);

  useEffect(() => {
    if (contractorStatus === 'online') {
      dispatch(getNewOfferLongPolling());
    }
  }, [dispatch, contractorStatus]);

  useEffect(() => {
    dispatch(getAccountSettingsVerifyStatus());
  }, [dispatch]);

  const determinePopupMode = (status: ContractorStatusAPIResponse): UnclosablePopupModes | null => {
    switch (status) {
      case 'RequireVerification':
        return UnclosablePopupModes.CompleteVerification;
      case 'UnderReview':
        return UnclosablePopupModes.DocumentUnderReview;
      case 'RequireDocumentUpdate':
        return UnclosablePopupModes.DocumentRejected;
      case 'UnavailableForWork':
        return UnclosablePopupModes.DocumentRejectedError;
      default:
        return null;
    }
  };

  const determinePopupButton = (status: ContractorStatusAPIResponse): JSX.Element | null => {
    switch (status) {
      case 'UnavailableForWork':
      case 'UnderReview':
        return (
          <View style={styles.popupButtonContainer}>
            <Button
              containerStyle={styles.popupButton}
              shape={ButtonShapes.Square}
              mode={SquareButtonModes.Mode2}
              text={t('ride_Ride_supportButton')}
              onPress={() => {
                /* TODO: add logic for navigate */
              }}
            />
            <Button
              containerStyle={styles.popupButton}
              shape={ButtonShapes.Square}
              mode={SquareButtonModes.Mode4}
              text={t('ride_Ride_logOutButton')}
              onPress={() => dispatch(signOut())}
            />
          </View>
        );
      case 'RequireDocumentUpdate':
        return (
          <Button
            style={styles.popupButton}
            shape={ButtonShapes.Square}
            mode={SquareButtonModes.Mode2}
            text={t('ride_Ride_tryAgainButton')}
            onPress={() => navigation.navigate('Docs')}
          />
        );
      case 'RequireVerification':
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

  const unclosablePopupMode = determinePopupMode(contractorDocsStatus);
  const unclosablePopupContent = determinePopupButton(contractorDocsStatus);

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

  // let unreadNotificationsMarker = null;
  // if (unreadNotifications > 0) {
  //   unreadNotificationsMarker = (
  //     <View style={[styles.unreadNotificationsMarker, computedStyles.unreadNotificationsMarker]}>
  //       <Text style={[styles.unreadNotificationsText, computedStyles.unreadNotificationsText]}>
  //         {unreadNotifications}
  //       </Text>
  //     </View>
  //   );
  // } else if (unreadNotifications > 99) {
  //   unreadNotificationsMarker = (
  //     <View style={[styles.unreadNotificationsMarker, computedStyles.unreadNotificationsMarker]}>
  //       <Text style={[styles.unreadNotificationsText, computedStyles.unreadNotificationsText]}>99+</Text>
  //     </View>
  //   );
  // }

  const currentRoute = useNavigationState(state => state.routes[state.index].name);

  return (
    <>
      {currentRoute === 'Ride' && <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />}
      <SafeAreaView style={styles.wrapper}>
        <MapView />

        <MenuHeader onMenuPress={() => setIsMenuVisible(true)} style={[styles.menuHeader, computedStyles.menuHeader]}>
          <Alert
            isVisible={isEmailVerified}
            text={t('ride_Ride_EmailAlert')}
            backgroundColor={colors.errorColor}
            textColor={colors.textTertiaryColor}
          />
        </MenuHeader>
        <View style={[styles.topButtonsContainer, computedStyles.topButtonsContainer]} />
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
      {unclosablePopupMode && (
        <UnclosablePopupWithModes mode={unclosablePopupMode} bottomAdditionalContent={unclosablePopupContent} />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  // unreadNotificationsMarker: {
  //   position: 'absolute',
  //   right: -4,
  //   bottom: -4,
  //   width: 20,
  //   height: 20,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   borderRadius: 100,
  // },
  menuHeader: {
    paddingHorizontal: sizes.paddingHorizontal,
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
  popupButtonContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  popupButton: {
    marginTop: 76,
    flex: 1,
  },
});

export default RideScreen;
