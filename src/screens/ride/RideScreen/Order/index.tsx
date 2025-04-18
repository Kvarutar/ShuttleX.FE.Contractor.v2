import { useEffect, useRef, useState } from 'react';
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

import { setActiveBottomWindowYCoordinate } from '../../../../core/contractor/redux';
import { useAppDispatch } from '../../../../core/redux/hooks';
import { twoHighestPriorityAlertsSelector } from '../../../../core/ride/redux/alerts/selectors';
import { orderSelector, tripStatusSelector } from '../../../../core/ride/redux/trip/selectors';
import { TripStatus } from '../../../../core/ride/redux/trip/types';
import AlertInitializer from '../../../../shared/AlertInitializer';
import MapCameraModeButton from '../MapCameraModeButton';
import PassengerRating from '../popups/PassengerRatingPopup';
import HiddenPart from './HiddenPart';
import VisiblePart from './VisiblePart';

const animationDuration = 200;

const Order = () => {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();

  const bottomWindowRef = useRef<BottomWindowWithGestureRef>(null);

  const tripStatus = useSelector(tripStatusSelector);
  const alerts = useSelector(twoHighestPriorityAlertsSelector);
  const order = useSelector(orderSelector);

  const [timeToDropOff, setTimeToDropOff] = useState(0);

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
    passengerAvatarContainer: {
      borderColor: colors.backgroundPrimaryColor,
    },
  });

  useEffect(() => {
    if (withHeaderTimer && order) {
      if (order.timeToDropOffFromNow > 0) {
        setTimeToDropOff(Date.now() + order.timeToDropOffFromNow);
      } else {
        setTimeToDropOff(Date.now());
      }
    }
  }, [withHeaderTimer, order]);

  if (!order) {
    return;
  }

  const headerElement = () => {
    if (withAvatar) {
      return (
        <View style={[styles.avatarAndShadowContainer, computedStyles.avatarAndShadowContainer]}>
          <Shadow {...defaultShadow(colors.weakShadowColor)}>
            <View style={[styles.passengerAvatarContainer, computedStyles.passengerAvatarContainer]}>
              {order.passenger.avatarURL === null ? (
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
            <Timer time={timeToDropOff} sizeMode={TimerSizesModes.S} colorMode={TimerColorModes.Mode3} />
          </Shadow>
        </View>
      );
    }
    return <></>;
  };

  return (
    <>
      <BottomWindowWithGesture
        onAnimationEnd={values => dispatch(setActiveBottomWindowYCoordinate(values.pageY))}
        onGestureStart={event => {
          if (event.velocityY > 0) {
            dispatch(setActiveBottomWindowYCoordinate(null));
          }
        }}
        onHiddenOrVisibleHeightChange={values => {
          if (!values.isWindowAnimating) {
            dispatch(setActiveBottomWindowYCoordinate(values.pageY));
          }
        }}
        withAllPartsScroll
        withHiddenPartScroll={false}
        visiblePartWrapperStyle={styles.bottomWindowVisiblePartStyle}
        hiddenPartContainerStyle={styles.bottomWindowHiddenContainer}
        headerWrapperStyle={computedStyles.headerWrapperStyle}
        ref={bottomWindowRef}
        additionalTopContent={<MapCameraModeButton />}
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
        visiblePart={<VisiblePart timeToDropOff={timeToDropOff} />}
        hiddenPart={<HiddenPart />}
      />
      {tripStatus === TripStatus.Rating && order && <PassengerRating />}
    </>
  );
};

const styles = StyleSheet.create({
  shadowStyle: {
    borderRadius: 1000,
  },
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
    borderRadius: 100,
  },
  passengerAvatarContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 72,
    height: 72,
    borderRadius: 100,
    borderWidth: 4,
    overflow: 'hidden',
  },
  passengerAvatar: {
    width: '100%',
    height: '100%',
  },
  timerWrapper: {
    position: 'absolute',
    top: -105,
    alignSelf: 'center',
  },
});

export default Order;
