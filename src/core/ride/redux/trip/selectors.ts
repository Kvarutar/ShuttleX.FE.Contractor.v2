import { AppState } from '../../../redux/store';

export const orderSelector = (state: AppState) => state.trip.order;
export const offerSelector = (state: AppState) => state.trip.offer;
export const secondOrderSelector = (state: AppState) => state.trip.secondOrder;
export const tripStatusSelector = (state: AppState) => state.trip.tripStatus;
export const tripPointsSelector = (state: AppState) => state.trip.tripPoints;
export const isCanceledTripsPopupVisibleSelector = (state: AppState) => state.trip.isCanceledTripsPopupVisible;
export const pickUpRouteIdSelector = (state: AppState) => state.trip.offer?.pickUpRouteId;
export const dropOffRouteIdSelector = (state: AppState) => state.trip.offer?.dropOffRouteId;
export const tripPickUpRouteSelector = (state: AppState) => state.trip.pickUpRoute;
export const tripDropOffRouteSelector = (state: AppState) => state.trip.dropOffRoute;
export const tripFutureOrderPickUpRouteSelector = (state: AppState) => state.trip.futureOrderPickUpRoutes;

//Errors
export const tripErrorSelector = (state: AppState) => state.trip.error.general;
export const acceptOrDeclineOfferErrorSelector = (state: AppState) => state.trip.error.acceptOrDeclineOffer;

//Long Polling
export const isCurrentOrderLongPollingActiveSelector = (state: AppState) => state.trip.longPolling.current;
export const isFutureOrderLongPollingActiveSelector = (state: AppState) => state.trip.longPolling.future;

//Loading
export const isAcceptOfferLoadingSelector = (state: AppState) => state.trip.loading.acceptOffer;
export const isDeclineOfferLoadingSelector = (state: AppState) => state.trip.loading.declineOffer;
