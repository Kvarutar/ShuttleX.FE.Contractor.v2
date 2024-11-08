import { combineReducers, configureStore } from '@reduxjs/toolkit';

import reactotron from '../../../ReactotronConfig';
import docsReducer from '../auth/redux/docs';
import lockoutReducer from '../auth/redux/lockout';
import contractorReducer from '../contractor/redux';
import accountSettingsReducer from '../menu/redux/accountSettings';
import notificationsReducer from '../menu/redux/notifications';
import walletReducer from '../menu/redux/wallet';
import alertsReducer from '../ride/redux/alerts';
import geolocationReducer from '../ride/redux/geolocation';
import mapReducer from '../ride/redux/map';
import tripReducer from '../ride/redux/trip';
import statisticsReducer from '../statistics/redux';
import signalRReducer from './signalr';

const rootReducer = combineReducers({
  docs: docsReducer,
  lockout: lockoutReducer,
  notifications: notificationsReducer,
  wallet: walletReducer,
  statistics: statisticsReducer,
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
