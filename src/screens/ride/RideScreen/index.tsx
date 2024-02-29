import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NativeModules, Platform, Pressable, SafeAreaView, StyleSheet, View } from 'react-native';
import { openSettings } from 'react-native-permissions';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useSelector } from 'react-redux';
import {
  Bar,
  BottomWindow,
  Button,
  ButtonModes,
  LocationUnavailable,
  LocationUnavailableProps,
  MenuIcon,
  NotificationIcon,
  Popup,
  PreferencesIcon,
  RoundButton,
  sizes,
  StatisticsIcon,
  StopWatch,
  SwipeButton,
  SwipeButtonModes,
  Text,
  Timer,
  TimerModes,
  useTheme,
} from 'shuttlex-integration';

import { useAppDispatch } from '../../../core/redux/hooks';
import { useGeolocationStartWatch } from '../../../core/ride/hooks';
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
import { setOrder } from '../../../core/ride/redux/trip';
import { orderSelector, tripStatusSelector } from '../../../core/ride/redux/trip/selectors';
import { OfferType, TripStatus } from '../../../core/ride/redux/trip/types';
import Offer from './Offer';
import Order from './Order';
import { type RideScreenProps } from './props';
import RidePreferences from './RidePreferences';
import TarifsCarousel from './TarifsCarousel';

type lineStates = 'online' | 'offline';

type lineStateTypes = {
  popupTitle: string;
  toLineState: lineStates;
  bottomTitle: string;
  buttonText: string;
  buttonMode: ButtonModes;
  swipeMode: SwipeButtonModes;
};

const getRideBuilderRecord = (t: ReturnType<typeof useTranslation>['t']): Record<lineStates, lineStateTypes> => ({
  online: {
    popupTitle: t('ride_Ride_Popup_onlineTitle'),
    toLineState: 'offline',
    bottomTitle: t('ride_Ride_BottomWindow_onlineTitle'),
    buttonText: t('ride_Ride_Bar_onlineTitle'),
    buttonMode: ButtonModes.Mode3,
    swipeMode: SwipeButtonModes.Decline,
  },
  offline: {
    popupTitle: t('ride_Ride_Popup_offlineTitle'),
    toLineState: 'online',
    bottomTitle: t('ride_Ride_BottomWindow_offlineTitle'),
    buttonText: t('ride_Ride_Bar_offlineTitle'),
    buttonMode: ButtonModes.Mode1,
    swipeMode: SwipeButtonModes.Confirm,
  },
});

const timerAnimationDuration = 300;

const RideScreen = ({}: RideScreenProps): JSX.Element => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  useGeolocationStartWatch();

  const order = useSelector(orderSelector);
  const tripStatus = useSelector(tripStatusSelector);
  const isPermissionGranted = useSelector(geolocationIsPermissionGrantedSelector);
  const isLocationEnabled = useSelector(geolocationIsLocationEnabledSelector);
  const geolocationAccuracy = useSelector(geolocationAccuracySelector);

  const [isConfirmationPopupVisible, setIsConfirmationPopupVisible] = useState<boolean>(false);
  const [isPreferencesPopupVisible, setIsPreferencesPopupVisible] = useState<boolean>(false);

  const [isOfferPopupVisible, setIsOfferPopupVisible] = useState<boolean>(false);
  const [offer, setOffer] = useState<OfferType>();

  const [isPassangerLate, setIsPassangerLate] = useState<boolean>(false);

  const [lineState, setLineState] = useState<lineStateTypes>(getRideBuilderRecord(t).offline);

  const {
    textPrimaryColor,
    textSecondaryColor,
    primaryGradientStartColor,
    primaryColor,
    secondaryGradientEndColor,
    secondaryGradientStartColor,
  } = colors;

  const computedStyles = StyleSheet.create({
    topButtonsContainer: {
      paddingTop: Platform.OS === 'android' ? sizes.paddingVertical : 0,
    },
    title: {
      color: textPrimaryColor,
    },
    dateText: {
      color: textSecondaryColor,
    },
    orderMetaText: {
      color: textSecondaryColor,
    },
  });

  useEffect(() => {
    if (tripStatus === TripStatus.Ride || tripStatus === TripStatus.Idle) {
      setIsPassangerLate(false);
    }
  }, [tripStatus]);

  useEffect(() => {
    setOffer({
      startPosition: '123 Queen St W, Toronto, ON M5H 2M9',
      targetPointsPosition: [
        '241 Harvie Ave, York, ON M6E 4K9',
        '450 Blythwood Rd, North York, ON M4N 1A9',
        '12 Bushbury Dr, North York, ON M3A 2Z7',
      ],
      passengerId: '0',
      passenger: {
        name: 'Michael',
        lastName: 'Skorodumov',
        phone: '89990622720',
      },
      tripTariff: 'BasicX',
      total: '20.45',
      fullDistance: 20.4,
      fullTime: 25,
    });
  }, []);

  const swipeHandler = (mode: lineStates) => {
    setLineState(getRideBuilderRecord(t)[mode]);
    setIsConfirmationPopupVisible(false);
  };

  const onOfferPopupClose = () => {
    setIsOfferPopupVisible(false);
  };

  const onOfferDecline = () => {
    onOfferPopupClose();
  };

  const onOfferAccept = () => {
    setIsOfferPopupVisible(false);
    if (offer) {
      dispatch(setOrder(offer));
    }
  };

  const headerTimer = () => {
    if (tripStatus === TripStatus.Arrived || tripStatus === TripStatus.ArrivedAtStopPoint) {
      if (isPassangerLate) {
        return (
          <Animated.View
            exiting={FadeOut.duration(timerAnimationDuration)}
            entering={FadeIn.duration(timerAnimationDuration)}
            style={styles.additionalHeaderButtons}
          >
            <Timer
              initialDate={new Date()}
              startColor={secondaryGradientStartColor}
              endColor={secondaryGradientEndColor}
              mode={TimerModes.Mini}
            />
          </Animated.View>
        );
      }
      return (
        <Animated.View
          exiting={FadeOut.duration(timerAnimationDuration)}
          entering={FadeIn.duration(timerAnimationDuration)}
          style={styles.additionalHeaderButtons}
        >
          <Timer
            initialDate={new Date(new Date().getTime() + 20000)} //20000 - for test
            onAfterCountdownEnds={() => setIsPassangerLate(true)}
            startColor={primaryGradientStartColor}
            endColor={primaryColor}
            mode={TimerModes.Mini}
          />
        </Animated.View>
      );
    }
  };

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

  const { popupTitle, toLineState, bottomTitle, buttonText, buttonMode, swipeMode } = lineState;

  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={[styles.topButtonsContainer, computedStyles.topButtonsContainer]}>
        <RoundButton>
          <MenuIcon />
        </RoundButton>
        <StopWatch initialDate={new Date()} mask="{h}h {m}m" />
        <View style={styles.headerRightButtons}>
          <RoundButton>
            <NotificationIcon />
          </RoundButton>
          {headerTimer()}
        </View>
      </View>
      {order ? (
        <Order />
      ) : (
        <BottomWindow style={styles.bottom}>
          <View style={styles.infoWrapper}>
            <Pressable onPress={() => setIsPreferencesPopupVisible(true)} hitSlop={10}>
              <PreferencesIcon />
            </Pressable>
            <Text style={[computedStyles.title, styles.title]}>{bottomTitle}</Text>
            <Pressable onPress={() => setIsOfferPopupVisible(true)} hitSlop={10}>
              <StatisticsIcon />
            </Pressable>
          </View>
          <Bar style={styles.card}>
            <TarifsCarousel />
            <Button mode={buttonMode} text={buttonText} onPress={() => setIsConfirmationPopupVisible(true)} />
          </Bar>
        </BottomWindow>
      )}
      {isConfirmationPopupVisible && (
        <Popup onCloseButtonPress={() => setIsConfirmationPopupVisible(false)}>
          <Text style={[computedStyles.title, styles.confirmTitle, styles.title]}>{popupTitle}</Text>
          <SwipeButton mode={swipeMode} onSwipeEnd={() => swipeHandler(toLineState)} />
        </Popup>
      )}
      {isPreferencesPopupVisible && (
        <Popup onCloseButtonPress={() => setIsPreferencesPopupVisible(false)}>
          <RidePreferences
            tarifs={['BasicX', 'BasicXL', 'ComfortX', 'PremiumX', 'PremiumXL', 'TeslaX']}
            onConfirm={() => setIsPreferencesPopupVisible(false)}
          />
        </Popup>
      )}
      {offer && isOfferPopupVisible && (
        <>
          <Popup>
            <Offer offer={offer} onOfferAccept={onOfferAccept} onOfferDecline={onOfferDecline} />
          </Popup>
          <Animated.View
            style={styles.timer}
            exiting={FadeOut.duration(timerAnimationDuration)}
            entering={FadeIn.duration(timerAnimationDuration)}
          >
            <Timer
              initialDate={new Date(new Date().getTime() + 20000000)} //20000 - for test
              onAfterCountdownEnds={onOfferPopupClose}
              startColor={primaryGradientStartColor}
              endColor={primaryColor}
              mode={TimerModes.Normal}
            />
          </Animated.View>
        </>
      )}
      {locationUnavailableProps && <LocationUnavailable {...locationUnavailableProps} />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  topButtonsContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: sizes.paddingHorizontal,
  },
  headerRightButtons: {
    alignItems: 'center',
  },
  wrapper: {
    flex: 1,
  },
  card: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoWrapper: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 28,
  },
  bottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  confirmTitle: {
    marginBottom: 62,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter Medium',
    textAlign: 'center',
  },
  timer: {
    position: 'absolute',
    top: sizes.paddingVertical,
    right: sizes.paddingHorizontal,
  },
  additionalHeaderButtons: {
    marginTop: 30,
  },
});

export default RideScreen;
