import { combineReducers, configureStore } from '@reduxjs/toolkit';

import docsReducer from '../auth/redux/docs';
import notificationsReducer from '../menu/redux/notifications';
import walletReducer from '../menu/redux/wallet';
import alertsReducer from '../ride/redux/alerts';
import geolocationReducer from '../ride/redux/geolocation';
import tripReducer from '../ride/redux/trip';
import contractorReducer from './contractor';

const rootReducer = combineReducers({
  docs: docsReducer,
  notifications: notificationsReducer,
  wallet: walletReducer,
  alerts: alertsReducer,
  geolocation: geolocationReducer,
  trip: tripReducer,
  contractor: contractorReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
