import { OrderStateFromAPI, TripStatus } from '../types';

export const tripStatusesByOrderStates: Record<Exclude<OrderStateFromAPI, 'None' | 'InPreviousOrder'>, TripStatus> = {
  MoveToPickUp: TripStatus.Idle,
  InPickUp: TripStatus.Arrived,
  MoveToStopPoint: TripStatus.NearStopPoint,
  InStopPoint: TripStatus.Ride,
  MoveToDropOff: TripStatus.Ride,
  CompletedSuccessfully: TripStatus.Idle,
  CanceledByPassenger: TripStatus.Idle,
  CanceledByContractor: TripStatus.Idle,
};
