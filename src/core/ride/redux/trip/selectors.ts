import { AppState } from '../../../redux/store';

export const orderSelector = (state: AppState) => state.trip.order;
export const secondOrderSelector = (state: AppState) => state.trip.secondOrder;
export const tripStatusSelector = (state: AppState) => state.trip.tripStatus;
