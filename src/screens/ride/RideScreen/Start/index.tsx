import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert as AlertNative, StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSelector } from 'react-redux';
import {
  BottomWindowWithGesture,
  BottomWindowWithGestureRef,
  Button,
  isIncorrectFieldsError,
  SquareButtonModes,
  SwipeButtonModes,
  UnsupportedCityPopup,
  useTariffsIcons,
} from 'shuttlex-integration';

import {
  contractorGeneralErrorSelector,
  contractorStatusSelector,
  contractorSubscriptionStatusSelector,
  contractorZoneSelector,
  isTariffsInfoLoadingSelector,
  primaryTariffSelector,
  tariffsInfoErrorSelector,
} from '../../../../core/contractor/redux/selectors';
import { getAchievements, getPreferences } from '../../../../core/contractor/redux/thunks';
import { ContractorStatus } from '../../../../core/contractor/redux/types';
import { useAppDispatch } from '../../../../core/redux/hooks';
import { twoHighestPriorityAlertsSelector } from '../../../../core/ride/redux/alerts/selectors';
import { setIsCanceledTripsPopupVisible, setTripOffer } from '../../../../core/ride/redux/trip';
import { isConflictError, isGoneError } from '../../../../core/ride/redux/trip/errors';
import {
  dropOffRouteIdSelector,
  isCanceledTripsPopupVisibleSelector,
  offerSelector,
  pickUpRouteIdSelector,
  tripErrorSelector,
} from '../../../../core/ride/redux/trip/selectors';
import { acceptOffer, declineOffer, fetchWayPointsRoute } from '../../../../core/ride/redux/trip/thunks';
import AlertInitializer from '../../../../shared/AlertInitializer';
import AccountIsNotActivePopup from '../popups/AccountIsNotActivePopup';
import AchievementsPopup from '../popups/AchievementsPopup';
import OfferPopup from '../popups/OfferPopup';
import TariffPreferencesPopup from '../popups/PreferencesPopup';
import UnclosablePopupWithModes from '../popups/UnclosablePopupWithModes';
import { UnclosablePopupModes } from '../popups/UnclosablePopupWithModes/props';
import VisiblePart from './VisiblePart';

type lineStateTypes = {
  popupTitle: string;
  toLineState: ContractorStatus;
  bottomTitle: string;
  buttonText: string;
  buttonMode: SquareButtonModes;
  swipeMode: SwipeButtonModes;
};

const animationDuration = 200;

const getRideBuilderRecord = (t: ReturnType<typeof useTranslation>['t']): Record<ContractorStatus, lineStateTypes> => ({
  online: {
    popupTitle: t('ride_Ride_Popup_onlineTitle'),
    toLineState: 'offline',
    bottomTitle: t('ride_Ride_BottomWindow_onlineTitle'),
    buttonText: t('ride_Ride_Bar_onlineTitle'),
    buttonMode: SquareButtonModes.Mode2,
    swipeMode: SwipeButtonModes.Decline,
  },
  offline: {
    popupTitle: t('ride_Ride_Popup_offlineTitle'),
    toLineState: 'online',
    bottomTitle: t('ride_Ride_BottomWindow_offlineTitle'),
    buttonText: t('ride_Ride_Bar_offlineTitle'),
    buttonMode: SquareButtonModes.Mode1,
    swipeMode: SwipeButtonModes.Confirm,
  },
});

const Start = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const bottomWindowRef = useRef<BottomWindowWithGestureRef>(null);
  const preferencesBottomWindowRef = useRef<BottomWindowWithGestureRef>(null);
  const achievementsBottomWindowRef = useRef<BottomWindowWithGestureRef>(null);

  const isTariffsInfoLoading = useSelector(isTariffsInfoLoadingSelector);
  const tariffsInfoError = useSelector(tariffsInfoErrorSelector);

  const contractorStatus = useSelector(contractorStatusSelector);
  const alerts = useSelector(twoHighestPriorityAlertsSelector);
  const isCanceledTripsPopupVisible = useSelector(isCanceledTripsPopupVisibleSelector);
  const contractorSubscriptionStatus = useSelector(contractorSubscriptionStatusSelector);
  const generalError = useSelector(contractorGeneralErrorSelector);

  const [lineState, setLineState] = useState<lineStateTypes>(getRideBuilderRecord(t)[contractorStatus]);
  const [isPreferencesPopupVisible, setIsPreferencesPopupVisible] = useState<boolean>(false);
  const [isOfferPopupVisible, setIsOfferPopupVisible] = useState<boolean>(false);
  const [isAchievementsPopupVisible, setIsAchievementsPopupVisible] = useState<boolean>(false);
  const [isAccountIsNotActivePopupVisible, setIsAccountIsNotActivePopupVisible] = useState<boolean>(false);
  const [isUnsupportedCityPopupVisible, setIsUnsupportedCityPopupVisible] = useState<boolean>(false);
  const [isOpened, setIsOpened] = useState<boolean>(false);
  const offer = useSelector(offerSelector);
  const pickUpRouteId = useSelector(pickUpRouteIdSelector);
  const dropOffRouteId = useSelector(dropOffRouteIdSelector);
  const contractorZone = useSelector(contractorZoneSelector);

  const tripError = useSelector(tripErrorSelector);

  const primaryTariff = useSelector(primaryTariffSelector);
  const tariffsIconsData = useTariffsIcons();

  const iconComponent = useMemo(() => {
    if (!isTariffsInfoLoading && !tariffsInfoError && primaryTariff) {
      return tariffsIconsData[primaryTariff.name].icon ?? null;
    }
    return null;
  }, [isTariffsInfoLoading, tariffsInfoError, primaryTariff, tariffsIconsData]);

  useEffect(() => {
    setLineState(getRideBuilderRecord(t)[contractorStatus]);
  }, [contractorStatus, t]);

  useEffect(() => {
    if (isOpened && contractorStatus === 'offline' && !contractorSubscriptionStatus) {
      setIsAccountIsNotActivePopupVisible(true);
    } else if (!isOpened) {
      setIsAccountIsNotActivePopupVisible(false);
    }
  }, [contractorStatus, contractorSubscriptionStatus, isOpened]);

  useEffect(() => {
    if (isOpened && contractorStatus === 'offline' && !contractorZone) {
      setIsUnsupportedCityPopupVisible(true);
    } else if (!isOpened) {
      setIsUnsupportedCityPopupVisible(false);
    }
  }, [contractorStatus, contractorZone, isOpened]);

  useEffect(() => {
    if (offer) {
      setIsOfferPopupVisible(true);
    }
  }, [offer]);

  useEffect(() => {
    //TODO: Rewrite with the correct typeGuard function
    if (tripError && (isConflictError(tripError) || isGoneError(tripError) || isIncorrectFieldsError(tripError))) {
      dispatch(setTripOffer(null));
      setIsOfferPopupVisible(false);
      AlertNative.alert(
        t('ride_Ride_Start_offerWasCanceledOrAcceptedAlertTitle'),
        t('ride_Ride_Start_offerWasCanceledOrAcceptedAlertDescription'),
        [{ text: t('ride_Ride_Start_offerWasCanceledOrAcceptedAlertButtonText') }],
      );
    }
  }, [dispatch, tripError, t]);

  useEffect(() => {
    if (pickUpRouteId && dropOffRouteId) {
      dispatch(fetchWayPointsRoute({ pickUpRouteId, dropOffRouteId }));
    }
  }, [dispatch, pickUpRouteId, dropOffRouteId]);

  useEffect(() => {
    (async () => {
      //TODO: Change contractorId when we know how it seems
      await dispatch(getAchievements({ contractorId: '' }));
      await dispatch(getPreferences({ contractorId: '' }));
    })();
  }, [dispatch]);

  useEffect(() => {
    if (generalError && isIncorrectFieldsError(generalError)) {
      dispatch(setIsCanceledTripsPopupVisible(true));
    }
  }, [generalError, dispatch]);

  const onOfferPopupClose = () => {
    setIsOfferPopupVisible(false);
  };

  const onOfferDecline = () => {
    onOfferPopupClose();
    if (offer) {
      dispatch(declineOffer({ offerId: offer.id }));
    }
  };

  const onOfferAccept = async () => {
    if (offer && pickUpRouteId && dropOffRouteId) {
      await dispatch(acceptOffer({ offerId: offer.id }));
      setIsOfferPopupVisible(false);
    }
  };

  const onCloseAllBottomWindows = () => {
    bottomWindowRef.current?.closeWindow();
    preferencesBottomWindowRef.current?.closeWindow();
    achievementsBottomWindowRef.current?.closeWindow();
  };

  const onPressConfirmButton = () => {
    dispatch(setIsCanceledTripsPopupVisible(false));
  };

  //TODO: Add navigation to support page or same thing and resetting cancels
  const onPressContactSupportButton = () => {
    dispatch(setIsCanceledTripsPopupVisible(false));
  };

  const canceledTripsPopupsContent = () => {
    let unclosablePopupMode = null;
    let bottomAdditionalContent = null;

    //TODO: Rewrite with the correct typeGuard function
    if ((generalError && !isIncorrectFieldsError(generalError)) || !generalError) {
      unclosablePopupMode = UnclosablePopupModes.Warning;
      bottomAdditionalContent = (
        <Button
          style={styles.unclosablePopupConfirmButton}
          text={t('ride_Ride_UnclosablePopup_confirmButton')}
          onPress={onPressConfirmButton}
        />
      );
    } else {
      unclosablePopupMode = UnclosablePopupModes.Banned;
      bottomAdditionalContent = (
        <Button
          style={styles.unclosablePopupContactSupportButton}
          text={t('ride_Ride_UnclosablePopup_contactSupportButton')}
          onPress={onPressContactSupportButton}
        />
      );
    }

    return <UnclosablePopupWithModes mode={unclosablePopupMode} bottomAdditionalContent={bottomAdditionalContent} />;
  };

  const computedStyles = StyleSheet.create({
    headerWrapperStyle: {
      height: isOpened ? 30 : 'auto',
      justifyContent: 'flex-end',
      marginHorizontal: 16,
    },
  });

  return (
    <>
      <BottomWindowWithGesture
        maxHeight={0.7}
        withHiddenPartScroll={false}
        bottomWindowStyle={styles.bottomWindowStyle}
        setIsOpened={setIsOpened}
        ref={bottomWindowRef}
        headerWrapperStyle={computedStyles.headerWrapperStyle}
        headerElement={
          isOpened && (
            <Animated.View entering={FadeIn.duration(300)}>
              <View style={styles.bigCarImageContainer}>
                {iconComponent && iconComponent({ style: styles.bigCarImage })}
              </View>
            </Animated.View>
          )
        }
        alerts={alerts.map(alertData => (
          <AlertInitializer
            key={alertData.id}
            id={alertData.id}
            priority={alertData.priority}
            type={alertData.type}
            options={'options' in alertData ? alertData.options : undefined}
          />
        ))}
        visiblePart={
          <Animated.View layout={FadeIn.duration(animationDuration)}>
            <VisiblePart
              isOpened={isOpened}
              bottomWindowRef={bottomWindowRef}
              setIsPreferencesPopupVisible={setIsPreferencesPopupVisible}
              setIsAchievementsPopupVisible={setIsAchievementsPopupVisible}
              lineState={lineState}
            />
          </Animated.View>
        }
      />
      {isPreferencesPopupVisible && (
        <TariffPreferencesPopup
          onClose={() => setIsPreferencesPopupVisible(false)}
          setIsPreferencesPopupVisible={setIsPreferencesPopupVisible}
          preferencesBottomWindowRef={preferencesBottomWindowRef}
        />
      )}
      {offer && isOfferPopupVisible && (
        <OfferPopup
          offer={offer}
          onOfferAccept={onOfferAccept}
          onOfferDecline={onOfferDecline}
          onClose={onOfferPopupClose}
          onCloseAllBottomWindows={onCloseAllBottomWindows}
        />
      )}
      {isAchievementsPopupVisible && (
        <AchievementsPopup
          setIsAchievementsPopupVisible={setIsAchievementsPopupVisible}
          achievementsBottomWindowRef={achievementsBottomWindowRef}
        />
      )}
      {isCanceledTripsPopupVisible && canceledTripsPopupsContent()}
      {isAccountIsNotActivePopupVisible && (
        <AccountIsNotActivePopup setIsAccountIsNotActivePopupVisible={setIsAccountIsNotActivePopupVisible} />
      )}
      {isUnsupportedCityPopupVisible && (
        <UnsupportedCityPopup
          //TODO: swap console.log('Support') to navigation on Support
          onSupportPressHandler={() => console.log('Support')}
          setIsUnsupportedCityPopupVisible={setIsUnsupportedCityPopupVisible}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  bottomWindowStyle: {
    paddingHorizontal: 0,
  },
  unclosablePopupConfirmButton: {
    marginTop: 190,
  },
  unclosablePopupContactSupportButton: {
    marginTop: 172,
  },
  bigCarImageContainer: {
    position: 'absolute',
    top: -108,
    width: '75%',
    alignSelf: 'center',
  },
  bigCarImage: {
    width: '100%',
    aspectRatio: 2.5,
    height: undefined,
    resizeMode: 'contain',
  },
  popupButton: {
    flex: 1,
  },
  popupButtonWrapper: {
    marginTop: 76,
    gap: 8,
    flexDirection: 'row',
  },
});

export default Start;
