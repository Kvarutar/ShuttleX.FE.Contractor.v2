import { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  useGeolocationStartWatch as useGeolocationStartWatchIntegration,
  useNetworkConnectionStartWatch as useNetworkConnectionStartWatchIntegration,
} from 'shuttlex-integration';
import { v4 as uuidv4 } from 'uuid';

import { useAppDispatch } from '../redux/hooks';
import { isSignalRConnectedSelector, updateContractorGeo } from '../redux/signalr';
import { addAlert, removeAlert } from './redux/alerts';
import { AlertPriority } from './redux/alerts/types';
import {
  setGeolocationAccuracy,
  setGeolocationCoordinates,
  setGeolocationError,
  setGeolocationIsLocationEnabled,
  setGeolocationIsPermissionGranted,
} from './redux/geolocation';
import { orderSelector } from './redux/trip/selectors';

export const useGeolocationStartWatch = () => {
  const dispatch = useAppDispatch();

  const order = useSelector(orderSelector);
  const isSignalRConnected = useSelector(isSignalRConnectedSelector);

  useGeolocationStartWatchIntegration({
    onLocationEnabledChange: isLocationEnabled => dispatch(setGeolocationIsLocationEnabled(isLocationEnabled)),
    onPermissionGrantedChange: isPermissionGranted => dispatch(setGeolocationIsPermissionGranted(isPermissionGranted)),
    onAccuracyChange: accuracy => dispatch(setGeolocationAccuracy(accuracy)),
    onCoordinatesChange: coordinates => {
      dispatch(
        setGeolocationCoordinates({
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
          heading: coordinates.heading ?? 0,
        }),
      );
      // TODO: move this logic in extraReducers of signalR slice
      if (isSignalRConnected) {
        dispatch(
          updateContractorGeo({
            // TODO: Check 'InOrder' state with common states logic, not with id
            state: order?.id ? 'InOrder' : 'Other',
            position: { latitude: coordinates.latitude, longitude: coordinates.longitude },
            orderId: order?.id ?? null,
          }),
        );
      }
    },
    onError: error => dispatch(setGeolocationError(error)),
  });
};

export const useNetworkConnectionStartWatch = () => {
  const dispatch = useAppDispatch();

  const [alertId] = useState<string>(uuidv4);

  useNetworkConnectionStartWatchIntegration({
    onConnect() {
      dispatch(removeAlert({ id: alertId }));
    },
    onDisconnect() {
      dispatch(addAlert({ type: 'internet_disconnected', priority: AlertPriority.System, id: alertId }));
    },
  });
};
