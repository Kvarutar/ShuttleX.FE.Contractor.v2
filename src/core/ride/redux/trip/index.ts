import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NetworkErrorDetailsWithBody } from 'shuttlex-integration';

import {
  fetchArrivedToDropOff,
  fetchArrivedToPickUp,
  fetchArrivedToStopPoint,
  fetchCancelTrip,
  fetchOfferInfo,
  fetchPickedUpAtPickUpPoint,
  fetchPickedUpAtStopPoint,
  fetchWayPointsRoute,
  getCanceledTripsAmount,
} from './thunks';
import { OfferAPIResponse, OfferWayPointsDataAPIResponse, OrderType, TripState, TripStatus } from './types';

const initialState: TripState = {
  order: null,
  offer: null,
  secondOrder: null,
  tripStatus: TripStatus.Idle,
  tripPoints: null,
  canceledTripsAmount: 0,
  isCanceledTripsPopupVisible: false,
  error: null,
  //TODO create selector and place where it needed
  isLoading: false,
};

const slice = createSlice({
  name: 'trip',
  initialState,
  reducers: {
    setOrder(state, action: PayloadAction<OrderType>) {
      if (state.order && !state.secondOrder) {
        state.secondOrder = action.payload;
      } else if (!state.order) {
        state.order = action.payload;
        state.tripPoints = [action.payload.startPosition, ...action.payload.targetPointsPosition];
      }
    },
    setTripOffer(state, action: PayloadAction<OfferAPIResponse>) {
      if (state.offer) {
        state.offer.offerInfo = action.payload;
      }
    },
    setTripOfferError(state, action: PayloadAction<NetworkErrorDetailsWithBody<any> | null>) {
      state.error = action.payload;
    },
    setTripIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setWayPointsRoute(
      state,
      action: PayloadAction<{ pickup: OfferWayPointsDataAPIResponse; dropoff: OfferWayPointsDataAPIResponse }>,
    ) {
      if (state.offer) {
        state.offer.pickUpPoint = action.payload.pickup;
        state.offer.dropOffPoint = action.payload.dropoff;
      }
    },
    setOrderFullTime(state, action: PayloadAction<number>) {
      if (state.order) {
        state.order.fullTimeTimestamp = action.payload;
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
        state.tripPoints = [state.secondOrder.startPosition, ...state.secondOrder.targetPointsPosition];
        state.order = state.secondOrder;
        state.secondOrder = null;
      } else {
        state.order = null;
        state.tripPoints = null;
      }
      state.tripStatus = TripStatus.Idle;
    },
    setCanceledTripsAmount(state, action: PayloadAction<number>) {
      state.canceledTripsAmount = action.payload;
    },
    setIsCanceledTripsPopupVisible(state, action: PayloadAction<boolean>) {
      state.isCanceledTripsPopupVisible = action.payload;
    },
    addCanceledTrip(state) {
      state.canceledTripsAmount++;
    },
    toNextTripPoint(state) {
      if (state.tripPoints) {
        state.tripPoints.shift();
        state.tripStatus = TripStatus.Ride;
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchArrivedToPickUp.fulfilled, state => {
        slice.caseReducers.setTripStatus(state, {
          payload: TripStatus.Arrived,
          type: setTripStatus.type,
        });
      })
      .addCase(fetchArrivedToStopPoint.fulfilled, state => {
        slice.caseReducers.setTripStatus(state, {
          payload: TripStatus.ArrivedAtStopPoint,
          type: setTripStatus.type,
        });
      })
      .addCase(fetchArrivedToDropOff.fulfilled, state => {
        slice.caseReducers.rateTrip(state);
      })
      .addCase(fetchPickedUpAtPickUpPoint.fulfilled, (state, action) => {
        slice.caseReducers.toNextTripPoint(state);
        slice.caseReducers.setOrderFullTime(state, slice.actions.setOrderFullTime(action.payload.fulltime));
      })
      .addCase(fetchPickedUpAtStopPoint.fulfilled, state => {
        slice.caseReducers.toNextTripPoint(state);
      })
      .addCase(fetchCancelTrip.fulfilled, (state, action) => {
        if (action.payload) {
          slice.caseReducers.addCanceledTrip(state);
          slice.caseReducers.setIsCanceledTripsPopupVisible(state, slice.actions.setIsCanceledTripsPopupVisible(true));
        }
      })
      .addCase(getCanceledTripsAmount.fulfilled, (state, action) => {
        slice.caseReducers.setCanceledTripsAmount(state, {
          payload: action.payload,
          type: setTripStatus.type,
        });
      })
      .addCase(fetchOfferInfo.pending, state => {
        slice.caseReducers.setTripIsLoading(state, {
          payload: true,
          type: setTripIsLoading.type,
        });
        slice.caseReducers.setTripOfferError(state, {
          payload: initialState.error,
          type: setTripOfferError.type,
        });
      })
      .addCase(fetchOfferInfo.fulfilled, (state, action) => {
        slice.caseReducers.setTripIsLoading(state, {
          payload: false,
          type: setTripIsLoading.type,
        });
        slice.caseReducers.setTripOfferError(state, {
          payload: initialState.error,
          type: setTripOfferError.type,
        });
        slice.caseReducers.setTripOffer(state, {
          payload: action.payload,
          type: setTripOffer.type,
        });
      })
      .addCase(fetchOfferInfo.rejected, (state, action) => {
        slice.caseReducers.setTripIsLoading(state, {
          payload: false,
          type: setTripIsLoading.type,
        });
        slice.caseReducers.setTripOfferError(state, {
          payload: action.payload as NetworkErrorDetailsWithBody<any>, //TODO: remove this cast after fix with rejectedValue
          type: setTripOfferError.type,
        });
      })
      .addCase(fetchWayPointsRoute.pending, state => {
        slice.caseReducers.setTripIsLoading(state, {
          payload: true,
          type: setTripIsLoading.type,
        });
        slice.caseReducers.setTripOfferError(state, {
          payload: initialState.error,
          type: setTripOfferError.type,
        });
      })
      .addCase(fetchWayPointsRoute.fulfilled, (state, action) => {
        slice.caseReducers.setTripIsLoading(state, {
          payload: false,
          type: setTripIsLoading.type,
        });
        slice.caseReducers.setTripOfferError(state, {
          payload: initialState.error,
          type: setTripOfferError.type,
        });
        slice.caseReducers.setWayPointsRoute(state, {
          payload: { pickup: action.payload.pickup, dropoff: action.payload.dropoff },
          type: setWayPointsRoute.type,
        });
      })
      .addCase(fetchWayPointsRoute.rejected, (state, action) => {
        slice.caseReducers.setTripIsLoading(state, {
          payload: false,
          type: setTripIsLoading.type,
        });
        slice.caseReducers.setTripOfferError(state, {
          payload: action.payload as NetworkErrorDetailsWithBody<any>, //TODO: remove this cast after fix with rejectedValue
          type: setTripOfferError.type,
        });
      });
  },
});

export const {
  setOrder,
  setTripOffer,
  setTripStatus,
  rateTrip,
  toNextTripPoint,
  endTrip,
  addCanceledTrip,
  setCanceledTripsAmount,
  setIsCanceledTripsPopupVisible,
  setWayPointsRoute,
  setTripIsLoading,
  setTripOfferError,
} = slice.actions;

export default slice.reducer;
