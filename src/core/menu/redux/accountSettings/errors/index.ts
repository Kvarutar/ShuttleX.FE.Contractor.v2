import { isAxiosError } from 'axios';
import { getNetworkErrorInfo, NetworkErrorDetailsWithBody, NetworkErrorsStatuses } from 'shuttlex-integration';

//TODO: Add code field to all error in Integration
export const isInvalidStateForAccountDeletingError = (
  errorResponse: NetworkErrorDetailsWithBody,
): errorResponse is NetworkErrorDetailsWithBody => {
  return errorResponse.status === NetworkErrorsStatuses.ServerError && errorResponse.body?.code === 10014;
};

export const isCantDeleteAccountWhileInDebtError = (
  errorResponse: NetworkErrorDetailsWithBody,
): errorResponse is NetworkErrorDetailsWithBody => {
  return errorResponse.status === NetworkErrorsStatuses.ServerError && errorResponse.body?.code === 10015;
};

export const deleteAccountRequestNetworkErrorInfo = (error: any): NetworkErrorDetailsWithBody<any> => {
  if (isAxiosError(error) && error.response) {
    const code = error.response.status;
    switch (code) {
      case 500:
        return {
          status: NetworkErrorsStatuses.ServerError,
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
