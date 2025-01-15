import Config from 'react-native-config';
import EventSource from 'react-native-sse';

import { SSEAndNotificationsEventType } from '../utils/notifications/types';
import { newOfferSSEHandler, passengerRejectedSSEHandler } from './handlers';

export const initializeSSEConnection = (accessToken: string) => {
  const eventSource = new EventSource<SSEAndNotificationsEventType>(`${Config.SSE_URL}/connect?userType=contractor`, {
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
