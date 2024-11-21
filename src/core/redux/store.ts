import { combineReducers, configureStore } from '@reduxjs/toolkit';

import reactotron from '../../../ReactotronConfig';
import authReducer from '../auth/redux';
import docsReducer from '../auth/redux/docs';
import contractorReducer from '../contractor/redux';
import accountSettingsReducer from '../menu/redux/accountSettings';
import notificationsReducer from '../menu/redux/notifications';
import walletReducer from '../menu/redux/wallet';
import alertsReducer from '../ride/redux/alerts';
import geolocationReducer from '../ride/redux/geolocation';
import mapReducer from '../ride/redux/map';
import tripReducer from '../ride/redux/trip';
import signalRReducer from './signalr';

const rootReducer = combineReducers({
  auth: authReducer,
  docs: docsReducer,
  notifications: notificationsReducer,
  wallet: walletReducer,
  alerts: alertsReducer,
  geolocation: geolocationReducer,
  map: mapReducer,
  trip: tripReducer,
  contractor: contractorReducer,
  signalr: signalRReducer,
  accountSettings: accountSettingsReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  enhancers: __DEV__ ? [reactotron.createEnhancer!()] : [],
});

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
