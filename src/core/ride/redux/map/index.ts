import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { MapState } from './types';

const initialState: MapState = {
  cameraMode: 'free',
  stopPoints: [],
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
  },
});

export const { setMapCameraMode, setMapStopPoints } = slice.actions;

export default slice.reducer;
