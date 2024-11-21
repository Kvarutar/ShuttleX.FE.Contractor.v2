import { isAxiosError } from 'axios';
import { getNetworkErrorInfo, NetworkErrorDetailsWithBody } from 'shuttlex-integration';

import { OfferNetworkErrors } from './types';

export const isConflictError = (
  errorResponse: NetworkErrorDetailsWithBody<string>,
): errorResponse is NetworkErrorDetailsWithBody<string> => {
  return errorResponse.status === OfferNetworkErrors.Conflicts;
};

export const isGoneError = (
  errorResponse: NetworkErrorDetailsWithBody<string>,
): errorResponse is NetworkErrorDetailsWithBody<string> => {
  return errorResponse.status === OfferNetworkErrors.Gone;
};

export const getOfferNetworkErrorInfo = (error: any): NetworkErrorDetailsWithBody<any> => {
  if (isAxiosError(error) && error.response) {
    const code = error.response.status;
    switch (code) {
      case 409:
        return {
          status: OfferNetworkErrors.Conflicts,
          code,
          body: error.response?.data.Message as string,
        };
      case 410:
        return {
          status: OfferNetworkErrors.Gone,
          code,
          body: error.response?.data.Message as string,
        };
    }
  }

  return getNetworkErrorInfo(error);
};
