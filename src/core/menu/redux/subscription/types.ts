import { NetworkErrorDetailsWithBody, Nullable } from 'shuttlex-integration';

export type SubscriptionState = {
  subscriptions: GetSubscriptionsAPIResponse;
  loading: {
    subscriptions: boolean;
  };
  error: {
    subscriptions: Nullable<NetworkErrorDetailsWithBody<any>>;
  };
};

//TODO: add Weekly subscription when we have it
export type SubscriptionTypeFromAPI = 'Daily' | 'Debt' | 'Monthly';

export type CurrencyTypeFromAPI = 'USD' | 'UAH';

export type GetSubscriptionsAPIResponse = {
  id: string;
  zoneId: string;
  subscriptionType: SubscriptionTypeFromAPI;
  currency: CurrencyTypeFromAPI;
  amount: number;
  isActive: boolean;
}[];
