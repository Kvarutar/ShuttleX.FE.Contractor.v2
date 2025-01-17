import { getNetworkErrorInfo } from 'shuttlex-integration';

import { createAppAsyncThunk } from '../../../redux/hooks';
import { GetSubscriptionsAPIResponse } from './types';

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
