import { LatLng } from 'react-native-maps';

export type PassengerInfoType = {
  name: string;
  lastName: string;
  phone: string;
  avatarURL: string;
};

export type TripPoint = { address: string } & LatLng;

export type OrderType = {
  id: string;
  startPosition: TripPoint;
  targetPointsPosition: TripPoint[];
  passengerId: string;
  passenger: PassengerInfoType;
  tripTariff: string;
  price: string;
  fullDistance: number;
  fullTimeTimestamp: number;
  fullTimeMinutes: number;
  timeToOffer: number;
  waitingTimeInMin: number;
  pricePerMin: number;
  pricePerKm: number;
};

export type OfferType = Pick<
  OrderType,
  'startPosition' | 'targetPointsPosition' | 'price' | 'pricePerKm' | 'fullTimeMinutes'
>;

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
  Rating = 'rating',
}
