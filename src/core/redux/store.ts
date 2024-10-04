import { combineReducers, configureStore } from '@reduxjs/toolkit';

import reactotron from '../../../ReactotronConfig';
import docsReducer from '../auth/redux/docs';
import lockoutReducer from '../auth/redux/lockout';
import contractorReducer from '../contractor/redux';
import notificationsReducer from '../menu/redux/notifications';
import walletReducer from '../menu/redux/wallet';
import alertsReducer from '../ride/redux/alerts';
import geolocationReducer from '../ride/redux/geolocation';
import mapReducer from '../ride/redux/map';
import tripReducer from '../ride/redux/trip';
import signalRReducer from '../signalr';
import { signalRMiddleware } from '../signalr/middleware';
import statisticsReducer from '../statistics/redux';

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
  signalR: signalRReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(signalRMiddleware()),
  enhancers: __DEV__ ? [reactotron.createEnhancer!()] : [],
});

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
