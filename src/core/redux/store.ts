import { combineReducers, configureStore } from '@reduxjs/toolkit';

import docsReducer from '../auth/redux/docs';
import notificationsReducer from '../menu/redux/notifications';
import walletReducer from '../menu/redux/wallet';
import alertsReducer from '../ride/redux/alerts';
import geolocationReducer from '../ride/redux/geolocation';
import mapReducer from '../ride/redux/map';
import tripReducer from '../ride/redux/trip';
import contractorReducer from './contractor';
import signalRReducer from './signalr';
import { signalRMiddleware } from './signalr/middleware';
import reactotron from '../../../ReactotronConfig';

const rootReducer = combineReducers({
  docs: docsReducer,
  notifications: notificationsReducer,
  wallet: walletReducer,
  alerts: alertsReducer,
  geolocation: geolocationReducer,
  map: mapReducer,
  trip: tripReducer,
  contractor: contractorReducer,
  signalR: signalRReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(signalRMiddleware()),
  enhancers: __DEV__ ? [reactotron.createEnhancer!()] : [],
});

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
