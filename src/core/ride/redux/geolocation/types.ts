import { GeolocationError } from '@react-native-community/geolocation';
import { LatLng } from 'react-native-maps';
import { LocationAccuracy } from 'react-native-permissions';

export type GeolocationState = {
  coordinates: LatLng | null;
  isPermissionGranted: boolean;
  isLocationEnabled: boolean;
  accuracy: LocationAccuracy;
  calculatedHeading: {
    headingExtended: number;
    current: number;
    previous: number;
    delta: number;
  };
  error?: GeolocationError;
};
