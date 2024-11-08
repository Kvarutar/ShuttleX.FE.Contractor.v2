import { LatLng } from 'react-native-maps';

export type UpdateContractorGeoSignalRRequest = {
  position: LatLng;
  state: 'Other' | 'InOrder';
  orderId: string | null;
};

export type UpdateContractorGeoSignalRResponse = {
  passengerId: string;
  location: LatLng;
} | null;
