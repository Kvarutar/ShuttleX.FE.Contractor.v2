import { LatLng } from 'react-native-maps';

export type PassengerInfoType = {
  name: string;
  lastName: string;
  phone: string;
};

export type TripPoint = { address: string } & LatLng;

export type OfferType = {
  startPosition: TripPoint;
  targetPointsPosition: TripPoint[];
  passengerId: string;
  passenger: PassengerInfoType;
  tripTariff: string;
  total: string;
  fullDistance: number;
  fullTime: number;
};

export type OrderType = Omit<OfferType, 'fullDistance' | 'fullTime'>;

export type TripState = {
  order: OrderType | null;
  secondOrder: OrderType | null;
  tripStatus: TripStatus;
  tripPoints: TripPoint[] | null;
};

export enum TripStatus {
  Idle = 'idle',
  Arriving = 'arriving',
  ArrivingAtStopPoint = 'arrivingAtStopPoint',
  Arrived = 'arrived',
  ArrivedAtStopPoint = 'arrivedAtStopPoint',
  Ride = 'ride',
  Ending = 'ending',
}
