import { combineReducers, configureStore } from '@reduxjs/toolkit';

import tripReducer from '../ride/redux/trip';

const rootReducer = combineReducers({
  trip: tripReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
