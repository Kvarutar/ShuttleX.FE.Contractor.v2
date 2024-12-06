import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSelector } from 'react-redux';
import { Button, minToMilSec, SquareButtonModes, SwipeButton, SwipeButtonModes } from 'shuttlex-integration';

import { useAppDispatch } from '../../../../../core/redux/hooks';
import { setTripStatus } from '../../../../../core/ride/redux/trip';
import { orderSelector, tripPointsSelector, tripStatusSelector } from '../../../../../core/ride/redux/trip/selectors';
import {
  fetchArrivedToDropOff,
  fetchArrivedToPickUp,
  fetchArrivedToStopPoint,
  fetchPickedUpAtPickUpPoint,
  fetchPickedUpAtStopPoint,
} from '../../../../../core/ride/redux/trip/thunks';
import { TripStatus } from '../../../../../core/ride/redux/trip/types';
import AddressWithExtendedPassengerInfo from './AddressWith/AddressWithExtendedPassengerInfo';
import AddressWithMeta from './AddressWith/AddressWithMeta';
import AddressWithPassengerAndOrderInfo from './AddressWith/AddressWithPassengerAndOrderInfo';

const animationDuration = 200;

const VisiblePart = ({ timeToDropOff }: { timeToDropOff: number }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const order = useSelector(orderSelector);
  const tripStatus = useSelector(tripStatusSelector);
  const tripPoints = useSelector(tripPointsSelector);

  //TODO: Refactor trip status change logic, add a new field "currentPoint" (pickUp, stopPoint[numberOfStopPoint]), etc..
  const updateTripStatus = useCallback(() => {
    if (order && tripPoints.length !== 0) {
      const isPickUp = tripPoints.length === order.stopPointAddresses.length + 1;
      const isLastPoint = tripPoints.length <= 1;

      if (isPickUp) {
        dispatch(setTripStatus(TripStatus.Arriving));
      } else if (isLastPoint) {
        dispatch(setTripStatus(TripStatus.Ending));
      } else {
        dispatch(setTripStatus(TripStatus.ArrivingAtStopPoint));
      }
    }
  }, [order, tripPoints, dispatch]);

  useEffect(() => {
    // TODO: replace with check is contractor arriving
    if (tripStatus === TripStatus.Ride || tripStatus === TripStatus.Idle) {
      setTimeout(updateTripStatus, 5000);
    }
  }, [updateTripStatus, tripStatus]);

  let mainContent = null;
  let statusSwitchers = null;

  if (order && tripPoints.length !== 0) {
    mainContent = {
      idle: <AddressWithPassengerAndOrderInfo tripPoints={tripPoints} timeForTimer={order.timeToPickUp} />,
      arriving: <AddressWithPassengerAndOrderInfo tripPoints={tripPoints} timeForTimer={order.timeToPickUp} />,
      //TODO: Add this component when work with stop points
      //TODO: Change timeForTimer when work with stop points
      arrivingAtStopPoint: <AddressWithPassengerAndOrderInfo tripPoints={tripPoints} timeForTimer={0} />,
      arrived: (
        <AddressWithPassengerAndOrderInfo
          tripPoints={tripPoints}
          withGoogleMapButton={false}
          timeForTimer={Date.now() + minToMilSec(order.waitingTimeInMin)}
          isWaiting
        />
      ),
      //TODO: Add this component when work with stop points
      // Note: Not styled for new design
      arrivedAtStopPoint: <AddressWithExtendedPassengerInfo withStopPoint tripPoints={tripPoints} />,
      ride: <AddressWithMeta tripPoints={tripPoints} />,
      ending: (
        <AddressWithPassengerAndOrderInfo
          tripPoints={tripPoints}
          withGoogleMapButton={false}
          timeForTimer={timeToDropOff}
        />
      ),
      rating: null,
    };
    statusSwitchers = {
      idle: null,
      arriving: (
        <Button
          mode={SquareButtonModes.Mode2}
          text={t('ride_Ride_Order_arrivedButton')}
          onPress={() => dispatch(fetchArrivedToPickUp({ orderId: order.id }))}
        />
      ),
      arrivingAtStopPoint: (
        <Button
          mode={SquareButtonModes.Mode1}
          text={t('ride_Ride_Order_arrivedToStopButton')}
          onPress={() => dispatch(fetchArrivedToStopPoint())}
        />
      ),
      arrived: (
        <SwipeButton
          mode={SwipeButtonModes.Confirm}
          onSwipeEnd={() => dispatch(fetchPickedUpAtPickUpPoint({ orderId: order.id }))}
          text={t('ride_Ride_Order_pickUpButton')}
        />
      ),
      arrivedAtStopPoint: (
        <SwipeButton
          mode={SwipeButtonModes.Confirm}
          onSwipeEnd={() => dispatch(fetchPickedUpAtStopPoint())}
          text={t('ride_Ride_Order_pickUpButton')}
        />
      ),
      ride: null,
      ending: (
        <SwipeButton
          mode={SwipeButtonModes.Finish}
          onSwipeEnd={() => dispatch(fetchArrivedToDropOff({ orderId: order.id }))}
          text={t('ride_Ride_Order_finishRideButton')}
        />
      ),
      rating: null,
    };
  }

  if (!mainContent || !statusSwitchers) {
    return <></>;
  }

  return (
    <>
      <Animated.View layout={FadeIn.duration(animationDuration)}>{mainContent[tripStatus]}</Animated.View>
      <Animated.View layout={FadeIn.duration(animationDuration)}>{statusSwitchers[tripStatus]}</Animated.View>
    </>
  );
};

export default VisiblePart;
