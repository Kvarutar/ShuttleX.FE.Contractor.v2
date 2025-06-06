import notifee, { AndroidColor } from '@notifee/react-native';
import { getTimezoneOffsetInMilSec, minToMilSec } from 'shuttlex-integration';

import { logger } from '../../../App';
import { getContractorInfo } from '../../contractor/redux/thunks';
import { store } from '../../redux/store';
import { endTrip, resetCurrentRoutes, resetFutureRoutes, setSecondOrder, setTripStatus } from '../../ride/redux/trip';
import { orderSelector, tripStatusSelector } from '../../ride/redux/trip/selectors';
import { fetchOfferInfo, getFinalCost } from '../../ride/redux/trip/thunks';
import { TripStatus } from '../../ride/redux/trip/types';
import {
  NotificationPayload,
  NotificationRemoteMessage,
  NotificationWithPayload,
  SSEAndNotificationsEventType,
} from './types';

const isValidNotificationType = (key: string): key is SSEAndNotificationsEventType => {
  return Object.values(SSEAndNotificationsEventType).includes(key as SSEAndNotificationsEventType);
};

const isPayloadRequired = (type: SSEAndNotificationsEventType): type is NotificationWithPayload => {
  return [SSEAndNotificationsEventType.NewOffer, SSEAndNotificationsEventType.PassengerRejected].includes(type);
};

export const notificationHandlers: Record<SSEAndNotificationsEventType, (payload?: NotificationPayload) => void> = {
  [SSEAndNotificationsEventType.NewOffer]: payload => {
    if (payload?.offerId) {
      store.dispatch(fetchOfferInfo(payload.offerId));
    }
  },
  [SSEAndNotificationsEventType.PassengerRejected]: async payload => {
    const order = orderSelector(store.getState());
    if (payload && payload.orderId && payload?.orderId === order?.id) {
      const tripStatus = tripStatusSelector(store.getState());
      if (tripStatus === TripStatus.Ride || tripStatus === TripStatus.Ending) {
        await store.dispatch(getFinalCost({ orderId: payload.orderId }));

        store.dispatch(setTripStatus(TripStatus.Rating));
      }
      //Because this status might be changed in sse or redux also
      else if (tripStatus !== TripStatus.Rating) {
        store.dispatch(endTrip());
        store.dispatch(resetCurrentRoutes());
      }
    } else {
      store.dispatch(setSecondOrder(null));
      store.dispatch(resetFutureRoutes());
    }

    store.dispatch(getContractorInfo());
  },
  [SSEAndNotificationsEventType.DocsApproved]: () => {
    store.dispatch(getContractorInfo());
  },

  [SSEAndNotificationsEventType.Custom]: () => {
    //just custom notif for test from endpoint
  },

  [SSEAndNotificationsEventType.PaymentTracsactionStatus]: () => {
    //add logic when payment will be done
  },

  [SSEAndNotificationsEventType.Subscription_Expired]: () => {
    //add logic
  },
};

//display notiff without buttons
export const displayNotificationForAll = async (remoteMessage: NotificationRemoteMessage) => {
  const { key, payload, sendTime } = remoteMessage.data;
  const { title, body } = remoteMessage.notification;

  if (key === SSEAndNotificationsEventType.NewOffer) {
    const notificationTime = Date.parse(sendTime) + getTimezoneOffsetInMilSec();
    const currentTime = Date.now();

    const timeDifferenceMilSec = Math.abs(currentTime - notificationTime);

    if (timeDifferenceMilSec > minToMilSec(1)) {
      logger.log('Skipping old notification:', remoteMessage);
      return;
    }
  }

  if (!isValidNotificationType(key)) {
    logger.error(`Invalid notification type: ${key}`);
    return;
  }

  try {
    let payloadData: NotificationPayload | undefined;

    if (payload && isPayloadRequired(key)) {
      payloadData = JSON.parse(payload);
    }

    notificationHandlers[key](payloadData);

    await notifee.displayNotification({
      title,
      body,
      android: {
        channelId: 'general',
        color: AndroidColor.BLACK,
        smallIcon: 'ic_notification',
        largeIcon: 'ic_launcher',
        pressAction: {
          id: 'default',
        },
      },
      ios: {
        foregroundPresentationOptions: {
          alert: true,
          badge: true,
          sound: true,
        },
      },
    });
  } catch (error) {
    logger.error('Error processing notification:', error);
  }
};
