import { isAxiosError } from 'axios';
import { getNetworkErrorInfo, NetworkErrorDetailsWithBody, NetworkErrorsStatuses } from 'shuttlex-integration';

//TODO: Add code field to all error in Integration
export const isUnVerifyPhoneError = (
  errorResponse: NetworkErrorDetailsWithBody,
): errorResponse is NetworkErrorDetailsWithBody => {
  return errorResponse.status === NetworkErrorsStatuses.IncorrectFields && errorResponse.body?.code === 20008;
};

export const isContractorBannedError = (
  errorResponse: NetworkErrorDetailsWithBody,
): errorResponse is NetworkErrorDetailsWithBody => {
  return errorResponse.status === NetworkErrorsStatuses.IncorrectFields && errorResponse.body?.code === 20000;
};

export const getContractorNetworkErrorInfo = (error: any): NetworkErrorDetailsWithBody<any> => {
  if (isAxiosError(error) && error.response) {
    const code = error.response.status;
    switch (code) {
      case 400:
        return {
          status: NetworkErrorsStatuses.IncorrectFields,
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
