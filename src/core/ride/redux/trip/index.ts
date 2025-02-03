import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { minToMilSec, NetworkErrorDetailsWithBody, Nullable } from 'shuttlex-integration';

import { TariffInfoFromAPI } from '../../../contractor/redux/types';
import {
  acceptOffer,
  declineOffer,
  fetchArrivedToDropOff,
  fetchArrivedToPickUp,
  fetchArrivedToStopPoint,
  fetchCancelTrip,
  fetchOfferInfo,
  fetchPickedUpAtPickUpPoint,
  fetchPickedUpAtStopPoint,
  fetchWayPointsRoute,
  getCurrentOrder,
  getFinalCost,
  getFutureOrder,
  getPassengerTripInfo,
  sendExpiredOffer,
  updatePassengerRating,
} from './thunks';
import {
  DataForOrderType,
  GetCurrentOrderFromAPI,
  OfferAPIResponse,
  OrderType,
  PassengerInfoAPIResponse,
  TripState,
  TripStatus,
} from './types';
import { tripStatusesByOrderStates } from './utils';

const initialState: TripState = {
  order: null,
  offer: null,
  pickUpRoute: null,
  dropOffRoute: null,
  futureOrderPickUpRoutes: null,
  secondOrder: null,
  tripStatus: TripStatus.Idle,
  tripPoints: [],
  canceledTripsAmount: 0,
  isCanceledTripsPopupVisible: false,
  error: {
    general: null,
    acceptOrDeclineOffer: null,
    getFinalCost: null,
  },
  loading: {
    acceptOffer: false,
    declineOffer: false,
    makeOfferDecision: false,
  },
  //TODO create selector and place where it needed
  longPolling: {
    current: false,
    future: false,
  },
};

const slice = createSlice({
  name: 'trip',
  initialState,
  reducers: {
    setOrderWithAdditionalInfo(
      state,
      action: PayloadAction<{
        tariffs: TariffInfoFromAPI[];
        orderId: string;
        passengerInfo: PassengerInfoAPIResponse;
        passengerAvatarURL: Nullable<string>;
        dataForOrder: Nullable<GetCurrentOrderFromAPI>;
        dataForOrderType: DataForOrderType;
      }>,
    ) {
      if (action.payload.dataForOrder) {
        const {
          pickUpAddress,
          stopPointAddresses,
          timeToPickUp,
          timeToDropOff,
          price,
          pricePerKm,
          tariffId,
          distanceMtr,
          pickUpRouteId,
          dropOffRouteId,
          arrivedToPickUpDate,
          pickUpDate,
          createdDate,
          state: orderState,
        } = action.payload.dataForOrder;
        const { orderId, passengerAvatarURL, passengerInfo, tariffs } = action.payload;

        const orderTariff = tariffs.find(tariff => tariff.id === tariffId);

        if (!orderTariff) {
          return;
        }

        const dropOffTime = new Date(timeToDropOff);
        const dropOffTimeFromNow = dropOffTime.getTime() - Date.now();

        const order: OrderType = {
          tariffId,
          pickUpAddress,
          price,
          pricePerKm,
          distanceMtr,
          waitingTimeInMilSec: minToMilSec(orderTariff.freeWaitingTimeMin),
          pricePerMin: orderTariff.paidWaitingTimeFeePriceMin,
          currencyCode: orderTariff.currencyCode,
          pickUpRouteId,
          dropOffRouteId,
          pickUpTime: null,
          timeToPickUp: Date.parse(timeToPickUp),
          timeToDropOff: dropOffTime.getTime(),
          timeToDropOffFromNow: dropOffTimeFromNow,
          travelTimeInMilSec: Date.parse(timeToDropOff) - Date.parse(createdDate),
          stopPointAddresses,
          id: orderId,
          passenger: {
            id: passengerInfo.id,
            name: passengerInfo.name,
            phone: passengerInfo.phone,
            avatarURL: passengerAvatarURL,
          },
        };

        if (arrivedToPickUpDate) {
          const timeDifferenceInMilSec = Date.now() - Date.parse(arrivedToPickUpDate);
          order.waitingTimeInMilSec = minToMilSec(orderTariff.freeWaitingTimeMin) - timeDifferenceInMilSec;
        }

        if (pickUpDate) {
          order.pickUpTime = Date.parse(pickUpDate);
          order.timeToDropOffFromNow = Date.parse(timeToDropOff) - Date.now();
        }

        if (action.payload.dataForOrderType === 'future') {
          state.secondOrder = { ...order };
        } else {
          state.order = order;
          if (orderState !== 'MoveToPickUp' && orderState !== 'InPickUp') {
            state.tripPoints = stopPointAddresses;
          } else {
            state.tripPoints = [order.pickUpAddress, ...stopPointAddresses];
          }
        }
      }
    },
    setOrder(state, action: PayloadAction<Nullable<OrderType>>) {
      state.order = action.payload;
    },
    setSecondOrder(state, action: PayloadAction<Nullable<OrderType>>) {
      state.secondOrder = action.payload;
    },
    setTripOffer(state, action: PayloadAction<Nullable<OfferAPIResponse>>) {
      state.offer = action.payload;
    },
    cleanTripState(state) {
      //Add some states if need
      state.offer = null;
      state.order = null;
      state.secondOrder = null;
      state.pickUpRoute = null;
      state.dropOffRoute = null;
      state.futureOrderPickUpRoutes = null;
      state.tripPoints = [];
    },
    setPassengerAvatar(state, action: PayloadAction<string>) {
      if (state.order) {
        state.order.passenger.avatarURL = action.payload;
      }
    },
    setTripStatus(state, action: PayloadAction<TripStatus>) {
      state.tripStatus = action.payload;
    },
    rateTrip(state) {
      state.tripStatus = TripStatus.Rating;
    },
    endTrip(state) {
      if (state.secondOrder) {
        state.tripPoints = [state.secondOrder.pickUpAddress, ...state.secondOrder.stopPointAddresses];
        state.order = state.secondOrder;
        state.secondOrder = null;
      } else {
        state.order = initialState.order;
        state.tripPoints = initialState.tripPoints;
      }
      state.tripStatus = TripStatus.Idle;
      state.pickUpRoute = initialState.pickUpRoute;
      state.dropOffRoute = initialState.dropOffRoute;
      state.futureOrderPickUpRoutes = initialState.futureOrderPickUpRoutes;
    },
    setIsCanceledTripsPopupVisible(state, action: PayloadAction<boolean>) {
      state.isCanceledTripsPopupVisible = action.payload;
    },
    toNextTripPoint(state) {
      if (state.tripPoints.length) {
        state.tripPoints.shift();
        state.tripStatus = TripStatus.Ride;
      }
    },
    resetCurrentRoutes(state) {
      state.pickUpRoute = null;
      state.dropOffRoute = null;
    },
    resetFutureRoutes(state) {
      state.futureOrderPickUpRoutes = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getCurrentOrder.pending, state => {
        state.loading.makeOfferDecision = true;
        state.error.general = null;
      })
      .addCase(getCurrentOrder.fulfilled, (state, action) => {
        if (action.payload) {
          const { tariffs, order, passenger } = action.payload;

          const stopPointAddresses = [...order.stopPointAddresses, order.dropOffAddress];

          if (order.state !== 'None' && order.state !== 'InPreviousOrder') {
            slice.caseReducers.setTripStatus(state, {
              payload: tripStatusesByOrderStates[order.state],
              type: setTripStatus.type,
            });
          }
          slice.caseReducers.setOrderWithAdditionalInfo(state, {
            payload: {
              tariffs,
              orderId: order.id,
              passengerInfo: passenger.info,
              passengerAvatarURL: passenger.avatarURL,
              dataForOrder: {
                ...order,
                stopPointAddresses,
              },
              dataForOrderType: 'current',
            },
            type: setOrderWithAdditionalInfo.type,
          });
        }
        //If current order is not received
        else {
          if (state.order && (state.tripStatus === TripStatus.Ride || state.tripStatus === TripStatus.Ending)) {
            state.tripStatus = TripStatus.Rating;
          }
          //Because this status might be changed in sse or notification also
          else if (state.tripStatus !== TripStatus.Rating) {
            slice.caseReducers.endTrip(state);
            slice.caseReducers.resetCurrentRoutes(state);
          }
        }
        state.loading.makeOfferDecision = false;
        state.error.general = null;
      })
      .addCase(getCurrentOrder.rejected, (state, action) => {
        state.loading.makeOfferDecision = false;
        state.error.general = action.payload as NetworkErrorDetailsWithBody<any>;
      })
      .addCase(getFutureOrder.pending, state => {
        state.loading.makeOfferDecision = true;
        state.error.general = null;
      })
      .addCase(getFutureOrder.fulfilled, (state, action) => {
        if (action.payload) {
          const { tariffs, order, passenger } = action.payload;

          slice.caseReducers.setOrderWithAdditionalInfo(state, {
            payload: {
              tariffs,
              orderId: order.id,
              passengerInfo: passenger.info,
              passengerAvatarURL: passenger.avatarURL,
              dataForOrder: {
                ...order,
                stopPointAddresses: [...order.stopPointAddresses, order.dropOffAddress],
              },
              dataForOrderType: 'future',
            },
            type: setOrderWithAdditionalInfo.type,
          });
        }
        //If future order is not received
        else if (state.secondOrder) {
          state.secondOrder = null;
          slice.caseReducers.resetFutureRoutes(state);
        }
        state.loading.makeOfferDecision = false;
        state.error.general = null;
      })
      .addCase(getFutureOrder.rejected, (state, action) => {
        state.loading.makeOfferDecision = false;
        state.error.general = action.payload as NetworkErrorDetailsWithBody<any>;
      })
      .addCase(fetchOfferInfo.pending, state => {
        state.loading.makeOfferDecision = true;
        state.error.general = null;
      })
      .addCase(fetchOfferInfo.fulfilled, (state, action) => {
        slice.caseReducers.setTripOffer(state, {
          payload: {
            ...action.payload,
            stopPointAddresses: [...action.payload.stopPointAddresses, action.payload.dropOffAddress],
          },
          type: setTripOffer.type,
        });
        state.loading.makeOfferDecision = false;
        state.error.general = null;
      })
      .addCase(fetchOfferInfo.rejected, (state, action) => {
        state.loading.makeOfferDecision = false;
        state.error.general = action.payload as NetworkErrorDetailsWithBody<any>;
      })
      .addCase(fetchWayPointsRoute.pending, state => {
        state.loading.makeOfferDecision = true;
        state.error.general = null;
      })
      .addCase(fetchWayPointsRoute.fulfilled, (state, action) => {
        switch (action.payload.type) {
          case 'current':
            state.pickUpRoute = action.payload.pickup;
            state.dropOffRoute = action.payload.dropoff;
            break;
          case 'future':
            state.futureOrderPickUpRoutes = action.payload.pickup;
            break;
        }
        state.loading.makeOfferDecision = false;
        state.error.general = null;
      })
      .addCase(fetchWayPointsRoute.rejected, (state, action) => {
        state.loading.makeOfferDecision = false;
        state.error.general = action.payload as NetworkErrorDetailsWithBody<any>;
      })
      .addCase(acceptOffer.pending, state => {
        state.loading.acceptOffer = true;
        state.error.acceptOrDeclineOffer = null;
      })
      .addCase(acceptOffer.fulfilled, state => {
        slice.caseReducers.setTripOffer(state, {
          payload: initialState.offer,
          type: setTripOffer.type,
        });
        state.loading.acceptOffer = false;
        state.error.acceptOrDeclineOffer = null;
      })
      .addCase(acceptOffer.rejected, (state, action) => {
        state.loading.acceptOffer = false;
        state.error.acceptOrDeclineOffer = action.payload as NetworkErrorDetailsWithBody<any>;
      })
      .addCase(sendExpiredOffer.pending, state => {
        state.loading.makeOfferDecision = true;
        state.error.general = null;
      })
      .addCase(sendExpiredOffer.fulfilled, state => {
        slice.caseReducers.setTripOffer(state, {
          payload: initialState.offer,
          type: setTripOffer.type,
        });
        state.loading.makeOfferDecision = false;
        state.error.general = null;
      })
      .addCase(sendExpiredOffer.rejected, (state, action) => {
        state.loading.makeOfferDecision = false;
        state.error.acceptOrDeclineOffer = action.payload as NetworkErrorDetailsWithBody<any>;
      })
      .addCase(declineOffer.pending, state => {
        state.loading.declineOffer = true;
        state.error.acceptOrDeclineOffer = null;
      })
      .addCase(declineOffer.fulfilled, state => {
        slice.caseReducers.setTripOffer(state, {
          payload: initialState.offer,
          type: setTripOffer.type,
        });
        state.loading.declineOffer = false;
        state.error.acceptOrDeclineOffer = null;
      })
      .addCase(declineOffer.rejected, (state, action) => {
        state.loading.declineOffer = false;
        state.error.acceptOrDeclineOffer = action.payload as NetworkErrorDetailsWithBody<any>;
      })
      .addCase(getPassengerTripInfo.pending, state => {
        state.loading.makeOfferDecision = true;
        state.error.general = null;
      })
      .addCase(getPassengerTripInfo.fulfilled, state => {
        state.loading.makeOfferDecision = false;
        state.error.general = null;
      })
      .addCase(getPassengerTripInfo.rejected, (state, action) => {
        state.loading.makeOfferDecision = false;
        state.error.general = action.payload as NetworkErrorDetailsWithBody<any>;
      })
      .addCase(fetchArrivedToPickUp.pending, state => {
        state.loading.makeOfferDecision = true;
        state.error.general = null;
      })
      .addCase(fetchArrivedToPickUp.fulfilled, state => {
        slice.caseReducers.setTripStatus(state, {
          payload: TripStatus.Arrived,
          type: setTripStatus.type,
        });
        state.loading.makeOfferDecision = false;
        state.error.general = null;
      })
      .addCase(fetchArrivedToPickUp.rejected, (state, action) => {
        state.loading.makeOfferDecision = false;
        state.error.general = action.payload as NetworkErrorDetailsWithBody<any>;
      })
      .addCase(fetchPickedUpAtPickUpPoint.pending, state => {
        state.loading.makeOfferDecision = true;
        state.error.general = null;
      })
      .addCase(fetchPickedUpAtPickUpPoint.fulfilled, state => {
        state.loading.makeOfferDecision = false;
        state.error.general = null;
      })
      .addCase(fetchPickedUpAtPickUpPoint.rejected, (state, action) => {
        state.loading.makeOfferDecision = false;
        state.error.general = action.payload as NetworkErrorDetailsWithBody<any>;
      })
      .addCase(updatePassengerRating.pending, state => {
        state.loading.makeOfferDecision = true;
        state.error.general = null;
      })
      .addCase(updatePassengerRating.fulfilled, state => {
        slice.caseReducers.endTrip(state);
        state.loading.makeOfferDecision = false;
        state.error.general = null;
      })
      .addCase(updatePassengerRating.rejected, (state, action) => {
        state.loading.makeOfferDecision = false;
        state.error.general = action.payload as NetworkErrorDetailsWithBody<any>;
      })
      .addCase(getFinalCost.pending, state => {
        state.loading.makeOfferDecision = true;
        state.error.getFinalCost = null;
      })
      .addCase(getFinalCost.fulfilled, (state, action) => {
        if (state.order) {
          state.order.price = action.payload.cost;
          state.order.currencyCode = action.payload.currency;
        }
        state.loading.makeOfferDecision = false;
        state.error.getFinalCost = null;
      })
      .addCase(getFinalCost.rejected, (state, action) => {
        state.loading.makeOfferDecision = false;
        state.error.getFinalCost = action.payload as NetworkErrorDetailsWithBody<any>;
      })
      //TODO: Rewtire when work with stop points
      // Not needed for now
      .addCase(fetchArrivedToStopPoint.fulfilled, state => {
        slice.caseReducers.setTripStatus(state, {
          payload: TripStatus.ArrivedAtStopPoint,
          type: setTripStatus.type,
        });
      })
      //TODO: Rewtire when work with stop points
      // Not needed for now
      .addCase(fetchPickedUpAtStopPoint.fulfilled, state => {
        slice.caseReducers.toNextTripPoint(state);
      })
      .addCase(fetchArrivedToDropOff.pending, state => {
        state.loading.makeOfferDecision = true;
        state.error.general = null;
      })
      .addCase(fetchArrivedToDropOff.fulfilled, state => {
        slice.caseReducers.rateTrip(state);
        state.loading.makeOfferDecision = false;
        state.error.general = null;
      })
      .addCase(fetchArrivedToDropOff.rejected, (state, action) => {
        state.loading.makeOfferDecision = false;
        state.error.general = action.payload as NetworkErrorDetailsWithBody<any>;
      })
      .addCase(fetchCancelTrip.pending, state => {
        state.loading.makeOfferDecision = true;
        state.error.general = null;
      })
      .addCase(fetchCancelTrip.fulfilled, state => {
        slice.caseReducers.endTrip(state);
        slice.caseReducers.setIsCanceledTripsPopupVisible(state, slice.actions.setIsCanceledTripsPopupVisible(true));
        state.loading.makeOfferDecision = false;
        state.error.general = null;
      })
      .addCase(fetchCancelTrip.rejected, (state, action) => {
        state.loading.makeOfferDecision = false;
        state.error.general = action.payload as NetworkErrorDetailsWithBody<any>;
      });
  },
});

export const {
  setOrderWithAdditionalInfo,
  setOrder,
  cleanTripState,
  setSecondOrder,
  setPassengerAvatar,
  setTripOffer,
  setTripStatus,
  rateTrip,
  toNextTripPoint,
  endTrip,
  setIsCanceledTripsPopupVisible,
  resetCurrentRoutes,
  resetFutureRoutes,
} = slice.actions;

export default slice.reducer;
