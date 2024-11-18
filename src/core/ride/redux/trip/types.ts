import { LatLng } from 'react-native-maps';
import { NetworkErrorDetailsWithBody, Nullable } from 'shuttlex-integration';

export type PassengerInfoType = {
  name: string;
  lastName: string;
  phone: string;
  avatarURL: string;
};

export type TripPoint = { address: string } & LatLng;

export type OfferAPIResponse = {
  id: string;
  pickUpAddress: string;
  stopPointAddresses: string[];
  dropOffAddress: string;
  timeToPickUp: string;
  timeToDropOff: string;
  timeToAnswerSec: number;
  tariffId: string;
  distanceKm: number;
  price: number;
  pricePerKm: number;
  currency: string;
  pickUpRouteId: string;
  dropOffRouteId: string;
};

export type OfferWayPointsDataAPIResponse = {
  routeId: string;
  totalDistanceMtr: number;
  totalDurationSec: number;
  waypoints: [
    {
      location: {
        latitude: number;
        longitude: number;
      };
    },
  ];
  accurateGeometries: [
    {
      polylineStartIndex: number;
      polylineEndIndex: number;
      trafficLoad: string;
    },
  ];
  geometry: string;
  trafficLoad: string;
};

export type OfferPickUpAPIResponse = OfferWayPointsDataAPIResponse;
export type OfferDropOffAPIResponse = OfferWayPointsDataAPIResponse;

export type OfferType = {
  offerInfo: OfferAPIResponse;
  pickUpPoint: OfferPickUpAPIResponse;
  dropOffPoint: OfferDropOffAPIResponse;
};

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

export type TripState = {
  order: Nullable<OrderType>;
  offer: Nullable<OfferType>;
  secondOrder: Nullable<OrderType>;
  tripStatus: TripStatus;
  tripPoints: Nullable<TripPoint[]>;
  canceledTripsAmount: number;
  isCanceledTripsPopupVisible: boolean; // This state is here because it is used in very different components
  error: Nullable<NetworkErrorDetailsWithBody<any>>;
  isLoading: boolean;
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
