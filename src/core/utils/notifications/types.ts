export interface NotificationRemoteMessage {
  notification: {
    title: string;
    body: string;
  };
  data: {
    key: string;
    sendTime: string;
    payload: string;
  };
}

export enum SSEAndNotificationsEventType {
  NewOffer = 'offer_received',
  PassengerRejected = 'passenger_rejected',
  DocsApproved = 'docs_approved',
  Custom = 'user_custom_notification',
  PaymentTracsactionStatus = 'contractor_payment_transaction_status',
  Subscription_Expired = 'contractor_subscription_expired',
}

export type NotificationPayload = {
  offerId?: string;
  orderId?: string;
  paymentTransactionId?: string;
  status?: string;
  errorMessage?: string;
};

export type NotificationWithPayload = SSEAndNotificationsEventType.NewOffer;
