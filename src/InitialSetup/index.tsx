import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getTokens, useTheme } from 'shuttlex-integration';

import { setIsLoggedIn } from '../core/auth/redux';
import { isLoggedInSelector } from '../core/auth/redux/selectors';
import { getContractorInfo } from '../core/contractor/redux/thunks';
import { useAppDispatch } from '../core/redux/hooks';
import { signalRThunks, updateSignalRAccessToken } from '../core/redux/signalr';
import { getFirebaseDeviceToken, setupNotifications } from '../core/utils/notifications/notificationSetup';
import { InitialSetupProps } from './types';

const InitialSetup = ({ children }: InitialSetupProps) => {
  const dispatch = useAppDispatch();
  const { setThemeMode } = useTheme();

  const isLoggedin = useSelector(isLoggedInSelector);

  useEffect(() => {
    (async () => {
      const { accessToken } = await getTokens();

      if (accessToken) {
        dispatch(setIsLoggedIn(true));
        getFirebaseDeviceToken();
        dispatch(getContractorInfo());
      } else {
        dispatch(setIsLoggedIn(false));
      }
    })();
  }, [dispatch, isLoggedin]);

  useEffect(() => {
    setThemeMode('light');
  }, [setThemeMode]);

  useEffect(() => {
    setupNotifications();

    (async () => {
      // TODO: use actual access token
      dispatch(updateSignalRAccessToken('access token'));
      await dispatch(signalRThunks.connect());
    })();
  }, [dispatch]);

  return children;
};
export default InitialSetup;
