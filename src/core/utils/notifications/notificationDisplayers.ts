import notifee, { AndroidColor } from '@notifee/react-native';
import { getTimezoneOffsetInMilSec, minToMilSec } from 'shuttlex-integration';

import { logger } from '../../../App';
import { getContractorInfo } from '../../contractor/redux/thunks';
import { store } from '../../redux/store';
import { endTrip, resetCurrentRoutes, resetFutureRoutes, setSecondOrder, setTripStatus } from '../../ride/redux/trip';
import { orderSelector, tripStatusSelector } from '../../ride/redux/trip/selectors';
import {
  fetchOfferInfo,
  getCancelTripLongPolling,
  getFinalCost,
  getNewOfferLongPolling,
} from '../../ride/redux/trip/thunks';
import { TripStatus } from '../../ride/redux/trip/types';
import { NotificationPayload, NotificationRemoteMessage, NotificationType, NotificationWithPayload } from './types';

const isValidNotificationType = (key: string): key is NotificationType => {
  return Object.values(NotificationType).includes(key as NotificationType);
};

const isPayloadRequired = (type: NotificationType): type is NotificationWithPayload => {
  return [NotificationType.NewOffer].includes(type);
};

const notificationHandlers: Record<NotificationType, (payload?: NotificationPayload) => void> = {
  [NotificationType.NewOffer]: payload => {
    getNewOfferLongPolling.abortAll();

    if (payload?.offerId) {
      store.dispatch(fetchOfferInfo(payload.offerId));
    }
  },
  [NotificationType.PassengerRejected]: async payload => {
    getCancelTripLongPolling.abortAll();

    const order = orderSelector(store.getState());
    if (payload && payload.orderId && payload?.orderId === order?.id) {
      const tripStatus = tripStatusSelector(store.getState());
      if (tripStatus === TripStatus.Ride || tripStatus === TripStatus.Ending) {
        await store.dispatch(getFinalCost({ orderId: payload.orderId }));

        store.dispatch(setTripStatus(TripStatus.Rating));
      }
      //Because this status might be chanched in lonpolling also
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
  [NotificationType.DocsApproved]: () => {
    store.dispatch(getContractorInfo());
  },
};

//display notiff without buttons
export const displayNotificationForAll = async (remoteMessage: NotificationRemoteMessage) => {
  const { key, payload, title, body, sendTime } = remoteMessage.data;

  if (key === NotificationType.NewOffer) {
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
        channelId: 'general-channel',
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
