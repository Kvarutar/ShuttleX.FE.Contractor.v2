import { getNetworkErrorInfo } from 'shuttlex-integration';

import { createAppAsyncThunk } from '../../../redux/hooks';
import { getSubscriptionNetworkErrorInfo } from './errors';
import {
  GetSubscriptionDebtStatusAPIResponse,
  GetSubscriptionsAPIResponse,
  GetSubscriptionStartEndStatusAPIResponse,
  SubscriptionStatusResponse,
} from './types';

export const getDebtSubscriptionStatus = createAppAsyncThunk<SubscriptionStatusResponse, void>(
  'subscription/getDebtSubscriptionStatus',
  async (_, { rejectWithValue, cashieringAxios }) => {
    try {
      //TODO: delete mockParams and add correct paySysType
      const paySysType = 'Stripe';

      const result = await cashieringAxios.get<GetSubscriptionDebtStatusAPIResponse>(`/debt/contractor/${paySysType}`);

      return (
        result.data && {
          type: 'Debt',
          endDate: result.data.endDebtTime,
        }
      );
    } catch (error) {
      return rejectWithValue(getSubscriptionNetworkErrorInfo(error));
    }
  },
);

export const getAvailableSubscriptionStatus = createAppAsyncThunk<SubscriptionStatusResponse, void>(
  'subscription/getAvailableSubscriptionStatus',
  async (_, { rejectWithValue, cashieringAxios }) => {
    try {
      //TODO: delete mockParams and add correct paySysType
      const paySysType = 'Stripe';

      const result = await cashieringAxios.get<GetSubscriptionStartEndStatusAPIResponse>(
        `/subscription/${paySysType}/sub-start-end`,
      );

      return {
        type: result.data.subscriptionType,
        endDate: result.data.endDate,
      };
    } catch (error) {
      return rejectWithValue(getSubscriptionNetworkErrorInfo(error));
    }
  },
);

export const getSubscriptions = createAppAsyncThunk<GetSubscriptionsAPIResponse, void>(
  'subscription/getSubscriptions',
  async (_, { rejectWithValue, configAxios }) => {
    try {
      const result = await configAxios.get<GetSubscriptionsAPIResponse>('/pay-sys-subscription-types', {
        params: {
          sortBy: 'amount:asc',
          //TODO: delete filter when we will have Weekly subscription
          filterBy: 'SubscriptionType::neq::Weekly',
        },
      });

      return result.data;
    } catch (error) {
      return rejectWithValue(getNetworkErrorInfo(error));
    }
  },
);
