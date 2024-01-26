import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, SafeAreaView, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useSelector } from 'react-redux';
import {
  Bar,
  BottomWindow,
  Button,
  ButtonModes,
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

import { useAppDispatch } from '../../core/redux/hooks';
import { setOrder } from '../../core/ride/redux/trip';
import { orderSelector, tripStatusSelector } from '../../core/ride/redux/trip/selectors';
import { OfferType, TripStatus } from '../../core/ride/redux/trip/types';
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

const timerAnimationDuration = 300;

const RideScreen = ({}: RideScreenProps): JSX.Element => {
  const { t } = useTranslation();
  const rideBuilderRecord: Record<lineStates, lineStateTypes> = {
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
  };

  const { colors } = useTheme();
  const [isConfirmationPopupVisible, setIsConfirmationPopupVisible] = useState<boolean>(false);
  const [isPreferencesPopupVisible, setIsPreferencesPopupVisible] = useState<boolean>(false);

  const [isOfferPopupVisible, setIsOfferPopupVisible] = useState<boolean>(false);
  const [offer, setOffer] = useState<OfferType>();

  const order = useSelector(orderSelector);
  const tripStatus = useSelector(tripStatusSelector);
  const dispatch = useAppDispatch();

  const [isPassangerLate, setIsPassangerLate] = useState<boolean>(false);

  const [lineState, setLineState] = useState<lineStateTypes>(rideBuilderRecord.offline);

  const {
    textPrimaryColor,
    textSecondaryColor,
    backgroundPrimaryColor,
    primaryGradientStartColor,
    primaryColor,
    secondaryGradientEndColor,
    secondaryGradientStartColor,
  } = colors;

  const computedStyles = StyleSheet.create({
    title: {
      color: textPrimaryColor,
    },
    dateText: {
      color: textSecondaryColor,
    },
    map: {
      backgroundColor: backgroundPrimaryColor,
    },
    orderMetaText: {
      color: textSecondaryColor,
    },
  });

  useEffect(() => {
    setOffer({
      startPosition:
        'John F. Kennedy Blvd, Jersey City, NJJohn F. Kennedy Blvd, Jersey City, NJJohn F. Kennedy Blvd, Jersey City, NJJohn F. Kennedy Blvd, Jersey City, NJJohn F. Kennedy Blvd, Jersey City, NJ',
      targetPointsPosition: [
        'John F. Kennedy Blvd, Jersey City, NJ',
        'John F. Kennedy Blvd, Jersey City, NJ',
        'John F. Kennedy Blvd, Jersey City, NJ',
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
    setLineState(rideBuilderRecord[mode]);
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
    if (tripStatus === TripStatus.Arrived) {
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

  const { popupTitle, toLineState, bottomTitle, buttonText, buttonMode, swipeMode } = lineState;
  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={[styles.map, computedStyles.map]}>
        <Text>Карта</Text>
      </View>
      <View style={styles.headerButtonsContainer}>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerButtonsContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: sizes.paddingVertical,
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: sizes.paddingHorizontal,
  },
  headerRightButtons: {
    alignItems: 'center',
  },
  wrapper: {
    flex: 1,
    position: 'relative',
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
  map: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
