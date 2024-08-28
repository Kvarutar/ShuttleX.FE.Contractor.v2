import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSelector } from 'react-redux';
import { ButtonV1, ButtonV1Modes, SwipeButton, SwipeButtonModes } from 'shuttlex-integration';

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
import AddressWithPassengerInfo from './AddressWith/AddressWithPassengerInfo';

const VisiblePart = ({ isOpened }: { isOpened: boolean }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const order = useSelector(orderSelector);
  const tripStatus = useSelector(tripStatusSelector);
  const tripPoints = useSelector(tripPointsSelector);

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
      idle: <AddressWithMeta tripPoints={tripPoints} />,
      arriving: <AddressWithPassengerInfo tripPoints={tripPoints} order={order} isOpened={isOpened} />,
      arrivingAtStopPoint: (
        <AddressWithPassengerInfo withStopPoint tripPoints={tripPoints} order={order} isOpened={isOpened} />
      ),
      arrived: <AddressWithExtendedPassengerInfo tripPoints={tripPoints} order={order} isOpened={isOpened} />,
      arrivedAtStopPoint: (
        <AddressWithExtendedPassengerInfo withStopPoint tripPoints={tripPoints} order={order} isOpened={isOpened} />
      ),
      ride: <AddressWithMeta tripPoints={tripPoints} />,
      ending: <AddressWithExtendedPassengerInfo tripPoints={tripPoints} order={order} isOpened={isOpened} />,
    };
  }

  const statusSwitchers = {
    idle: null,
    arriving: (
      <StatusSwitcher>
        <ButtonV1 mode={ButtonV1Modes.Mode1} text={t('ride_Ride_Order_arrivedButton')} onPress={onArrived} />
      </StatusSwitcher>
    ),
    arrivingAtStopPoint: (
      <StatusSwitcher>
        <ButtonV1
          mode={ButtonV1Modes.Mode1}
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
          mode={SwipeButtonModes.Confirm}
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
