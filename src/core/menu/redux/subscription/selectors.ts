import { AppState } from '../../../redux/store';

export const subscriptionsSelector = (state: AppState) => state.subscription.subscriptions;

//Loading
export const isSubscriptionsLoadingSelector = (state: AppState) => state.subscription.loading.subscriptions;

//Errors
export const subscriptionsErrorSelector = (state: AppState) => state.subscription.error.subscriptions;
