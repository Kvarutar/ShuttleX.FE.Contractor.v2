import { createSlice } from '@reduxjs/toolkit';
import { NetworkErrorDetailsWithBody } from 'shuttlex-integration';

import { getAvailableSubscriptionStatus, getDebtSubscriptionStatus, getSubscriptions } from './thunks';
import { SubscriptionState } from './types';

const initialState: SubscriptionState = {
  subscriptions: [],
  subscriptionStatus: null,
  loading: {
    subscriptions: false,
    subscriptionStatus: false,
  },
  error: {
    subscriptions: null,
    subscriptionAvailableStatus: null,
    subscriptionDebtStatus: null,
  },
};

const slice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      //Subscriptions
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
      })

      //SubscriptionStatus
      .addCase(getAvailableSubscriptionStatus.pending, state => {
        state.loading.subscriptionStatus = true;
      })
      .addCase(getAvailableSubscriptionStatus.fulfilled, (state, action) => {
        state.loading.subscriptionStatus = false;
        state.subscriptionStatus = action.payload;
      })
      .addCase(getAvailableSubscriptionStatus.rejected, (state, action) => {
        state.loading.subscriptionStatus = false;
        state.error.subscriptionAvailableStatus = action.payload as NetworkErrorDetailsWithBody<any>;
      })
      .addCase(getDebtSubscriptionStatus.pending, state => {
        state.loading.subscriptionStatus = true;
      })
      .addCase(getDebtSubscriptionStatus.fulfilled, (state, action) => {
        state.loading.subscriptionStatus = false;
        state.subscriptionStatus = action.payload;
      })
      .addCase(getDebtSubscriptionStatus.rejected, (state, action) => {
        state.loading.subscriptionStatus = false;
        state.error.subscriptionDebtStatus = action.payload as NetworkErrorDetailsWithBody<any>;
      });
  },
});

export default slice.reducer;
