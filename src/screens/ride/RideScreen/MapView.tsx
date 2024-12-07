import { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';
import { LatLng } from 'react-native-maps';
import { useSelector } from 'react-redux';
import {
  calculateNewMapRoute,
  decodeGooglePolyline,
  getTimeWithAbbreviation,
  MapView as MapViewIntegration,
  Nullable,
  secToMilSec,
} from 'shuttlex-integration';

import { useAppDispatch } from '../../../core/redux/hooks';
import {
  geolocationCalculatedHeadingSelector,
  geolocationCoordinatesSelector,
} from '../../../core/ride/redux/geolocation/selectors';
import { setMapCameraMode } from '../../../core/ride/redux/map';
import { mapCameraModeSelector, mapStopPointsSelector } from '../../../core/ride/redux/map/selectors';
import {
  tripDropOffRouteSelector,
  tripPickUpRouteSelector,
  tripStatusSelector,
} from '../../../core/ride/redux/trip/selectors';
import { TripStatus } from '../../../core/ride/redux/trip/types';

const finalStopPointUpdateIntervalInSec = 30;

const MapView = (): JSX.Element => {
  const dispatch = useAppDispatch();

  const geolocationCoordinates = useSelector(geolocationCoordinatesSelector);
  const geolocationCalculatedHeading = useSelector(geolocationCalculatedHeadingSelector);
  const stopPoints = useSelector(mapStopPointsSelector);
  const cameraMode = useSelector(mapCameraModeSelector);
  const tripStatus = useSelector(tripStatusSelector);
  const pickUpRoute = useSelector(tripPickUpRouteSelector);
  const dropOffRoute = useSelector(tripDropOffRouteSelector);

  const [polylineCoordinates, setPolylineCoordinates] = useState<LatLng[]>([]);
  const [finalStopPointCoordinates, setFinalStopPointCoordinates] = useState<Nullable<LatLng>>(null);
  const [finalStopPointTimeInSec, setFinalStopPointTimeInSec] = useState<number>(0);

  const resetPoints = useCallback(() => {
    setPolylineCoordinates([]);
    setFinalStopPointCoordinates(null);
  }, []);

  useEffect(() => {
    switch (tripStatus) {
      case TripStatus.Idle:
        if (pickUpRoute) {
          const coordinates = decodeGooglePolyline(pickUpRoute.geometry);
          setPolylineCoordinates(coordinates);
          setFinalStopPointCoordinates(coordinates[coordinates.length - 1]);
          setFinalStopPointTimeInSec(pickUpRoute.totalDurationSec);
        } else {
          resetPoints();
        }
        break;
      case TripStatus.Ride:
        if (dropOffRoute) {
          const coordinates = decodeGooglePolyline(dropOffRoute.geometry);
          setPolylineCoordinates(coordinates);
          setFinalStopPointCoordinates(coordinates[coordinates.length - 1]);
          setFinalStopPointTimeInSec(dropOffRoute.totalDurationSec);
        } else {
          resetPoints();
        }
        break;
      default:
    }
  }, [tripStatus, dropOffRoute, pickUpRoute, resetPoints]);

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
      setPolylineCoordinates(prev => calculateNewMapRoute(prev, geolocationCoordinates, 15));
    }
  }, [geolocationCoordinates]);

  return (
    <MapViewIntegration
      style={StyleSheet.absoluteFill}
      geolocationCoordinates={geolocationCoordinates ?? undefined}
      geolocationCalculatedHeading={geolocationCalculatedHeading}
      polylines={
        polylineCoordinates.length !== 0
          ? [{ type: 'straight', options: { coordinates: polylineCoordinates } }]
          : undefined
      }
      finalStopPoint={
        finalStopPointCoordinates
          ? {
              colorMode: 'mode2',
              coordinates: finalStopPointCoordinates,
              title: finalStopPointTimeWithAbbreviation.value,
              subtitle: finalStopPointTimeWithAbbreviation.label,
            }
          : undefined
      }
      stopPoints={stopPoints}
      cameraMode={cameraMode}
      setCameraModeOnDrag={mode => dispatch(setMapCameraMode(mode))}
    />
  );
};

export default MapView;
