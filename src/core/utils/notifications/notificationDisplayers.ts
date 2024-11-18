import notifee from '@notifee/react-native';

import { store } from '../../redux/store';
import { fetchOfferInfo } from '../../ride/redux/trip/thunks';
import { NotificationRemoteMessage } from './types';

type NotificationTitle = 'new_offer' | 'passenger_rejected';

//TODO change logic of render keys
const isNotificationTitle = (key: string): key is NotificationTitle =>
  ['new_offer', 'passenger_rejected'].includes(key);

//display notiff without buttons
export const displayNotificationForAll = async (remoteMessage: NotificationRemoteMessage) => {
  const { key, payload } = remoteMessage.data;
  const payloadData = payload && JSON.parse(payload);

  if (isNotificationTitle(key)) {
    if (key === 'new_offer') {
      const offerId = payloadData.OfferInfo;
      store.dispatch(fetchOfferInfo(offerId));
    }
  }

  await notifee.displayNotification({
    title: remoteMessage.data.title,
    body: remoteMessage.data.body,

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
};
