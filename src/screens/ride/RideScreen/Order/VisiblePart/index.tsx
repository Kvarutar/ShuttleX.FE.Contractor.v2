import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
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
    // TODO: Add "tripStatus === TripStatus.Ride ||" when work with stop points for ride imitation
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
      idle: (
        <AddressWithPassengerAndOrderInfo
          tripPoints={tripPoints}
          timeForTimer={order.timeToOffer}
          contentType={TripStatus.Idle}
        />
      ),
      arriving: (
        <AddressWithPassengerAndOrderInfo
          tripPoints={tripPoints}
          timeForTimer={order.timeToOffer}
          contentType={TripStatus.Arriving}
        />
      ),
      arrivingAtStopPoint: (
        <AddressWithPassengerAndOrderInfo
          tripPoints={tripPoints}
          timeForTimer={waitingTime}
          contentType={TripStatus.ArrivingAtStopPoint}
        />
      ),
      arrived: (
        <AddressWithPassengerAndOrderInfo
          tripPoints={tripPoints}
          withAvatar
          withGoogleMapButton={false}
          timeForTimer={waitingTime}
          isWaiting
          setWaitingTime={setWaitingTime}
          contentType={TripStatus.Arrived}
        />
      ),
      //TODO: Add this component when work with stop points
      // Note: Not styled for new design
      arrivedAtStopPoint: <AddressWithExtendedPassengerInfo withStopPoint tripPoints={tripPoints} />,
      ride: <AddressWithMeta tripPoints={tripPoints} timeForTimer={order.fullTimeTimestamp} />,
      ending: (
        <AddressWithPassengerAndOrderInfo
          tripPoints={tripPoints}
          withAvatar
          withGoogleMapButton={false}
          timeForTimer={order.fullTimeTimestamp}
          contentType={TripStatus.Ending}
        />
      ),
    };
  }

  const statusSwitchers = {
    idle: null,
    arriving: (
      <StatusSwitcher>
        <Button mode={SquareButtonModes.Mode2} text={t('ride_Ride_Order_arrivedButton')} onPress={onArrived} />
      </StatusSwitcher>
    ),
    arrivingAtStopPoint: (
      <StatusSwitcher>
        <Button
          mode={SquareButtonModes.Mode1}
          text={t('ride_Ride_Order_arrivedToStopButton')}
          onPress={onArrivedAtStopPoint}
        />
      </StatusSwitcher>
    ),
    arrived: (
      <StatusSwitcher>
        <SwipeButton
          mode={SwipeButtonModes.Confirm}
          onSwipeEnd={() => dispatch(fetchPickedUpAtPickUpPoint())}
          text={t('ride_Ride_Order_pickUpButton')}
        />
      </StatusSwitcher>
    ),
    arrivedAtStopPoint: (
      <StatusSwitcher>
        <SwipeButton
          mode={SwipeButtonModes.Confirm}
          onSwipeEnd={() => dispatch(fetchPickedUpAtStopPoint())}
          text={t('ride_Ride_Order_pickUpButton')}
        />
      </StatusSwitcher>
    ),
    ride: null,
    ending: (
      <StatusSwitcher>
        <SwipeButton
          mode={SwipeButtonModes.Finish}
          onSwipeEnd={() => dispatch(fetchArrivedToDropOff())}
          text={t('ride_Ride_Order_finishRideButton')}
        />
      </StatusSwitcher>
    ),
  };

  if (mainContent) {
    return (
      <>
        {mainContent[tripStatus]}
        {statusSwitchers[tripStatus]}
      </>
    );
  }

  return <></>;
};

const StatusSwitcher = ({ children }: { children: React.ReactNode }) => (
  <Animated.View style={styles.statusSwitcher}>{children}</Animated.View>
);

const styles = StyleSheet.create({
  statusSwitcher: {
    marginTop: 26,
  },
});

export default VisiblePart;
