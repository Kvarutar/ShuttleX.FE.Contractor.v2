export interface NotificationRemoteMessage {
  data: {
    title: string;
    body: string;
    key: string;
    payload: string;
  };
}

export enum NotificationType {
  NewOffer = 'offer_received',
  PassengerRejected = 'passenger_rejected',
  DocsApproved = 'docs_approved',
}

export type NotificationPayload = {
  offerId?: string;
};

export type NotificationWithPayload = NotificationType.NewOffer;
