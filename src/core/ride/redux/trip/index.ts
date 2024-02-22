import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { OfferType, TripState, TripStatus } from './types';

const initialState: TripState = {
  order: null,
  secondOrder: null,
  tripStatus: TripStatus.Idle,
  tripPoints: null,
};

const slice = createSlice({
  name: 'trip',
  initialState,
  reducers: {
    setOrder(state, action: PayloadAction<OfferType>) {
      const { startPosition, targetPointsPosition, passengerId, passenger, tripTariff, total } = action.payload;
      if (state.order && !state.secondOrder) {
        state.secondOrder = {
          startPosition,
          targetPointsPosition,
          passengerId,
          passenger,
          tripTariff,
          total,
        };
      } else if (!state.order) {
        state.order = {
          startPosition,
          targetPointsPosition,
          passengerId,
          passenger,
          tripTariff,
          total,
        };
        state.tripPoints = [startPosition, ...targetPointsPosition];
      }
    },
    setTripStatus(state, action: PayloadAction<TripStatus>) {
      state.tripStatus = action.payload;
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
    toNextTripPoint(state) {
      if (state.tripPoints) {
        state.tripPoints.shift();
      }
    },
  },
});

export const { setOrder, setTripStatus, endTrip, toNextTripPoint } = slice.actions;

export default slice.reducer;
