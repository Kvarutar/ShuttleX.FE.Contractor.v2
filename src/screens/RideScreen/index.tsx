import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Pressable, SafeAreaView, StyleSheet, View } from 'react-native';
import { getLocales } from 'react-native-localize';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import {
  Bar,
  BottomWindow,
  Button,
  ButtonModes,
  ClockIcon,
  MenuIcon,
  NotificationIcon,
  Popup,
  PreferencesIcon,
  RoundButton,
  sizes,
  StatisticsIcon,
  SwipeButton,
  SwipeButtonModes,
  Text,
  Timer,
  TimerModes,
  useTheme,
} from 'shuttlex-integration';

import Offer from './Offer';
import Order from './Order';
import { offerType, type RideScreenProps, RideStatus } from './props';
import RidePreferences from './RidePreferences';

type lineStates = 'online' | 'offline';

type lineStateTypes = {
  popupTitle: string;
  toLineState: lineStates;
  bottomTitle: string;
  buttonText: string;
  buttonMode: ButtonModes;
  swipeMode: SwipeButtonModes;
};

const dateOptions: Intl.DateTimeFormatOptions = {
  year: '2-digit',
  month: '2-digit',
  day: '2-digit',
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
  const [offer, setOffer] = useState<offerType>();
  const [isOfferAccepted, setIsOfferAccepted] = useState<boolean>(false);

  const [isRideContinues, setIsRideContinues] = useState<boolean>(false);

  const [rideStatus, setRideStatus] = useState<RideStatus>(RideStatus.Idle);

  const [isPassangerLate, setIsPassangerLate] = useState<boolean>(false);

  const [lineState, setLineState] = useState<lineStateTypes>(rideBuilderRecord.offline);
  const currentDate = new Intl.DateTimeFormat(getLocales()[0].languageTag, dateOptions).format(new Date());

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
      startPosition: 'John F. Kennedy Blvd, Jersey City, NJ',
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
    });
  }, []);

  const swipeHandler = (mode: lineStates) => {
    setLineState(rideBuilderRecord[mode]);
    setIsConfirmationPopupVisible(false);
  };

  const onOfferPopupClose = () => {
    setIsOfferPopupVisible(false);
    setOffer(undefined);
  };

  const onOfferDecline = () => {
    onOfferPopupClose();
  };

  const onOfferAccept = () => {
    setIsOfferPopupVisible(false);
    setIsOfferAccepted(true);
    setIsRideContinues(true);
  };

  const headerTimer = () => {
    if (rideStatus === RideStatus.Arrived) {
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
        <View style={styles.headerRightButtons}>
          <RoundButton>
            <NotificationIcon />
          </RoundButton>
          {headerTimer()}
        </View>
      </View>
      {offer && isOfferAccepted && isRideContinues ? (
        <Order
          offer={offer}
          rideStatus={rideStatus}
          setRideStatus={setRideStatus}
          endRide={() => setIsRideContinues(false)}
        />
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
          <Bar style={styles.card} isActive>
            <Image source={require('shuttlex-integration/src/assets/img/BasicX.png')} style={styles.img} />
            <View style={styles.textWrapper}>
              <Text style={computedStyles.title}>BasicX</Text>
              <View style={styles.dateWrapper}>
                <ClockIcon />
                <Text style={[styles.date, computedStyles.dateText]}>{currentDate}</Text>
              </View>
            </View>
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
        <Popup
          onCloseButtonPress={() => setIsPreferencesPopupVisible(false)}
          bottomWindowStyle={styles.preferencesPopup}
        >
          <RidePreferences tarifs={['BasicX', 'BasicXL', 'ComfortX']} />
        </Popup>
      )}
      {offer && isOfferPopupVisible && (
        <>
          <Popup>
            <Offer
              offerPoints={[offer.startPosition, ...offer.targetPointsPosition]}
              onOfferAccept={onOfferAccept}
              onOfferDecline={onOfferDecline}
            />
          </Popup>
          <Animated.View
            style={styles.timer}
            exiting={FadeOut.duration(timerAnimationDuration)}
            entering={FadeIn.duration(timerAnimationDuration)}
          >
            <Timer
              initialDate={new Date(new Date().getTime() + 20000)} //20000 - for test
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
  img: {
    width: 90,
    height: 57,
  },
  textWrapper: {
    marginRight: 20,
    marginLeft: 2,
  },
  dateWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
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
  date: {
    fontSize: 12,
    marginLeft: 4,
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
  preferencesPopup: {
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  timer: {
    position: 'absolute',
    top: sizes.paddingVertical,
    right: sizes.paddingHorizontal,
  },
  orderWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderInfoWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  orderMetaWrapper: {
    flexDirection: 'row',
    gap: 15,
  },
  orderMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderMetaText: {
    fontSize: 12,
  },
  orderPassangerName: {
    fontFamily: 'Inter Medium',
    fontSize: 18,
    marginBottom: 6,
  },
  orderPassangerAvatar: {
    width: 73,
    height: 73,
    borderRadius: 100,
  },
  orderPassangerAvatarImage: {
    width: 62,
    height: 62,
  },
  phoneButton: {
    height: 52,
    width: 52,
    borderRadius: 22,
  },
  additionalHeaderButtons: {
    marginTop: 30,
  },
});

export default RideScreen;
