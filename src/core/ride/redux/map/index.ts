import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { MapState } from './types';

const initialState: MapState = {
  cameraMode: 'free',
  stopPoints: [],
  ridePercentFromPolylines: '0%',
  routeTraffic: null,
};

const slice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    setMapCameraMode(state, action: PayloadAction<MapState['cameraMode']>) {
      state.cameraMode = action.payload;
    },
    setMapStopPoints(state, action: PayloadAction<MapState['stopPoints']>) {
      state.stopPoints = action.payload;
    },
    setMapRidePercentFromPolylines(state, action: PayloadAction<MapState['ridePercentFromPolylines']>) {
      state.ridePercentFromPolylines = action.payload;
    },
    setMapRouteTraffic(state, action: PayloadAction<MapState['routeTraffic']>) {
      state.routeTraffic = action.payload;
    },
  },
});

export const { setMapCameraMode, setMapStopPoints, setMapRidePercentFromPolylines, setMapRouteTraffic } = slice.actions;

export default slice.reducer;
