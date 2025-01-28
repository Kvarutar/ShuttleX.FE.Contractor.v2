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
import { subscriptionStatusSelector } from '../core/menu/redux/subscription/selectors';
import {
  getAvailableSubscriptionStatus,
  getDebtSubscriptionStatus,
  getSubscriptions,
} from '../core/menu/redux/subscription/thunks';
import { useAppDispatch } from '../core/redux/hooks';
import { signalRThunks, updateSignalRAccessToken } from '../core/redux/signalr';
import { geolocationCoordinatesSelector } from '../core/ride/redux/geolocation/selectors';
import { getCurrentOrder, getFutureOrder } from '../core/ride/redux/trip/thunks';
import { initializeSSEConnection } from '../core/sse';
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
  const subscriptionStatus = useSelector(subscriptionStatusSelector);

  const [isLocationLoaded, setIsLocationLoaded] = useState(false);
  const [isServerErrorModalVisible, setIsServerErrorModalVisible] = useState(false);

  useEffect(() => {
    if (contractorZone) {
      dispatch(getFullTariffsInfo());
    }
  }, [dispatch, contractor, contractorZone]);

  useEffect(() => {
    (async () => {
      const { accessToken } = await getTokens();

      if (accessToken) {
        if (isLoggedIn) {
          getFirebaseDeviceToken();

          //TODO temporary solution
          dispatch(getContractorInfo());
        } else {
          dispatch(setIsLoggedIn(true));
        }
      } else {
        dispatch(setIsLoggedIn(false));
      }
    })();
  }, [dispatch, isLoggedIn]);

  useEffect(() => {
    let subscriptionStatusTimer: NodeJS.Timeout | undefined;

    if (isLoggedIn) {
      dispatch(getSubscriptions());
      dispatch(getAvailableSubscriptionStatus());
      dispatch(getDebtSubscriptionStatus());

      if (subscriptionStatus?.endDate) {
        const timeLeft = new Date(subscriptionStatus.endDate).getTime() - Date.now();

        if (timeLeft > 0) {
          subscriptionStatusTimer = setTimeout(() => {
            dispatch(getAvailableSubscriptionStatus());
            dispatch(getDebtSubscriptionStatus());
          }, timeLeft);
        }
      }
    }

    return () => clearTimeout(subscriptionStatusTimer);
  }, [dispatch, isLoggedIn, subscriptionStatus?.endDate]);

  useEffect(() => {
    (async () => {
      const { accessToken } = await getTokens();
      if (accessToken) {
        console.log('accessToken', accessToken);

        dispatch(updateSignalRAccessToken(accessToken));
        dispatch(signalRThunks.connect());
        initializeSSEConnection(accessToken);
      }
    })();
  }, [dispatch, isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn) {
      (async () => {
        await dispatch(getOrUpdateZone()); // Here we get or update zone via ip and then via geolocation
      })();
    }
  }, [dispatch, isLocationLoaded, isLoggedIn]);

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
  }, [dispatch, contractorZone, isLocationLoaded]);

  useEffect(() => {
    setThemeMode('light');
  }, [setThemeMode]);

  useEffect(() => {
    dispatch(updateProfileLanguage(i18n.language));
  }, [dispatch, contractorZone, i18n.language]);

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
