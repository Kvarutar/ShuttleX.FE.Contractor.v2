import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { OfferType, TripState, TripStatus } from './types';

const initialState: TripState = {
  order: null,
  secondOrder: null,
  tripStatus: TripStatus.Idle,
};

const slice = createSlice({
  name: 'trip',
  initialState,
  reducers: {
    setOrder(state, action: PayloadAction<OfferType>) {
      const { startPosition, targetPointsPosition, passengerId, passenger, tripTariff, total } = action.payload;
      state.order = {
        startPosition,
        targetPointsPosition,
        passengerId,
        passenger,
        tripTariff,
        total,
      };
    },
    setSecondOrder(state, action: PayloadAction<OfferType>) {
      const { startPosition, targetPointsPosition, passengerId, passenger, tripTariff, total } = action.payload;
      state.secondOrder = {
        startPosition,
        targetPointsPosition,
        passengerId,
        passenger,
        tripTariff,
        total,
      };
    },
    cleanOrder(state) {
      state.order = null;
    },
    cleanSecondOrder(state) {
      state.secondOrder = null;
    },
    setTripStatus(state, action: PayloadAction<TripStatus>) {
      state.tripStatus = action.payload;
    },
    endTrip(state) {
      if (state.secondOrder) {
        state.order = state.secondOrder;
        state.secondOrder = null;
      } else {
        state.order = null;
      }
      state.tripStatus = TripStatus.Idle;
    },
  },
});

export const { setOrder, setSecondOrder, cleanOrder, cleanSecondOrder, setTripStatus, endTrip } = slice.actions;

export default slice.reducer;
