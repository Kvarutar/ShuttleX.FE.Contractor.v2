import { offerType, RideStatus } from '../props';

export type OrderProps = {
  offer: offerType;
  rideStatus: RideStatus;
  setRideStatus: (status: RideStatus) => void;
  endRide: () => void;
};
