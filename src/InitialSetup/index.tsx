import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getTokens, useTheme } from 'shuttlex-integration';

import { setIsLoggedIn } from '../core/auth/redux';
import { isLoggedInSelector } from '../core/auth/redux/selectors';
import { contractorInfoSelector, contractorZoneSelector } from '../core/contractor/redux/selectors';
import {
  getContractorInfo,
  getFullTariffsInfo,
  getOrUpdateZone,
  updateProfileLanguage,
} from '../core/contractor/redux/thunks';
import { useAppDispatch } from '../core/redux/hooks';
import { signalRThunks, updateSignalRAccessToken } from '../core/redux/signalr';
import { geolocationCoordinatesSelector } from '../core/ride/redux/geolocation/selectors';
import { getFirebaseDeviceToken, setupNotifications } from '../core/utils/notifications/notificationSetup';
import { InitialSetupProps } from './types';

const InitialSetup = ({ children }: InitialSetupProps) => {
  const dispatch = useAppDispatch();
  const { setThemeMode } = useTheme();
  const { i18n } = useTranslation();

  const isLoggedIn = useSelector(isLoggedInSelector);
  const defaultLocation = useSelector(geolocationCoordinatesSelector);
  const contractorZone = useSelector(contractorZoneSelector);
  const contractor = useSelector(contractorInfoSelector);

  useEffect(() => {
    dispatch(getFullTariffsInfo());
  }, [contractor, dispatch]);

  useEffect(() => {
    (async () => {
      const { accessToken } = await getTokens();

      if (accessToken) {
        getFirebaseDeviceToken();
        //TODO temporary solution
        await dispatch(getContractorInfo());
        dispatch(setIsLoggedIn(true));
      } else {
        dispatch(setIsLoggedIn(false));
      }
    })();
  }, [dispatch, isLoggedIn]);

  useEffect(() => {
    (async () => {
      const { accessToken } = await getTokens();
      if (accessToken) {
        console.log('accessToken', accessToken);

        dispatch(updateSignalRAccessToken(accessToken));
        dispatch(signalRThunks.connect());
      }
    })();
  }, [dispatch, isLoggedIn]);

  useEffect(() => {
    (async () => {
      const { accessToken } = await getTokens();
      if (accessToken) {
        await dispatch(getOrUpdateZone());
        dispatch(getFullTariffsInfo());
      }
    })();
  }, [defaultLocation, dispatch]);

  useEffect(() => {
    setThemeMode('light');
  }, [setThemeMode]);

  useEffect(() => {
    dispatch(updateProfileLanguage(i18n.language));
  }, [contractorZone, i18n.language, dispatch]);

  useEffect(() => {
    setupNotifications();
  }, [dispatch]);

  return children;
};
export default InitialSetup;
