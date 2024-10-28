import { useCallback, useEffect, useState } from 'react';
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

const VisiblePart = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const order = useSelector(orderSelector);
  const tripStatus = useSelector(tripStatusSelector);
  const tripPoints = useSelector(tripPointsSelector);

  const [waitingTime, setWaitingTime] = useState(Date.now() + minToMilSec(1)); // random date in a future for correct working

  const updateTripStatus = useCallback(() => {
    if (order && tripPoints) {
      const isPickUp = tripPoints.length === order.targetPointsPosition.length + 1;
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

  const onArrived = () => {
    if (tripPoints) {
      dispatch(fetchArrivedToPickUp());
    }
  };

  const onArrivedAtStopPoint = () => {
    if (tripPoints) {
      dispatch(fetchArrivedToStopPoint());
    }
  };

  let mainContent = null;

  if (order && tripPoints) {
    mainContent = {
      idle: <AddressWithPassengerAndOrderInfo tripPoints={tripPoints} timeForTimer={order.timeToOffer} />,
      arriving: <AddressWithPassengerAndOrderInfo tripPoints={tripPoints} timeForTimer={order.timeToOffer} />,
      arrivingAtStopPoint: <AddressWithPassengerAndOrderInfo tripPoints={tripPoints} timeForTimer={waitingTime} />,
      arrived: (
        <AddressWithPassengerAndOrderInfo
          tripPoints={tripPoints}
          withGoogleMapButton={false}
          timeForTimer={waitingTime}
          isWaiting
          setWaitingTime={setWaitingTime}
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
          timeForTimer={order.fullTimeTimestamp}
        />
      ),
      rating: null,
    };
  }

  const statusSwitchers = {
    idle: null,
    arriving: <Button mode={SquareButtonModes.Mode2} text={t('ride_Ride_Order_arrivedButton')} onPress={onArrived} />,
    arrivingAtStopPoint: (
      <Button
        mode={SquareButtonModes.Mode1}
        text={t('ride_Ride_Order_arrivedToStopButton')}
        onPress={onArrivedAtStopPoint}
      />
    ),
    arrived: (
      <SwipeButton
        mode={SwipeButtonModes.Confirm}
        onSwipeEnd={() => dispatch(fetchPickedUpAtPickUpPoint())}
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
        onSwipeEnd={() => dispatch(fetchArrivedToDropOff())}
        text={t('ride_Ride_Order_finishRideButton')}
      />
    ),
    rating: null,
  };

  if (!mainContent) {
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
