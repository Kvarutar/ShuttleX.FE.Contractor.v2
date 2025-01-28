import { NetworkErrorDetailsWithBody, Nullable } from 'shuttlex-integration';

export type SubscriptionState = {
  subscriptions: GetSubscriptionsAPIResponse;
  subscriptionStatus: Nullable<SubscriptionStatusResponse>;
  loading: {
    subscriptions: boolean;
    subscriptionStatus: boolean;
  };
  error: {
    subscriptions: Nullable<NetworkErrorDetailsWithBody<any>>;
    subscriptionAvailableStatus: Nullable<NetworkErrorDetailsWithBody<any>>;
    subscriptionDebtStatus: Nullable<NetworkErrorDetailsWithBody<any>>;
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

export type SubscriptionStatusResponse = {
  type: SubscriptionTypeFromAPI;
  endDate: string;
};

export type GetSubscriptionStartEndStatusAPIResponse = {
  startDate: string;
  endDate: string;
  subscriptionType: SubscriptionTypeFromAPI;
  subscriptionTypeId: string;
  isContinues: boolean;
};

export type GetSubscriptionDebtStatusAPIResponse = {
  startDebtTime: string;
  endDebtTime: string;
  paySysSubscriptionId: string;
  daysWorkedUnderDebt: number;
  currency: string;
  debtAmount: number;
};
