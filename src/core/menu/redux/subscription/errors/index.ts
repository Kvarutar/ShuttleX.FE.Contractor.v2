import { isAxiosError } from 'axios';
import { getNetworkErrorInfo, NetworkErrorDetailsWithBody, NetworkErrorsStatuses } from 'shuttlex-integration';

import { SubscriptionLocalErrorBody } from './types';

//TODO: Add code field to all error in Integration
export const isContractorNeverBeforeHaveSubscription = (
  errorResponse: NetworkErrorDetailsWithBody<SubscriptionLocalErrorBody>,
): errorResponse is NetworkErrorDetailsWithBody<SubscriptionLocalErrorBody> => {
  return errorResponse.status === NetworkErrorsStatuses.NoExistings && errorResponse.body?.code === 10006;
};

export const getSubscriptionNetworkErrorInfo = (error: any): NetworkErrorDetailsWithBody<any> => {
  if (isAxiosError(error) && error.response) {
    const code = error.response.status;
    switch (code) {
      case 404:
        return {
          status: NetworkErrorsStatuses.NoExistings,
          code,
          body: {
            code: error.response?.data.Code,
            message: error.response?.data.Message,
          },
        };
    }
  }

  return getNetworkErrorInfo(error);
};
