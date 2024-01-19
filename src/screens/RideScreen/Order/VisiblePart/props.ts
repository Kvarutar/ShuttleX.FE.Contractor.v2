import { offerType, RideStatus } from '../../props';

export type VisiblePartProps = {
  offer: offerType;
  rideStatus: RideStatus;
  setRideStatus: (status: RideStatus) => void;
  endRide: () => void;
};
