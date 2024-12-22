import { LatLng } from 'react-native-maps';
import { MapCameraMode } from 'shuttlex-integration';

import { OfferWayPointsDataAPIResponse } from '../trip/types';

export type MapState = {
  cameraMode: MapCameraMode;
  stopPoints: LatLng[];
  ridePercentFromPolylines: string;
  routeTraffic: OfferWayPointsDataAPIResponse['accurateGeometries'] | null;
};
