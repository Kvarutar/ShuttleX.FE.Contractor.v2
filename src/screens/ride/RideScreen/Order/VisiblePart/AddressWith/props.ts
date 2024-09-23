import { TripPoint, TripStatus } from '../../../../../../core/ride/redux/trip/types';

export type AddressWithMetaProps = { tripPoints: TripPoint[]; timeForTimer: number };

export type AddressWithPassengerAndOrderInfoProps = {
  tripPoints: TripPoint[];
  withAvatar?: boolean;
  withGoogleMapButton?: boolean;
  isWaiting?: boolean;
  timeForTimer: number;
  contentType: TripStatus;
  setWaitingTime?: (newState: number) => void;
};
