import { combineReducers, configureStore } from '@reduxjs/toolkit';
import * as Sentry from '@sentry/react-native';
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from 'redux-persist';

import reactotron from '../../../ReactotronConfig';
import authReducer from '../auth/redux';
import docsReducer from '../auth/redux/docs';
import contractorReducer from '../contractor/redux';
import { MMKVStorage } from '../localStorage';
import accountSettingsReducer from '../menu/redux/accountSettings';
import subscriptionReducer from '../menu/redux/subscription';
import walletReducer from '../menu/redux/wallet';
import alertsReducer from '../ride/redux/alerts';
import geolocationReducer from '../ride/redux/geolocation';
import mapReducer from '../ride/redux/map';
import tripReducer from '../ride/redux/trip';
import signalRReducer from './signalr';

//JUST EXAMPLE
//TODO: Add some configs like this when work with data persisting
const tripPersistConfig = {
  key: 'trip',
  storage: MMKVStorage,
  whitelist: [],
};

const rootReducer = combineReducers({
  auth: authReducer,
  docs: docsReducer,
  wallet: walletReducer,
  alerts: alertsReducer,
  geolocation: geolocationReducer,
  map: mapReducer,
  //JUST EXAMPLE
  //TODO: Change to other reducer when work with data persisting
  trip: persistReducer<ReturnType<typeof tripReducer>>(tripPersistConfig, tripReducer),
  contractor: contractorReducer,
  signalr: signalRReducer,
  accountSettings: accountSettingsReducer,
  subscription: subscriptionReducer,
});

const sentryReduxEnhancer = Sentry.createReduxEnhancer();

const devEnhancers = __DEV__ ? [reactotron.createEnhancer!()] : [];

export const store = configureStore({
  reducer: rootReducer,
  enhancers: [...devEnhancers, sentryReduxEnhancer],
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
