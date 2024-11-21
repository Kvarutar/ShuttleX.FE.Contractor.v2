import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking, StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSelector } from 'react-redux';
import {
  BigHeader,
  BottomWindowWithGesture,
  BottomWindowWithGestureRef,
  Button,
  ButtonShapes,
  SquareButtonModes,
  SwipeButtonModes,
  useTariffsIcons,
} from 'shuttlex-integration';

import {
  contractorStatusSelector,
  contractorSubscriptionStatusSelector,
  primaryTariffSelector,
} from '../../../../core/contractor/redux/selectors';
import { getAchievements, getPreferences } from '../../../../core/contractor/redux/thunks';
import { ContractorStatus } from '../../../../core/contractor/redux/types';
import { useAppDispatch } from '../../../../core/redux/hooks';
import { twoHighestPriorityAlertsSelector } from '../../../../core/ride/redux/alerts/selectors';
import { setIsCanceledTripsPopupVisible } from '../../../../core/ride/redux/trip';
import {
  canceledTripsAmountSelector,
  dropOffRouteIdSelector,
  isCanceledTripsPopupVisibleSelector,
  offerSelector,
  pickUpRouteIdSelector,
} from '../../../../core/ride/redux/trip/selectors';
import {
  acceptOffer,
  declineOffer,
  fetchWayPointsRoute,
  getCanceledTripsAmount,
} from '../../../../core/ride/redux/trip/thunks';
import AlertInitializer from '../../../../shared/AlertInitializer';
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

  const contractorStatus = useSelector(contractorStatusSelector);
  const alerts = useSelector(twoHighestPriorityAlertsSelector);
  const canceledTripsAmount = useSelector(canceledTripsAmountSelector);
  const isCanceledTripsPopupVisible = useSelector(isCanceledTripsPopupVisibleSelector);
  const contractorSubscriptionStatus = useSelector(contractorSubscriptionStatusSelector);

  const [lineState, setLineState] = useState<lineStateTypes>(getRideBuilderRecord(t)[contractorStatus]);
  const [isPreferencesPopupVisible, setIsPreferencesPopupVisible] = useState<boolean>(false);
  const [isOfferPopupVisible, setIsOfferPopupVisible] = useState<boolean>(false);
  const [isAchievementsPopupVisible, setIsAchievementsPopupVisible] = useState<boolean>(false);
  const [isAccountIsNotActivePopupVisible, setIsAccountIsNotActivePopupVisible] = useState<boolean>(false);
  const [isOpened, setIsOpened] = useState<boolean>(false);
  const offer = useSelector(offerSelector);
  const pickUpRouteId = useSelector(pickUpRouteIdSelector);
  const dropOffRouteId = useSelector(dropOffRouteIdSelector);

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
    if (contractorStatus === 'online') {
      setTimeout(() => {
        setIsOfferPopupVisible(true);
      }, 1000);
    }
  }, [contractorStatus]);

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
      await dispatch(getCanceledTripsAmount({ contractiorId: '' }));
    })();
  }, [dispatch]);

  const onOfferPopupClose = () => {
    setIsOfferPopupVisible(false);
  };

  const onOfferDecline = () => {
    onOfferPopupClose();
    if (offer) {
      dispatch(declineOffer({ offerId: offer.offerInfo.id }));
    }
  };

  const onOfferAccept = async () => {
    if (offer?.offerInfo && pickUpRouteId && dropOffRouteId) {
      await dispatch(acceptOffer({ offerId: offer.offerInfo.id }));
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

  const onPressAccountIsNotActivePopupConfirmButton = () => {
    Linking.openURL('https://www.shuttlex.com').catch(err => console.error(err));
    setIsAccountIsNotActivePopupVisible(false);
  };

  //TODO: Add navigation to support page or same thing and resetting cancels
  const onPressContactSupportButton = () => {
    dispatch(setIsCanceledTripsPopupVisible(false));
  };

  const canceledTripsPopupsContent = () => {
    let unclosablePopupMode = null;
    let bottomAdditionalContent = null;

    switch (canceledTripsAmount) {
      case 1:
        unclosablePopupMode = UnclosablePopupModes.Warning;
        bottomAdditionalContent = (
          <Button
            style={styles.unclosablePopupConfirmButton}
            text={t('ride_Ride_UnclosablePopup_confirmButton')}
            onPress={onPressConfirmButton}
          />
        );
        break;
      case 2:
        unclosablePopupMode = UnclosablePopupModes.WarningForTwoCancels;
        bottomAdditionalContent = (
          <Button
            style={styles.unclosablePopupConfirmButton}
            text={t('ride_Ride_UnclosablePopup_confirmButton')}
            onPress={onPressConfirmButton}
          />
        );
        break;
      case 3:
        unclosablePopupMode = UnclosablePopupModes.Banned;
        bottomAdditionalContent = (
          <Button
            style={styles.unclosablePopupContactSupportButton}
            text={t('ride_Ride_UnclosablePopup_contactSupportButton')}
            onPress={onPressContactSupportButton}
          />
        );
        break;
      default:
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

  const primaryTariff = useSelector(primaryTariffSelector);
  const tariffsIconsData = useTariffsIcons();

  //TODO: Add a skeletons
  if (!primaryTariff) {
    return;
  }

  const IconComponent = tariffsIconsData[primaryTariff.name].icon;

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
                <IconComponent style={styles.bigCarImage} />
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
        <BottomWindowWithGesture
          withShade
          opened
          setIsOpened={setIsAccountIsNotActivePopupVisible}
          hiddenPart={
            <View>
              <BigHeader
                windowTitle={t('ride_Ride_Start_accountIsNotActiveSubtitle')}
                firstHeaderTitle={t('ride_Ride_Start_accountIsNotActiveTitle')}
                secondHeaderTitle={t('ride_Ride_Start_accountIsNotActiveSecondTitle')}
                description={t('ride_Ride_Start_accountIsNotActiveDescription')}
              />
              <View style={styles.popupButtonWrapper}>
                <Button
                  shape={ButtonShapes.Square}
                  containerStyle={styles.popupButton}
                  text={t('ride_Ride_Start_accountIsNotActiveFirstButton')}
                  onPress={onPressAccountIsNotActivePopupConfirmButton}
                />
                <Button
                  containerStyle={styles.popupButton}
                  shape={ButtonShapes.Square}
                  mode={SquareButtonModes.Mode2}
                  text={t('ride_Ride_Start_accountIsNotActiveSecondButton')}
                  onPress={() => setIsAccountIsNotActivePopupVisible(false)}
                />
              </View>
            </View>
          }
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
