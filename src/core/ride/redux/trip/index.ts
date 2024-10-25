import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  fetchArrivedToDropOff,
  fetchArrivedToPickUp,
  fetchArrivedToStopPoint,
  fetchCancelTrip,
  fetchPickedUpAtPickUpPoint,
  fetchPickedUpAtStopPoint,
  getCanceledTripsAmount,
} from './thunks';
import { OrderType, TripState, TripStatus } from './types';

const initialState: TripState = {
  order: null,
  secondOrder: null,
  tripStatus: TripStatus.Idle,
  tripPoints: null,
  canceledTripsAmount: 0,
  isCanceledTripsPopupVisible: false,
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
      });
  },
});

export const {
  setOrder,
  setTripStatus,
  rateTrip,
  toNextTripPoint,
  endTrip,
  addCanceledTrip,
  setCanceledTripsAmount,
  setIsCanceledTripsPopupVisible,
} = slice.actions;

export default slice.reducer;
