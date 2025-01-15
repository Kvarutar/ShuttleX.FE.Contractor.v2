export interface NotificationRemoteMessage {
  data: {
    title: string;
    body: string;
    key: string;
    sendTime: string;
    payload: string;
  };
}

export enum SSEAndNotificationsEventType {
  NewOffer = 'offer_received',
  PassengerRejected = 'passenger_rejected',
  DocsApproved = 'docs_approved',
}

export type NotificationPayload = {
  offerId?: string;
  orderId?: string;
};

export type NotificationWithPayload = SSEAndNotificationsEventType.NewOffer;
