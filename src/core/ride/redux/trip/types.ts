import { LatLng } from 'react-native-maps';
import { NetworkErrorDetailsWithBody, Nullable } from 'shuttlex-integration';

import { TariffInfo } from '../../../contractor/redux/types';

export type TripPoint = { address: string } & LatLng;

export type PassengerInfoAPIResponse = {
  id: string;
  name: string;
  phone: string;
};

export type PassengerAvatarAPIResponse = Blob;

export type PassengerInfoType = {
  id: string;
  name: string;
  phone: string;
  avatarURL: Nullable<string>;
};

export type AcceptOrDeclineOfferPayload = {
  offerId: string;
};

export type AcceptOfferAPIResponse = {
  orderId: string;
};

export type GetPassengerTripInfoPayload = {
  orderId: string;
};

export type ArrivedToPickUpPayload = {
  orderId: string;
};

export type ArrivedToPickUpAPIRequest = LatLng;

export type PickedUpAtPickUpPointPayload = {
  orderId: string;
};

export type ArrivedToDropOffPayload = {
  orderId: string;
};

export type ArrivedToDropOffAPIRequest = LatLng;

export type UpdatePassengerRatingPayload = {
  orderId: string;
  rate: boolean;
};

export type UpdatePassengerRatingAPIRequest = {
  rate: boolean;
};

export type FetchCancelTripPayload = {
  orderId: string;
};

export type OfferAPIResponse = {
  id: string;
  pickUpAddress: string;
  stopPointAddresses: string[];
  dropOffAddress: string;
  timeToPickUp: string;
  timeToDropOff: string;
  timeToAnswerSec: number;
  tariffId: string;
  distanceMtr: number;
  price: number;
  pricePerKm: number;
  currency: string;
  pickUpRouteId: string;
  dropOffRouteId: string;
};

export type OfferInfo = OfferAPIResponse;

export type OfferWayPointsDataAPIResponse = {
  routeId: string;
  totalDistanceMtr: number;
  totalDurationSec: number;
  waypoints: {
    geo: LatLng;
    index: number;
  }[];
  accurateGeometries: {
    polylineStartIndex: number;
    polylineEndIndex: number;
    trafficLoad: string;
  }[];
  geometry: string;
  trafficLoad: string;
};

export type OfferPickUpAPIResponse = OfferWayPointsDataAPIResponse;
export type OfferDropOffAPIResponse = OfferWayPointsDataAPIResponse;

export type AcceptOfferThunkResult = {
  orderId: string;
  passenger: {
    info: PassengerInfoAPIResponse;
    avatarURL: Nullable<string>;
  };
  tariffs: TariffInfo[];
};

export type GetPassengerTripInfoThunkResult = {
  orderId: string;
  passenger: {
    info: PassengerInfoAPIResponse;
    avatarURL: Nullable<string>;
  };
  tariffs: TariffInfo[];
};

export type OrderStateFromAPI =
  | 'None'
  | 'InPreviousOrder'
  | 'MoveToPickUp'
  | 'InPickUp'
  | 'MoveToStopPoint'
  | 'InStopPoint'
  | 'MoveToDropOff'
  | 'CompletedSuccessfully'
  | 'CanceledByPassenger'
  | 'CanceledByContractor';

//TODO: Ask BE why we get '' and why not null
export type GetCurrentOrderAPIResponse = GetCurrentOrderFromAPI | '';

export type GetCurrentOrderFromAPI = {
  id: string;
  state: OrderStateFromAPI;
  pickUpAddress: string;
  stopPointAddresses: string[];
  dropOffAddress: string;
  timeToPickUp: string;
  timeToDropOff: string;
  tariffId: string;
  distanceMtr: number;
  price: number;
  pricePerKm: number;
  currency: string;
  pickUpRouteId: string;
  dropOffRouteId: string;
};

export type GetFutureOrderAPIResponse = GetCurrentOrderAPIResponse;

//TODO Rewtrite this type
//Logic is too complex now
export type GetCurrentOrderThunkResult = Nullable<{
  order: GetCurrentOrderFromAPI;
  passenger: {
    info: PassengerInfoAPIResponse;
    avatarURL: Nullable<string>;
  };
  tariffs: TariffInfo[];
}>;

export type GetFutureOrderThunkResult = GetCurrentOrderThunkResult;

export type OrderType = {
  id: string;
  pickUpAddress: string;
  stopPointAddresses: string[];
  passenger: PassengerInfoType;
  tariffId: string;
  price: number;
  timeToPickUp: number;
  timeToDropOffInMin: number;
  waitingTimeInMin: number;
  pricePerMin: number;
  pricePerKm: number;
  distanceMtr: number;
  currencyCode: string;
  pickUpRouteId: string;
  dropOffRouteId: string;
};

export type TripState = {
  order: Nullable<OrderType>;
  pickUpPoint: Nullable<OfferWayPointsDataAPIResponse>;
  dropOffPoint: Nullable<OfferWayPointsDataAPIResponse>;
  offer: Nullable<OfferInfo>;
  secondOrder: Nullable<OrderType>;
  tripStatus: TripStatus;
  tripPoints: string[];
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
