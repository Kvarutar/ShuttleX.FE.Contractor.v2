import { LatLng } from 'react-native-maps';

export type GoogleMapButtonPoints = {
  startPoint: LatLng;
  endPoint: LatLng;
};

export type AddressWithMetaProps = {
  tripPointsAddresses: string[];
  startTime: number | null;
  endTime: number;
  googleMapButtonPoints?: GoogleMapButtonPoints;
};

export type AddressWithPassengerAndOrderInfoProps = {
  tripPointsAddresses: string[];
  timeForTimer: number;
  googleMapButtonPoints?: GoogleMapButtonPoints;
  isWaiting?: boolean;
  setWaitingTime?: (newState: number) => void;
};
