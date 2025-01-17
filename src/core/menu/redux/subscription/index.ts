import { createSlice } from '@reduxjs/toolkit';
import { NetworkErrorDetailsWithBody } from 'shuttlex-integration';

import { getSubscriptions } from './thunks';
import { SubscriptionState } from './types';

const initialState: SubscriptionState = {
  subscriptions: [],
  loading: {
    subscriptions: false,
  },
  error: {
    subscriptions: null,
  },
};

const slice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getSubscriptions.pending, state => {
        state.loading.subscriptions = true;
        state.error.subscriptions = null;
      })
      .addCase(getSubscriptions.fulfilled, (state, action) => {
        state.subscriptions = action.payload;
        state.loading.subscriptions = false;
      })
      .addCase(getSubscriptions.rejected, (state, action) => {
        state.loading.subscriptions = false;
        state.error.subscriptions = action.payload as NetworkErrorDetailsWithBody<any>;
      });
  },
});

export default slice.reducer;
