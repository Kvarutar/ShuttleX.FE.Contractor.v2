import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { LatLng } from 'react-native-maps';
import { useSelector } from 'react-redux';
import {
  calculateNewMapRoute,
  decodeGooglePolylineArr,
  getTimeWithAbbreviation,
  MapMarker,
  MapPolyline,
  MapView as MapViewIntegration,
  Nullable,
  secToMilSec,
} from 'shuttlex-integration';

import { activeBottomWindowYCoordinateSelector } from '../../../core/contractor/redux/selectors';
import { useAppDispatch } from '../../../core/redux/hooks';
import { updateContractorGeo } from '../../../core/redux/signalr';
import {
  geolocationCalculatedHeadingSelector,
  geolocationCoordinatesSelector,
} from '../../../core/ride/redux/geolocation/selectors';
import { setMapCameraMode, setMapRidePercentFromPolylines, setMapRouteTraffic } from '../../../core/ride/redux/map';
import { mapCameraModeSelector, mapStopPointsSelector } from '../../../core/ride/redux/map/selectors';
import {
  orderSelector,
  tripDropOffRouteSelector,
  tripFutureOrderPickUpRouteSelector,
  tripPickUpRouteSelector,
  tripStatusSelector,
} from '../../../core/ride/redux/trip/selectors';
import { OfferWayPointsDataAPIResponse, TripStatus } from '../../../core/ride/redux/trip/types';

const finalStopPointUpdateIntervalInSec = 30;
const updateContractorGeoInterval = 1000;
const polylineClearPointDistanceMtr = 25;

const screenHeight = Dimensions.get('screen').height;

const MapView = ({ onFirstCameraAnimationComplete }: { onFirstCameraAnimationComplete: () => void }): JSX.Element => {
  const dispatch = useAppDispatch();

  const geolocationCoordinates = useSelector(geolocationCoordinatesSelector);
  const geolocationCalculatedHeading = useSelector(geolocationCalculatedHeadingSelector);
  const stopPoints = useSelector(mapStopPointsSelector);
  const cameraMode = useSelector(mapCameraModeSelector);
  const tripStatus = useSelector(tripStatusSelector);
  const pickUpRoute = useSelector(tripPickUpRouteSelector);
  const dropOffRoute = useSelector(tripDropOffRouteSelector);
  const futureOrderPickUpRoute = useSelector(tripFutureOrderPickUpRouteSelector);
  const order = useSelector(orderSelector);
  const activeBottomWindowYCoordinate = useSelector(activeBottomWindowYCoordinateSelector);

  const [polylines, setPolylines] = useState<MapPolyline[]>([]);
  const [routePolylinePointsCount, setRoutePolylinePointsCount] = useState<number>(0);
  const [currentOrderPolylinesCoordinates, setCurrentOrderPolylinesCoordinates] = useState<LatLng[]>([]);
  const [futureOrderMarker, setFutureOrderMarker] = useState<LatLng | null>(null);
  const [finalStopPointCoordinates, setFinalStopPointCoordinates] = useState<Nullable<LatLng>>(null);
  const [finalStopPointTimeInSec, setFinalStopPointTimeInSec] = useState<number>(0);

  const geolocationCoordinatesRef = useRef<Nullable<LatLng>>(null);
  const updateContractorGeoRef = useRef<NodeJS.Timeout | null>(null);

  // Section: getting geo of passenger and send geo of contractor
  useEffect(() => {
    geolocationCoordinatesRef.current = geolocationCoordinates;
  }, [geolocationCoordinates]);

  const setContractorGeoInterval = (callback: () => void) => {
    if (updateContractorGeoRef.current !== null) {
      clearInterval(updateContractorGeoRef.current);
    }
    updateContractorGeoRef.current = setInterval(callback, updateContractorGeoInterval);
  };

  // Clear interval on dismount
  useEffect(
    () => () => {
      if (updateContractorGeoRef.current) {
        clearInterval(updateContractorGeoRef.current);
      }
    },
    [],
  );

  useEffect(() => {
    setContractorGeoInterval(() => {
      if (geolocationCoordinatesRef.current === null) {
        return;
      }
      dispatch(
        updateContractorGeo({
          state: order ? 'InOrder' : 'Other',
          position: geolocationCoordinatesRef.current,
          orderId: order?.id ?? null,
        }),
      );
    });
  }, [dispatch, order]);

  // Section: polylines
  const setPolylineAndFinalPoint = useCallback((route: Nullable<OfferWayPointsDataAPIResponse>) => {
    if (route) {
      const coordinates = decodeGooglePolylineArr(route.legs.map(leg => leg.geometry));
      setRoutePolylinePointsCount(coordinates.length);
      setCurrentOrderPolylinesCoordinates(coordinates);
      setFinalStopPointCoordinates(route.waypoints[route.waypoints.length - 1].geo);
      setFinalStopPointTimeInSec(route.totalDurationSec);
    } else {
      setCurrentOrderPolylinesCoordinates([]);
      setFinalStopPointCoordinates(null);
      setFutureOrderMarker(null);
    }
  }, []);

  useEffect(() => {
    switch (tripStatus) {
      case TripStatus.Idle:
        setPolylineAndFinalPoint(pickUpRoute);
        break;
      case TripStatus.Ride:
        setPolylineAndFinalPoint(dropOffRoute);
        if (dropOffRoute) {
          const joinedAccurateGeometries: OfferWayPointsDataAPIResponse['legs'][0]['accurateGeometries'] = [];
          dropOffRoute.legs.forEach(leg => joinedAccurateGeometries.push(...leg.accurateGeometries));
          dispatch(setMapRouteTraffic(joinedAccurateGeometries));
        }
        break;
      default:
    }
  }, [dispatch, tripStatus, dropOffRoute, pickUpRoute, setPolylineAndFinalPoint]);

  useEffect(() => {
    const interval = setInterval(() => {
      setFinalStopPointTimeInSec(prev => {
        if (prev < finalStopPointUpdateIntervalInSec) {
          clearInterval(interval);
          return 0;
        }
        return prev - finalStopPointUpdateIntervalInSec;
      });
    }, secToMilSec(finalStopPointUpdateIntervalInSec));

    return () => {
      clearInterval(interval);
    };
  }, [finalStopPointCoordinates]);

  const finalStopPointTimeWithAbbreviation = useMemo(
    () => getTimeWithAbbreviation(finalStopPointTimeInSec),
    [finalStopPointTimeInSec],
  );

  useEffect(() => {
    if (geolocationCoordinates) {
      setCurrentOrderPolylinesCoordinates(prev =>
        calculateNewMapRoute(prev, geolocationCoordinates, polylineClearPointDistanceMtr),
      );
    }
  }, [geolocationCoordinates]);

  useEffect(() => {
    const newPolylines: MapPolyline[] = [];
    if (currentOrderPolylinesCoordinates.length !== 0) {
      newPolylines.push({ type: 'straight', options: { coordinates: currentOrderPolylinesCoordinates } });
    }
    if (futureOrderPickUpRoute) {
      const coordinates = decodeGooglePolylineArr(futureOrderPickUpRoute.legs.map(leg => leg.geometry));
      newPolylines.push({
        type: 'straight',
        options: { coordinates: coordinates, color: '#00000066' },
      });
      setFutureOrderMarker(futureOrderPickUpRoute.waypoints[futureOrderPickUpRoute.waypoints.length - 1].geo);
    } else {
      setFutureOrderMarker(null);
    }
    setPolylines(newPolylines);
    dispatch(
      setMapRidePercentFromPolylines(
        `${Math.floor((1 - currentOrderPolylinesCoordinates.length / routePolylinePointsCount) * 100)}%`,
      ),
    );
  }, [dispatch, currentOrderPolylinesCoordinates, futureOrderPickUpRoute, routePolylinePointsCount]);

  const markers: MapMarker[] = [];
  if (futureOrderMarker) {
    markers.push({
      type: 'simple',
      colorMode: 'mode1',
      coordinates: futureOrderMarker,
    });
  }
  if (finalStopPointCoordinates) {
    markers.push({
      type: 'withLabel',
      colorMode: 'mode2',
      coordinates: finalStopPointCoordinates,
      title: finalStopPointTimeWithAbbreviation.value,
      subtitle: finalStopPointTimeWithAbbreviation.label,
    });
  }

  return (
    <MapViewIntegration
      style={StyleSheet.absoluteFill}
      mapPadding={{ bottom: activeBottomWindowYCoordinate ? screenHeight - activeBottomWindowYCoordinate : 0 }}
      geolocationCoordinates={geolocationCoordinates ?? undefined}
      geolocationCalculatedHeading={geolocationCalculatedHeading}
      onFirstCameraAnimationComplete={onFirstCameraAnimationComplete}
      polylines={polylines}
      markers={markers}
      stopPoints={stopPoints}
      cameraMode={cameraMode}
      setCameraModeOnDrag={mode => dispatch(setMapCameraMode(mode))}
    />
  );
};

export default MapView;
