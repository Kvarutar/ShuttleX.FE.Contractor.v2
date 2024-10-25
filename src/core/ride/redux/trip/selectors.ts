import { AppState } from '../../../redux/store';

export const orderSelector = (state: AppState) => state.trip.order;
export const secondOrderSelector = (state: AppState) => state.trip.secondOrder;
export const tripStatusSelector = (state: AppState) => state.trip.tripStatus;
export const tripPointsSelector = (state: AppState) => state.trip.tripPoints;
export const canceledTripsAmountSelector = (state: AppState) => state.trip.canceledTripsAmount;
export const isCanceledTripsPopupVisibleSelector = (state: AppState) => state.trip.isCanceledTripsPopupVisible;
