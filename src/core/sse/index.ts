import Config from 'react-native-config';
import EventSource from 'react-native-sse';
import { Nullable } from 'shuttlex-integration';

import { SSEAndNotificationsEventType } from '../utils/notifications/types';
import { newOfferSSEHandler, passengerRejectedSSEHandler } from './handlers';

let eventSource: Nullable<EventSource<SSEAndNotificationsEventType>> = null;

export const initializeSSEConnection = (accessToken: string) => {
  eventSource = new EventSource<SSEAndNotificationsEventType>(`${Config.SSE_URL}/connect?userType=contractor`, {
    method: 'GET',
    headers: {
      Accept: '*/*',
      Connection: 'keep-alive',
      Authorization: `Bearer ${accessToken}`,
    },
    debug: __DEV__,
  });

  eventSource.addEventListener(SSEAndNotificationsEventType.NewOffer, newOfferSSEHandler);
  eventSource.addEventListener(SSEAndNotificationsEventType.PassengerRejected, passengerRejectedSSEHandler);
};

export const removeAllSSEListeners = () => {
  if (eventSource) {
    eventSource.removeAllEventListeners();
  }
};

export const closeSSEConnection = () => {
  if (eventSource) {
    eventSource.close();
    eventSource = null;
  }
};
