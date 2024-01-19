import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import {
  Button,
  ButtonModes,
  ChatIcon,
  ClockIcon,
  DropOffIcon,
  ExternalMapIcon,
  LocationIcon,
  PassengerIcon,
  PickUpIcon,
  RoundButton,
  SwipeButton,
  SwipeButtonModes,
  Text,
  useTheme,
} from 'shuttlex-integration';

import { offerType, RideStatus } from '../../props';
import { VisiblePartProps } from './props';

const VisiblePart = ({ offer, rideStatus, setRideStatus, endRide }: VisiblePartProps) => {
  const { t } = useTranslation();

  useEffect(() => {
    setTimeout(() => {
      setRideStatus(RideStatus.Arriving); //for test
    }, 10000);
  }, [setRideStatus]);

  const mainContent = {
    idle: <AddressWithMeta offer={offer} />,
    arriving: <AddressWithPassengerInfo offer={offer} />,
    arrivingAtStopPoint: <AddressWithPassengerInfo withStopPoint offer={offer} />,
    arrived: <AddressWithExtendedPassengerInfo offer={offer} />,
    arrivedAtStopPoint: <AddressWithExtendedPassengerInfo withStopPoint offer={offer} />,
    ride: <AddressWithMeta offer={offer} />,
    ending: <AddressWithExtendedPassengerInfo offer={offer} />,
  };

  const statusSwitchers = {
    idle: null,
    arriving: (
      <StatusSwitcher>
        <Button
          mode={ButtonModes.Mode1}
          text={t('ride_Ride_Order_arrivedButton')}
          onPress={() => setRideStatus(RideStatus.Arrived)}
        />
      </StatusSwitcher>
    ),
    arrivingAtStopPoint: (
      <StatusSwitcher>
        <Button
          mode={ButtonModes.Mode1}
          text={t('ride_Ride_Order_arrivedToStopButton')}
          onPress={() => setRideStatus(RideStatus.ArrivedAtStopPoint)}
        />
      </StatusSwitcher>
    ),
    arrived: (
      <StatusSwitcher>
        <SwipeButton
          mode={SwipeButtonModes.Confirm}
          onSwipeEnd={() => setRideStatus(RideStatus.Ride)}
          text={t('ride_Ride_Order_pickUpButton')}
        />
      </StatusSwitcher>
    ),
    arrivedAtStopPoint: (
      <StatusSwitcher>
        <SwipeButton
          mode={SwipeButtonModes.Confirm}
          onSwipeEnd={() => setRideStatus(RideStatus.Ride)}
          text={t('ride_Ride_Order_pickUpButton')}
        />
      </StatusSwitcher>
    ),
    ride: null,
    ending: (
      <StatusSwitcher>
        <SwipeButton
          mode={SwipeButtonModes.Confirm}
          onSwipeEnd={endRide}
          text={t('ride_Ride_Order_finishRideButton')}
        />
      </StatusSwitcher>
    ),
  };

  let wrapperStyle;
  if (rideStatus === RideStatus.ArrivedAtStopPoint || rideStatus === RideStatus.ArrivingAtStopPoint) {
    wrapperStyle = styles.alignFlexStart;
  }

  return (
    <>
      <View style={[styles.visible, wrapperStyle]}>{mainContent[rideStatus]}</View>
      {statusSwitchers[rideStatus]}
    </>
  );
};

const AddressWithMeta = ({ offer }: { offer: offerType }) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const computedStyles = StyleSheet.create({
    orderMetaText: {
      color: colors.textSecondaryColor,
    },
  });

  return (
    <>
      <View>
        <View style={styles.visibleHeader}>
          <DropOffIcon />
          <Text numberOfLines={1} style={styles.address}>
            {offer.startPosition}
          </Text>
        </View>
        <View style={styles.visibleContent}>
          <View style={styles.visibleContentItem}>
            <ClockIcon />
            <Text style={computedStyles.orderMetaText}>{t('ride_Ride_Order_minutes', { count: 25 })}</Text>
          </View>
          <View style={styles.visibleContentItem}>
            <LocationIcon />
            <Text style={computedStyles.orderMetaText}>{t('ride_Ride_Order_kilometers', { count: 20.4 })}</Text>
          </View>
        </View>
      </View>
      <Button mode={ButtonModes.Mode3} buttonStyle={styles.visibleButton}>
        <ExternalMapIcon />
      </Button>
    </>
  );
};

const AddressWithPassengerInfo = ({ offer, withStopPoint = false }: { offer: offerType; withStopPoint?: boolean }) => {
  const { colors } = useTheme();

  const computedStyles = StyleSheet.create({
    passengerName: {
      color: colors.textSecondaryColor,
    },
  });

  return (
    <>
      <View>
        <View style={styles.visibleHeader}>
          <PickUpIcon />
          <Text numberOfLines={1} style={styles.address}>
            {offer.startPosition}
          </Text>
        </View>
        {withStopPoint && (
          <View style={[styles.visibleHeader, styles.secondPoint]}>
            <DropOffIcon />
            <Text numberOfLines={1} style={styles.address}>
              {offer.startPosition}
            </Text>
          </View>
        )}
        <View style={styles.visibleContentWithoutGap}>
          <PassengerIcon />
          <Text style={[computedStyles.passengerName, styles.visibleMiniPassengerName]}>
            {offer.passenger.name} {offer.passenger.lastName}
          </Text>
        </View>
      </View>
      <Button mode={ButtonModes.Mode3} buttonStyle={styles.visibleButton}>
        <ChatIcon />
      </Button>
    </>
  );
};

const AddressWithExtendedPassengerInfo = ({
  offer,
  withStopPoint = false,
}: {
  offer: offerType;
  withStopPoint?: boolean;
}) => {
  const { colors } = useTheme();

  const computedStyles = StyleSheet.create({
    addressMini: {
      color: colors.textSecondaryColor,
    },
  });

  return (
    <>
      <View style={styles.passangerInfoWithAvatar}>
        <RoundButton roundButtonStyle={styles.passengerAvatarWrapper}>
          <Image style={styles.passengerAvatar} source={require('../../../../assets/img/Man.png')} />
        </RoundButton>
        <View>
          <Text style={styles.passangerInfoWithAvatarText}>
            {offer.passenger.name} {offer.passenger.lastName}
          </Text>
          <View style={styles.addressMiniWrapper}>
            {withStopPoint ? <PickUpIcon /> : <DropOffIcon />}
            <Text numberOfLines={1} style={[styles.addressMini, computedStyles.addressMini]}>
              {offer.startPosition}
            </Text>
          </View>
          {withStopPoint && (
            <View style={[styles.addressMiniWrapper, styles.withoutMarginTop]}>
              <DropOffIcon />
              <Text numberOfLines={1} style={[styles.addressMini, computedStyles.addressMini]}>
                {offer.startPosition}
              </Text>
            </View>
          )}
        </View>
      </View>
      <Button mode={ButtonModes.Mode3} buttonStyle={styles.visibleButton}>
        <ChatIcon />
      </Button>
    </>
  );
};

const StatusSwitcher = ({ children }: { children: React.ReactNode }) => (
  <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.statusSwitcher}>
    {children}
  </Animated.View>
);

export default VisiblePart;

const styles = StyleSheet.create({
  visible: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  alignFlexStart: {
    alignItems: 'flex-start',
  },
  visibleHeader: {
    flexDirection: 'row',
  },
  address: {
    fontFamily: 'Inter Medium',
    maxWidth: 284,
  },
  addressMini: {
    fontFamily: 'Inter Medium',
    maxWidth: 220,
    fontSize: 12,
  },
  addressMiniWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: -4,
    marginTop: 6,
  },
  withoutMarginTop: {
    marginTop: 0,
  },
  visibleContent: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
  },
  visibleContentWithoutGap: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
    marginLeft: 4,
  },
  visibleContentItem: {
    flexDirection: 'row',
    gap: 4,
  },
  visibleMiniPassengerName: {
    fontSize: 14,
    marginLeft: 2,
  },
  statusSwitcher: {
    marginTop: 26,
  },
  visibleButton: {
    height: 52,
    width: 52,
  },
  passengerAvatarWrapper: {
    width: 61,
    height: 61,
    borderRadius: 100,
  },
  passengerAvatar: {
    width: 52,
    height: 52,
  },
  passangerInfoWithAvatar: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  passangerInfoWithAvatarText: {
    fontFamily: 'Inter Medium',
    maxWidth: 220,
  },
  secondPoint: {
    marginTop: 6,
  },
});
