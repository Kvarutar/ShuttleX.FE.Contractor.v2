import { ReactNode, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { LatLng } from 'react-native-maps';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSelector } from 'react-redux';
import {
  Button,
  getDistanceBetweenPoints,
  Nullable,
  secToMilSec,
  SquareButtonModes,
  SwipeButton,
  SwipeButtonModes,
} from 'shuttlex-integration';

import { useAppDispatch } from '../../../../../core/redux/hooks';
import { geolocationCoordinatesSelector } from '../../../../../core/ride/redux/geolocation/selectors';
import { setTripStatus } from '../../../../../core/ride/redux/trip';
import {
  orderSelector,
  tripDropOffRouteSelector,
  tripPickUpRouteSelector,
  tripPointsSelector,
  tripStatusSelector,
} from '../../../../../core/ride/redux/trip/selectors';
import {
  fetchArrivedToDropOff,
  fetchArrivedToPickUp,
  fetchArrivedToStopPoint,
  fetchPickedUpAtPickUpPoint,
  fetchPickedUpAtStopPoint,
} from '../../../../../core/ride/redux/trip/thunks';
import { OfferWayPointsDataAPIResponse, TripStatus } from '../../../../../core/ride/redux/trip/types';
import AddressWithExtendedPassengerInfo from './AddressWith/AddressWithExtendedPassengerInfo';
import AddressWithMeta from './AddressWith/AddressWithMeta';
import AddressWithPassengerAndOrderInfo from './AddressWith/AddressWithPassengerAndOrderInfo';
import { GoogleMapButtonPoints } from './AddressWith/props';

const animationDuration = 200;
const validDistanceToNearPoint = 100; // meters
const validDistanceCheckInterval = 5000; // 5s

const checkIsNearPoint = (p1: LatLng, route: OfferWayPointsDataAPIResponse): boolean => {
  return getDistanceBetweenPoints(p1, route.waypoints[route.waypoints.length - 1].geo) <= validDistanceToNearPoint;
};

const VisiblePart = ({ timeToDropOff }: { timeToDropOff: number }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const order = useSelector(orderSelector);
  const tripStatus = useSelector(tripStatusSelector);
  const tripPoints = useSelector(tripPointsSelector);
  const pickUpRoute = useSelector(tripPickUpRouteSelector);
  const dropOffRoute = useSelector(tripDropOffRouteSelector);

  const geolocationCoordinates = useSelector(geolocationCoordinatesSelector);
  const geolocationCoordinatesRef = useRef<LatLng | null>(null);

  useEffect(() => {
    geolocationCoordinatesRef.current = geolocationCoordinates;
  }, [geolocationCoordinates]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (
        (tripStatus === TripStatus.Ride || tripStatus === TripStatus.Idle) &&
        geolocationCoordinatesRef.current &&
        order &&
        tripPoints.length !== 0
      ) {
        //TODO: Refactor trip status change logic, add a new field "currentPoint" (pickUp, stopPoint[numberOfStopPoint]), etc..
        const isPickUp = tripPoints.length === order.stopPoints.length + 1;
        const isLastPoint = tripPoints.length <= 1;

        if (isPickUp && pickUpRoute && checkIsNearPoint(geolocationCoordinatesRef.current, pickUpRoute)) {
          dispatch(setTripStatus(TripStatus.NearPoint));
        } else if (isLastPoint && dropOffRoute && checkIsNearPoint(geolocationCoordinatesRef.current, dropOffRoute)) {
          dispatch(setTripStatus(TripStatus.Ending));
        }
      }
    }, validDistanceCheckInterval);

    return () => clearInterval(interval);
  }, [dispatch, tripStatus, order, tripPoints.length, pickUpRoute, dropOffRoute]);

  let mainContent: Nullable<Record<TripStatus, Nullable<ReactNode>>> = null;
  let statusSwitchers: Nullable<Record<TripStatus, Nullable<ReactNode>>> = null;

  let googleMapPickUpRoutePoints: GoogleMapButtonPoints | undefined;
  if (pickUpRoute && pickUpRoute.waypoints.length > 1) {
    googleMapPickUpRoutePoints = {
      startPoint: pickUpRoute.waypoints[0].geo,
      endPoint: pickUpRoute.waypoints[pickUpRoute.waypoints.length - 1].geo,
    };
  }
  let googleMapDropOffRoutePoints: GoogleMapButtonPoints | undefined;
  if (dropOffRoute && dropOffRoute.waypoints.length > 1) {
    googleMapDropOffRoutePoints = {
      startPoint: dropOffRoute.waypoints[0].geo,
      endPoint: dropOffRoute.waypoints[dropOffRoute.waypoints.length - 1].geo,
    };
  }

  if (order && tripPoints.length !== 0) {
    mainContent = {
      idle: (
        <AddressWithPassengerAndOrderInfo
          tripPointsAddresses={tripPoints}
          googleMapButtonPoints={googleMapPickUpRoutePoints}
          timeForTimer={order.timeToPickUp}
        />
      ),
      nearPoint: (
        <AddressWithPassengerAndOrderInfo tripPointsAddresses={tripPoints} timeForTimer={order.timeToPickUp} />
      ),
      //TODO: Add this component when work with stop points
      //TODO: Change timeForTimer when work with stop points
      nearStopPoint: <AddressWithPassengerAndOrderInfo tripPointsAddresses={tripPoints} timeForTimer={0} />,
      arrived: (
        <AddressWithPassengerAndOrderInfo
          tripPointsAddresses={tripPoints}
          //TODO: Remove "secToMilSec(1)" when fix a timer
          timeForTimer={Date.now() + order.waitingTimeInMilSec - secToMilSec(1)} // For correct time rendering in timer
          isWaiting
        />
      ),
      //TODO: Add this component when work with stop points
      // Note: Not styled for new design
      arrivedAtStopPoint: <AddressWithExtendedPassengerInfo withStopPoint tripPoints={tripPoints} />,
      ride: (
        <AddressWithMeta
          tripPointsAddresses={tripPoints}
          startTime={order.pickUpTime}
          endTime={order.timeToDropOff}
          googleMapButtonPoints={googleMapDropOffRoutePoints}
        />
      ),
      ending: <AddressWithPassengerAndOrderInfo tripPointsAddresses={tripPoints} timeForTimer={timeToDropOff} />,
      rating: null,
    };
    statusSwitchers = {
      idle: null,
      nearPoint: (
        <Button
          mode={SquareButtonModes.Mode2}
          text={t('ride_Ride_Order_arrivedButton')}
          onPress={() => dispatch(fetchArrivedToPickUp({ orderId: order.id }))}
        />
      ),
      nearStopPoint: (
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
