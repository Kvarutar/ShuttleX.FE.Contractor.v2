import { TripPoint } from '../../../../../../core/ride/redux/trip/types';

export type AddressWithMetaProps = {
  tripPoints: TripPoint[];
};

export type AddressWithPassengerAndOrderInfoProps = {
  tripPoints: TripPoint[];
  withGoogleMapButton?: boolean;
  isWaiting?: boolean;
  timeForTimer: number;
  setWaitingTime?: (newState: number) => void;
};
