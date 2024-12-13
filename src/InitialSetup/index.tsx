import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getTokens, ServerErrorModal, useTheme } from 'shuttlex-integration';

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
import { getCurrentOrder, getFutureOrder } from '../core/ride/redux/trip/thunks';
import { getFirebaseDeviceToken, setupNotifications } from '../core/utils/notifications/notificationSetup';
import { InitialSetupProps } from './types';
import useServerErrorHandler from './utils/useServerErrorHandler';

const InitialSetup = ({ children }: InitialSetupProps) => {
  const dispatch = useAppDispatch();
  const { setThemeMode } = useTheme();
  const { i18n } = useTranslation();
  const { isErrorAvailable } = useServerErrorHandler();

  const isLoggedIn = useSelector(isLoggedInSelector);
  const defaultLocation = useSelector(geolocationCoordinatesSelector);
  const contractorZone = useSelector(contractorZoneSelector);
  const contractor = useSelector(contractorInfoSelector);

  const [isLocationLoaded, setIsLocationLoaded] = useState(false);
  const [isServerErrorModalVisible, setIsServerErrorModalVisible] = useState(false);

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

        dispatch(getOrUpdateZone()); // Here we get or update zone via ip
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
    if (isLocationLoaded) {
      (async () => {
        await dispatch(getOrUpdateZone()); // Here we get or update zone via geolocation
      })();
    }
  }, [isLocationLoaded, dispatch]);

  useEffect(() => {
    if (defaultLocation && !isLocationLoaded) {
      setIsLocationLoaded(true);
    }
  }, [defaultLocation, isLocationLoaded]);

  useEffect(() => {
    if (contractorZone && isLocationLoaded) {
      (async () => {
        await dispatch(getFullTariffsInfo());
        await dispatch(getCurrentOrder());
        dispatch(getFutureOrder());
      })();
    }
  }, [contractorZone, dispatch, isLocationLoaded]);

  useEffect(() => {
    setThemeMode('light');
  }, [setThemeMode]);

  useEffect(() => {
    dispatch(updateProfileLanguage(i18n.language));
  }, [contractorZone, i18n.language, dispatch]);

  useEffect(() => {
    setupNotifications();
  }, [dispatch]);

  useEffect(() => {
    setIsServerErrorModalVisible(isErrorAvailable);
  }, [isErrorAvailable]);

  return (
    <>
      {children}
      {isServerErrorModalVisible && <ServerErrorModal setIsVisible={setIsServerErrorModalVisible} />}
    </>
  );
};
export default InitialSetup;
