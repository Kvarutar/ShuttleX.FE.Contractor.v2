import { useSelector } from 'react-redux';
import { isServerError } from 'shuttlex-integration';

import { authErrorSelector } from '../../core/auth/redux/selectors';
import { tariffsInfoErrorSelector } from '../../core/contractor/redux/selectors';
import {
  isCantDeleteAccountWhileInDebtError,
  isInvalidStateForAccountDeletingError,
} from '../../core/menu/redux/accountSettings/errors';
import {
  accountSettingsChangeDataErrorSelector,
  deleteAccountErrorSelector,
} from '../../core/menu/redux/accountSettings/selectors';
import { tripErrorSelector } from '../../core/ride/redux/trip/selectors';

const useServerErrorHandler = () => {
  const errors = [
    useSelector(deleteAccountErrorSelector),
    useSelector(tripErrorSelector),
    useSelector(accountSettingsChangeDataErrorSelector),
    useSelector(authErrorSelector),
    useSelector(tariffsInfoErrorSelector),
  ];

  const serverError = errors.find((error, index) => {
    if (error) {
      // if error from deleteAccountError
      if (index === 0) {
        return (
          !isCantDeleteAccountWhileInDebtError(error) &&
          !isInvalidStateForAccountDeletingError(error) &&
          isServerError(error)
        );
      }
      return isServerError(error);
    }
  });

  //TODO: change return value, when we can get code from error
  return {
    isErrorAvailable: serverError !== undefined,
  };
};

export default useServerErrorHandler;
