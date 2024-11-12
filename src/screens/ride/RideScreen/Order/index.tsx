import { useEffect, useRef } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Shadow } from 'react-native-shadow-2';
import { useSelector } from 'react-redux';
import {
  BottomWindowWithGesture,
  BottomWindowWithGestureRef,
  defaultShadow,
  sizes,
  Timer,
  TimerColorModes,
  TimerSizesModes,
  useTheme,
} from 'shuttlex-integration';

import { twoHighestPriorityAlertsSelector } from '../../../../core/ride/redux/alerts/selectors';
import { orderSelector, tripStatusSelector } from '../../../../core/ride/redux/trip/selectors';
import { TripStatus } from '../../../../core/ride/redux/trip/types';
import AlertInitializer from '../../../../shared/AlertInitializer';
import PassengerRating from '../popups/PassengerRatingPopup';
import HiddenPart from './HiddenPart';
import VisiblePart from './VisiblePart';

const animationDuration = 200;

const Order = () => {
  const { colors } = useTheme();

  const bottomWindowRef = useRef<BottomWindowWithGestureRef>(null);

  const tripStatus = useSelector(tripStatusSelector);
  const alerts = useSelector(twoHighestPriorityAlertsSelector);
  const order = useSelector(orderSelector);

  const withAvatar = tripStatus === TripStatus.Arrived || tripStatus === TripStatus.Ending;
  const withHeaderTimer = tripStatus === TripStatus.Ride;

  useEffect(() => {
    bottomWindowRef.current?.closeWindow();
  }, [tripStatus]);

  const computedStyles = StyleSheet.create({
    headerWrapperStyle: {
      height: withAvatar ? 50 : withHeaderTimer ? 70 : 'auto',
      justifyContent: 'flex-end',
    },
    avatarAndShadowContainer: {
      backgroundColor: colors.backgroundPrimaryColor,
    },
  });

  if (!order) {
    return;
  }

  const headerElement = () => {
    if (withAvatar) {
      return (
        <View style={[styles.avatarAndShadowContainer, computedStyles.avatarAndShadowContainer]}>
          <Shadow {...defaultShadow(colors.weakShadowColor)} style={styles.shadowStyle}>
            <View style={styles.avatarInnerContainer}>
              {order.passenger.avatarURL === '' ? (
                <Image source={require('../../../../assets/img/DefaultAvatar.png')} style={styles.passengerAvatar} />
              ) : (
                <Image source={{ uri: order.passenger.avatarURL }} style={styles.passengerAvatar} />
              )}
            </View>
          </Shadow>
        </View>
      );
    }
    if (withHeaderTimer) {
      return (
        <View style={styles.timerWrapper}>
          <Shadow {...defaultShadow(colors.strongShadowColor)} style={styles.shadowStyle}>
            <Timer time={order.fullTimeTimestamp} sizeMode={TimerSizesModes.S} colorMode={TimerColorModes.Mode3} />
          </Shadow>
        </View>
      );
    }
    return <></>;
  };

  return (
    <>
      <BottomWindowWithGesture
        withAllPartsScroll
        withHiddenPartScroll={false}
        visiblePartStyle={styles.bottomWindowVisiblePartStyle}
        hiddenPartContainerStyle={styles.bottomWindowHiddenContainer}
        headerWrapperStyle={computedStyles.headerWrapperStyle}
        ref={bottomWindowRef}
        alerts={alerts.map(alertData => (
          <AlertInitializer
            key={alertData.id}
            id={alertData.id}
            priority={alertData.priority}
            type={alertData.type}
            options={'options' in alertData ? alertData.options : undefined}
          />
        ))}
        headerElement={<Animated.View layout={FadeIn.duration(animationDuration)}>{headerElement()}</Animated.View>}
        visiblePart={<VisiblePart />}
        hiddenPart={<HiddenPart />}
      />
      {tripStatus === TripStatus.Rating && order && <PassengerRating />}
    </>
  );
};

const styles = StyleSheet.create({
  bottomWindowHiddenContainer: {
    gap: 8,
  },
  bottomWindowVisiblePartStyle: {
    paddingBottom: sizes.paddingVertical,
  },
  avatarAndShadowContainer: {
    position: 'absolute',
    top: -75,
    alignSelf: 'center',
    borderRadius: 50,
  },
  shadowStyle: {
    borderRadius: 30,
  },
  avatarInnerContainer: {
    padding: 4,
  },
  passengerAvatar: {
    width: 62,
    height: 62,
  },
  timerWrapper: {
    position: 'absolute',
    top: -105,
    alignSelf: 'center',
  },
});

export default Order;
