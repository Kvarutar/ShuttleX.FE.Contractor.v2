import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useSelector } from 'react-redux';
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

import { useAppDispatch } from '../../../core/redux/hooks';
import { endTrip, setTripStatus } from '../../../core/ride/redux/trip';
import { orderSelector, tripStatusSelector } from '../../../core/ride/redux/trip/selectors';
import { OrderType, TripStatus } from '../../../core/ride/redux/trip/types';

const VisiblePart = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const order = useSelector(orderSelector);
  const tripStatus = useSelector(tripStatusSelector);

  useEffect(() => {
    setTimeout(() => {
      dispatch(setTripStatus(TripStatus.Arriving)); //for test
    }, 10000);
  }, [dispatch]);

  const mainContent = order && {
    idle: <AddressWithMeta order={order} />,
    arriving: <AddressWithPassengerInfo order={order} />,
    arrivingAtStopPoint: <AddressWithPassengerInfo withStopPoint order={order} />,
    arrived: <AddressWithExtendedPassengerInfo order={order} />,
    arrivedAtStopPoint: <AddressWithExtendedPassengerInfo withStopPoint order={order} />,
    ride: <AddressWithMeta order={order} />,
    ending: <AddressWithExtendedPassengerInfo order={order} />,
  };

  const statusSwitchers = {
    idle: null,
    arriving: (
      <StatusSwitcher>
        <Button
          mode={ButtonModes.Mode1}
          text={t('ride_Ride_Order_arrivedButton')}
          onPress={() => dispatch(setTripStatus(TripStatus.Arrived))}
        />
      </StatusSwitcher>
    ),
    arrivingAtStopPoint: (
      <StatusSwitcher>
        <Button
          mode={ButtonModes.Mode1}
          text={t('ride_Ride_Order_arrivedToStopButton')}
          onPress={() => dispatch(setTripStatus(TripStatus.ArrivedAtStopPoint))}
        />
      </StatusSwitcher>
    ),
    arrived: (
      <StatusSwitcher>
        <SwipeButton
          mode={SwipeButtonModes.Confirm}
          onSwipeEnd={() => dispatch(setTripStatus(TripStatus.Ride))}
          text={t('ride_Ride_Order_pickUpButton')}
        />
      </StatusSwitcher>
    ),
    arrivedAtStopPoint: (
      <StatusSwitcher>
        <SwipeButton
          mode={SwipeButtonModes.Confirm}
          onSwipeEnd={() => dispatch(setTripStatus(TripStatus.Ride))}
          text={t('ride_Ride_Order_pickUpButton')}
        />
      </StatusSwitcher>
    ),
    ride: null,
    ending: (
      <StatusSwitcher>
        <SwipeButton
          mode={SwipeButtonModes.Confirm}
          onSwipeEnd={() => dispatch(endTrip())}
          text={t('ride_Ride_Order_finishRideButton')}
        />
      </StatusSwitcher>
    ),
  };

  let wrapperStyle;
  if (tripStatus === TripStatus.ArrivedAtStopPoint || tripStatus === TripStatus.ArrivingAtStopPoint) {
    wrapperStyle = styles.alignFlexStart;
  }

  if (mainContent) {
    return (
      <>
        <View style={[styles.visible, wrapperStyle]}>{mainContent[tripStatus]}</View>
        {statusSwitchers[tripStatus]}
      </>
    );
  }

  return <></>;
};

const AddressWithMeta = ({ order }: { order: OrderType }) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const computedStyles = StyleSheet.create({
    orderMetaText: {
      color: colors.textSecondaryColor,
    },
  });

  return (
    <>
      <View style={styles.visibleTextWrapper}>
        <View style={styles.visibleHeader}>
          <DropOffIcon />
          <Text numberOfLines={1} style={styles.address}>
            {order.startPosition}
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

const AddressWithPassengerInfo = ({ order, withStopPoint = false }: { order: OrderType; withStopPoint?: boolean }) => {
  const { colors } = useTheme();

  const computedStyles = StyleSheet.create({
    passengerName: {
      color: colors.textSecondaryColor,
    },
  });

  return (
    <>
      <View style={styles.visibleTextWrapper}>
        <View style={styles.visibleHeader}>
          <PickUpIcon />
          <Text numberOfLines={1} style={styles.address}>
            {order.startPosition}
          </Text>
        </View>
        {withStopPoint && (
          <View style={[styles.visibleHeader, styles.secondPoint]}>
            <DropOffIcon />
            <Text numberOfLines={1} style={styles.address}>
              {order.startPosition}
            </Text>
          </View>
        )}
        <View style={styles.visibleContentWithoutGap}>
          <PassengerIcon />
          <Text style={[computedStyles.passengerName, styles.visibleMiniPassengerName]}>
            {order.passenger.name} {order.passenger.lastName}
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
  order,
  withStopPoint = false,
}: {
  order: OrderType;
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
          <Image style={styles.passengerAvatar} source={require('../../../assets/img/Man.png')} />
        </RoundButton>
        <View style={styles.visibleTextWrapper}>
          <Text style={styles.passangerInfoWithAvatarText}>
            {order.passenger.name} {order.passenger.lastName}
          </Text>
          <View style={styles.addressMiniWrapper}>
            {withStopPoint ? <PickUpIcon /> : <DropOffIcon />}
            <Text numberOfLines={1} style={[styles.addressMini, computedStyles.addressMini]}>
              {order.startPosition}
            </Text>
          </View>
          {withStopPoint && (
            <View style={[styles.addressMiniWrapper, styles.withoutMarginTop]}>
              <DropOffIcon />
              <Text numberOfLines={1} style={[styles.addressMini, computedStyles.addressMini]}>
                {order.startPosition}
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
    flexShrink: 1,
  },
  addressMini: {
    fontFamily: 'Inter Medium',
    fontSize: 12,
    flexShrink: 1,
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
  visibleTextWrapper: {
    flexShrink: 1,
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
    flexShrink: 1,
  },
  passangerInfoWithAvatarText: {
    fontFamily: 'Inter Medium',
  },
  secondPoint: {
    marginTop: 6,
  },
});
