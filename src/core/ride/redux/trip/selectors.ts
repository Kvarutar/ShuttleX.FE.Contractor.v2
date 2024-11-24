import { AppState } from '../../../redux/store';

export const orderSelector = (state: AppState) => state.trip.order;
export const offerSelector = (state: AppState) => state.trip.offer;
export const secondOrderSelector = (state: AppState) => state.trip.secondOrder;
export const tripStatusSelector = (state: AppState) => state.trip.tripStatus;
export const tripPointsSelector = (state: AppState) => state.trip.tripPoints;
export const isCanceledTripsPopupVisibleSelector = (state: AppState) => state.trip.isCanceledTripsPopupVisible;
export const pickUpRouteIdSelector = (state: AppState) => state.trip.offer?.pickUpRouteId;
export const dropOffRouteIdSelector = (state: AppState) => state.trip.offer?.dropOffRouteId;
export const wayPointsPickUpSelector = (state: AppState) => state.trip.pickUpPoint?.waypoints;
export const wayPointsDropOffSelector = (state: AppState) => state.trip.dropOffPoint?.waypoints;
