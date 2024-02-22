import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSelector } from 'react-redux';
import { Button, ButtonModes, SwipeButton, SwipeButtonModes } from 'shuttlex-integration';

import { useAppDispatch } from '../../../../../core/redux/hooks';
import { endTrip, setTripStatus, toNextTripPoint } from '../../../../../core/ride/redux/trip';
import { orderSelector, tripPointsSelector, tripStatusSelector } from '../../../../../core/ride/redux/trip/selectors';
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

  useEffect(() => {
    if (order && (TripStatus.Ride || TripStatus.Idle)) {
      setTimeout(() => {
        if (tripPoints && order.targetPointsPosition.length > 1 && tripPoints.length > 1) {
          dispatch(setTripStatus(TripStatus.ArrivingAtStopPoint)); //for test
        } else if (tripPoints && (tripPoints.length <= 1 || order.targetPointsPosition.length === 1)) {
          dispatch(setTripStatus(TripStatus.Arriving)); //for test
        }
      }, 5000);
    }
  }, [dispatch, tripPoints, order]);

  const onNextTripStage = (status: TripStatus) => {
    dispatch(toNextTripPoint());
    dispatch(setTripStatus(status));
  };

  const onArrived = () => {
    if (tripPoints) {
      if (tripPoints.length > 1) {
        dispatch(setTripStatus(TripStatus.Arrived));
      } else {
        dispatch(setTripStatus(TripStatus.Ending));
      }
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
        <Button mode={ButtonModes.Mode1} text={t('ride_Ride_Order_arrivedButton')} onPress={onArrived} />
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
          onSwipeEnd={() => onNextTripStage(TripStatus.Ride)}
          text={t('ride_Ride_Order_pickUpButton')}
        />
      </StatusSwitcher>
    ),
    arrivedAtStopPoint: (
      <StatusSwitcher>
        <SwipeButton
          mode={SwipeButtonModes.Confirm}
          onSwipeEnd={() => onNextTripStage(TripStatus.Ride)}
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
