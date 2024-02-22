export type PassengerInfoType = {
  name: string;
  lastName: string;
  phone: string;
};

export type OfferType = {
  startPosition: string;
  targetPointsPosition: string[];
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
  tripPoints: string[] | null;
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
