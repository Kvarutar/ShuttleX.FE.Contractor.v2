import notifee from '@notifee/react-native';

import { store } from '../../redux/store';
import { fetchOfferInfo } from '../../ride/redux/trip/thunks';
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
  [NotificationType.PassengerRejected]: () => {
    // TODO add case
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
        smallIcon: 'bootsplash_logo',
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
