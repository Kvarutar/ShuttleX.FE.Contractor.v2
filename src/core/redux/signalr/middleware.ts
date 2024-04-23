import { Middleware } from '@reduxjs/toolkit';
import Config from 'react-native-config';
import { SignalR } from 'shuttlex-integration';

import { type AppDispatch, type AppState } from '../store';
import { connectSignalR, sendGeolocationToServer, updateSignalRAccessToken } from '.';

export const signalRMiddleware = (): Middleware => {
  const signalR = new SignalR<AppState, AppDispatch>(
    Config.SIGNALR_URL,
    connectSignalR.type,
    updateSignalRAccessToken.type,
  );

  signalR.listen('OnOfferCanceled', (_, offerId: string) => {
    console.log('OnOfferCanceled:', offerId);
  });

  signalR.on(sendGeolocationToServer.type, 'UpdateContractorGeoAsync');

  return api => next => action => signalR.process(api, next, action);
};
