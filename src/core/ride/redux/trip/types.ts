import { LatLng } from 'react-native-maps';
import { NetworkErrorDetailsWithBody, Nullable } from 'shuttlex-integration';

import { TariffInfoFromAPI } from '../../../contractor/redux/types';

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

export type GetNewOfferAPIResponse = {
  offerId: string;
};

export type AcceptOrDeclineOfferPayload = {
  offerId: string;
};

export type SendExpiredOfferPayload = {
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

export type GetFinalCostPayload = {
  orderId: string;
};

export type GetFinalCostAPIResponse = {
  orderId: string;
  cost: number;
  currency: string;
};

export type OfferAPIResponse = {
  id: string;
  pickUpAddress: string;
  stopPointAddresses: string[];
  dropOffAddress: string;
  timeToPickUp: string;
  timeToDropOff: string;
  timeToAnswer: string;
  tariffId: string;
  distanceMtr: number;
  price: number;
  pricePerKm: number;
  currency: string;
  pickUpRouteId: string;
  dropOffRouteId: string;
  durationMin: number;
};

export type OfferInfo = OfferAPIResponse;

export type TrafficLoadFromAPI = 'Low' | 'Average' | 'High';

export type OfferWayPointsDataAPIResponse = {
  routeId: string;
  totalDistanceMtr: number;
  totalDurationSec: number;
  waypoints: {
    geo: LatLng;
    index: number;
  }[];
  legs: {
    accurateGeometries: {
      polylineStartIndex: number;
      polylineEndIndex: number;
      trafficLoad: TrafficLoadFromAPI;
    }[];
    durationSec: number;
    distanceMtr: number;
    geometry: string;
    trafficLoad: string;
    index: number;
  }[];
};

export type OfferPickUpAPIResponse = OfferWayPointsDataAPIResponse;
export type OfferDropOffAPIResponse = OfferWayPointsDataAPIResponse;

export type GetPassengerTripInfoThunkResult = {
  orderId: string;
  passenger: {
    info: PassengerInfoAPIResponse;
    avatarURL: Nullable<string>;
  };
  tariffs: TariffInfoFromAPI[];
};

export type DataForOrderType = 'current' | 'future';
export type WayPointsRouteType = 'current' | 'future';

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

export type GetCurrentOrderAPIResponse = GetCurrentOrderFromAPI;

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
  arrivedToPickUpDate: Nullable<string>;
  pickUpDate: Nullable<string>;
  dropOffDate: Nullable<string>;
  createdDate: string;
  updatedDate: string;
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
  tariffs: TariffInfoFromAPI[];
}>;

export type GetFutureOrderThunkResult = GetCurrentOrderThunkResult;

export type OrderType = {
  id: string;
  pickUpAddress: string;
  stopPointAddresses: string[];
  passenger: PassengerInfoType;
  tariffId: string;
  price: number;
  pickUpTime: number | null;
  timeToPickUp: number;
  timeToDropOff: number;
  timeToDropOffFromNow: number;
  waitingTimeInMilSec: number;
  pricePerMin: number;
  pricePerKm: number;
  distanceMtr: number;
  currencyCode: string;
  pickUpRouteId: string;
  dropOffRouteId: string;
  travelTimeInMilSec: number;
};

export type TripState = {
  order: Nullable<OrderType>;
  pickUpRoute: Nullable<OfferWayPointsDataAPIResponse>;
  dropOffRoute: Nullable<OfferWayPointsDataAPIResponse>;
  futureOrderPickUpRoutes: Nullable<OfferWayPointsDataAPIResponse>;
  offer: Nullable<OfferInfo>;
  secondOrder: Nullable<OrderType>;
  tripStatus: TripStatus;
  tripPoints: string[];
  canceledTripsAmount: number;
  isCanceledTripsPopupVisible: boolean; // This state is here because it is used in very different components
  error: {
    general: Nullable<NetworkErrorDetailsWithBody<any>>;
    acceptOrDeclineOffer: Nullable<NetworkErrorDetailsWithBody<any>>;
    getFinalCost: Nullable<NetworkErrorDetailsWithBody<any>>;
  };
  loading: {
    acceptOffer: boolean;
    declineOffer: boolean;
    makeOfferDecision: boolean;
  };
  longPolling: {
    current: boolean;
    future: boolean;
  };
};

export enum TripStatus {
  Idle = 'idle',
  NearPoint = 'nearPoint',
  NearStopPoint = 'nearStopPoint',
  Arrived = 'arrived',
  ArrivedAtStopPoint = 'arrivedAtStopPoint',
  Ride = 'ride',
  Ending = 'ending',
  Rating = 'rating',
}
