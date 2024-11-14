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
  minToMilSec,
  SquareButtonModes,
  SwipeButtonModes,
  useTariffsIcons,
} from 'shuttlex-integration';

import {
  contractorStatusSelector,
  contractorSubscriptionStatusSelector,
  primaryTariffSelector,
  tariffsSelector,
} from '../../../../core/contractor/redux/selectors';
import { getAchievements, getCarData, getPreferences, getTariffs } from '../../../../core/contractor/redux/thunks';
import { ContractorStatus, TariffInfo } from '../../../../core/contractor/redux/types';
import { useAppDispatch } from '../../../../core/redux/hooks';
import { twoHighestPriorityAlertsSelector } from '../../../../core/ride/redux/alerts/selectors';
import { setIsCanceledTripsPopupVisible, setOrder } from '../../../../core/ride/redux/trip';
import {
  canceledTripsAmountSelector,
  isCanceledTripsPopupVisibleSelector,
} from '../../../../core/ride/redux/trip/selectors';
import { getCanceledTripsAmount, responseToOffer } from '../../../../core/ride/redux/trip/thunks';
import { OfferType, OrderType } from '../../../../core/ride/redux/trip/types';
import { getContractorStatistics } from '../../../../core/statistics/redux/thunks';
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

// Just example! This data might be changed on backend later
//TODO: Rewrite this logic to receiving data from backend
//TODO: Add latitude and longtude keys (maybe it will be separate request to backend)
const orderFromBack: OrderType = {
  id: '4503c782-35f4-470b-8f8b-fb0796d5af40',
  startPosition: {
    address: '123 Queen St W, Toronto, ON M5H 2M9',
    latitude: 12312312,
    longitude: 123123123,
  },
  targetPointsPosition: [
    {
      address: '12 Bushbury Dr, North York, ON M3A 2Z7',
      latitude: 12312312,
      longitude: 123123123,
    },
  ],
  fullTimeTimestamp: Date.now() + minToMilSec(25), // 25 min
  fullTimeMinutes: 25, // min
  timeToOffer: Date.now() + minToMilSec(2), // 2 min
  fullDistance: 20.4,
  price: '100',
  pricePerKm: 0.3,
  waitingTimeInMin: 0.1,
  pricePerMin: 3.5,
  passengerId: '0',
  passenger: {
    name: 'Arnold',
    lastName: 'Scharzenegger',
    phone: '0432342342',
    avatarURL: '',
  },
  tripTariff: 'BasicX',
};

// Just example! This data might be changed on backend later
//TODO: Rewrite this logic to receiving data from backend
//TODO: Add latitude and longtude keys (maybe it will be separate request to backend)
const offerFromBack: OfferType = {
  startPosition: {
    address: '123 Queen St W, Toronto, ON M5H 2M9',
    latitude: 12312312,
    longitude: 123123123,
  },
  targetPointsPosition: [
    {
      address: '12 Bushbury Dr, North York, ON M3A 2Z7',
      latitude: 12312312,
      longitude: 123123123,
    },
  ],
  fullTimeMinutes: Date.now() + minToMilSec(25), // 25 min
  price: '100',
  pricePerKm: 0.3,
};

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

  const [offer, setOffer] = useState<OfferType>();
  const [lineState, setLineState] = useState<lineStateTypes>(getRideBuilderRecord(t)[contractorStatus]);
  const [isPreferencesPopupVisible, setIsPreferencesPopupVisible] = useState<boolean>(false);
  const [isOfferPopupVisible, setIsOfferPopupVisible] = useState<boolean>(false);
  const [isAchievementsPopupVisible, setIsAchievementsPopupVisible] = useState<boolean>(false);
  const [isAccountIsNotActivePopupVisible, setIsAccountIsNotActivePopupVisible] = useState<boolean>(false);
  const [isOpened, setIsOpened] = useState<boolean>(false);

  useEffect(() => {
    setLineState(getRideBuilderRecord(t)[contractorStatus]);
  }, [contractorStatus, t]);

  useEffect(() => {
    setOffer(offerFromBack);
  }, []);

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
    (async () => {
      //TODO: Change contractorId when we know how it seems
      await dispatch(getAchievements({ contractorId: '' }));
      await dispatch(getPreferences({ contractorId: '' }));
      await dispatch(getTariffs({ contractorId: '' }));
      await dispatch(getContractorStatistics({ contractorId: '' }));
      await dispatch(getCarData({ contractorId: '' }));
      await dispatch(getCanceledTripsAmount({ contractiorId: '' }));
    })();
  }, [dispatch]);

  const onOfferPopupClose = () => {
    setIsOfferPopupVisible(false);
  };

  const onOfferDecline = () => {
    onOfferPopupClose();
    dispatch(responseToOffer(false));
  };

  const onOfferAccept = () => {
    setIsOfferPopupVisible(false);
    dispatch(responseToOffer(true));
    if (offer) {
      dispatch(setOrder(orderFromBack));
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

  const tariffs = useSelector(tariffsSelector);
  const primaryTariff: TariffInfo = useSelector(primaryTariffSelector) ?? tariffs[0];
  const tariffsIconsData = useTariffsIcons();
  const IconComponent = tariffsIconsData[primaryTariff?.name]?.icon;

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
