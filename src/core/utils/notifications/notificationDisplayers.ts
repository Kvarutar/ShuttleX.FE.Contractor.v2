import notifee, { AndroidColor } from '@notifee/react-native';

import { getContractorInfo } from '../../contractor/redux/thunks';
import { store } from '../../redux/store';
import { endTrip, resetCurrentRoutes, resetFutureRoutes, setSecondOrder, setTripStatus } from '../../ride/redux/trip';
import { orderSelector, tripStatusSelector } from '../../ride/redux/trip/selectors';
import { fetchOfferInfo } from '../../ride/redux/trip/thunks';
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
    if (payload?.offerId) {
      store.dispatch(fetchOfferInfo(payload.offerId));
    }
  },
  [NotificationType.PassengerRejected]: payload => {
    const order = orderSelector(store.getState());
    if (payload?.orderId === order?.id) {
      const tripStatus = tripStatusSelector(store.getState());
      if (tripStatus === TripStatus.Ride || tripStatus === TripStatus.Ending) {
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
  const { key, payload, title, body } = remoteMessage.data;

  if (!isValidNotificationType(key)) {
    console.error(`Invalid notification type: ${key}`);
    return;
  }

  try {
    let payloadData: NotificationPayload | undefined;

    if (payload && isPayloadRequired(key)) {
      payloadData = JSON.parse(payload);
    }

    await notificationHandlers[key](payloadData);

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
    console.error('Error processing notification:', error);
  }
};
