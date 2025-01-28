import { AppState } from '../../../redux/store';

export const subscriptionsSelector = (state: AppState) => state.subscription.subscriptions;
export const subscriptionStatusSelector = (state: AppState) => state.subscription.subscriptionStatus;

//Loading
export const isSubscriptionsLoadingSelector = (state: AppState) => state.subscription.loading.subscriptions;
export const isSubscriptionStatusLoadingSelector = (state: AppState) => state.subscription.loading.subscriptionStatus;

//Errors
export const subscriptionsErrorSelector = (state: AppState) => state.subscription.error.subscriptions;
export const subscriptionAvailableStatusErrorSelector = (state: AppState) =>
  state.subscription.error.subscriptionAvailableStatus;
export const subscriptionDebtStatusErrorSelector = (state: AppState) => state.subscription.error.subscriptionDebtStatus;
