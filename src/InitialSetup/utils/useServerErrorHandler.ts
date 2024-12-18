import { useSelector } from 'react-redux';
import { isServerError } from 'shuttlex-integration';

import { authErrorSelector } from '../../core/auth/redux/selectors';
import { tariffsInfoErrorSelector } from '../../core/contractor/redux/selectors';
import { accountSettingsChangeDataErrorSelector } from '../../core/menu/redux/accountSettings/selectors';
import { tripErrorSelector } from '../../core/ride/redux/trip/selectors';

const useServerErrorHandler = () => {
  const errors = [
    useSelector(tripErrorSelector),
    useSelector(accountSettingsChangeDataErrorSelector),
    useSelector(authErrorSelector),
    useSelector(tariffsInfoErrorSelector),
  ];

  const serverError = errors.find(error => error && isServerError(error));

  //TODO: change return value, when we can get code from error
  return {
    isErrorAvailable: serverError !== undefined,
  };
};

export default useServerErrorHandler;
