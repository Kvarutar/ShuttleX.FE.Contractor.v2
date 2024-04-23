import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LatLng } from 'react-native-maps';

const slice = createSlice({
  name: 'signalr',
  initialState: {},
  reducers: {
    connectSignalR() {},
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateSignalRAccessToken(_, action: PayloadAction<string>) {},
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    sendGeolocationToServer(_, action: PayloadAction<LatLng>) {},
  },
});

export const { connectSignalR, updateSignalRAccessToken, sendGeolocationToServer } = slice.actions;

export default slice.reducer;
