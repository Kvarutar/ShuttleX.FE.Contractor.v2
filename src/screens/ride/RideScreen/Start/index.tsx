import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import {
  BottomWindowWithGesture,
  BottomWindowWithGestureRef,
  minToMilSec,
  SquareButtonModes,
  SwipeButtonModes,
} from 'shuttlex-integration';

import { contractorStatusSelector } from '../../../../core/contractor/redux/selectors';
import { getAchievements, getPreferences, getTariffs } from '../../../../core/contractor/redux/thunks';
import { ContractorStatus } from '../../../../core/contractor/redux/types';
import { useAppDispatch } from '../../../../core/redux/hooks';
import { twoHighestPriorityAlertsSelector } from '../../../../core/ride/redux/alerts/selectors';
import { setOrder } from '../../../../core/ride/redux/trip';
import { responseToOffer } from '../../../../core/ride/redux/trip/thunks';
import { OfferType, OrderType } from '../../../../core/ride/redux/trip/types';
import AlertInitializer from '../../../../shared/AlertInitializer';
import AchievementsPopup from '../popups/AchievementsPopup';
import OfferPopup from '../popups/OfferPopup';
import TariffPreferencesPopup from '../popups/PreferencesPopup';
import HiddenPart from './HiddenPart';
import VisiblePart from './VisiblePart';

type lineStateTypes = {
  popupTitle: string;
  toLineState: ContractorStatus;
  bottomTitle: string;
  buttonText: string;
  buttonMode: SquareButtonModes;
  swipeMode: SwipeButtonModes;
};

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
    // {
    //   address: '241 Harvie Ave, York, ON M6E 4K9',
    //   latitude: 123123123,
    //   longitude: 123123123,
    // },
    // {
    //   address: '450 Blythwood Rd, North York, ON M4N 1A9',
    //   latitude: 123123123,
    //   longitude: 123123123,
    // },
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
    name: 'John',
    lastName: 'Doe',
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
    // {
    //   address: '241 Harvie Ave, York, ON M6E 4K9',
    //   latitude: 123123123,
    //   longitude: 123123123,
    // },
    // {
    //   address: '450 Blythwood Rd, North York, ON M4N 1A9',
    //   latitude: 123123123,
    //   longitude: 123123123,
    // },
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

  const contractorStatus = useSelector(contractorStatusSelector);
  const alerts = useSelector(twoHighestPriorityAlertsSelector);

  const [offer, setOffer] = useState<OfferType>();
  const [lineState, setLineState] = useState<lineStateTypes>(getRideBuilderRecord(t)[contractorStatus]);
  const [isPreferencesPopupVisible, setIsPreferencesPopupVisible] = useState<boolean>(false);
  const [isOfferPopupVisible, setIsOfferPopupVisible] = useState<boolean>(false);
  const [isAchievementsPopupVisible, setIsAchievementsPopupVisible] = useState<boolean>(false);
  const [isOpened, setIsOpened] = useState<boolean>(false);

  useEffect(() => {
    setLineState(getRideBuilderRecord(t)[contractorStatus]);
  }, [contractorStatus, t]);

  useEffect(() => {
    setOffer(offerFromBack);
  }, []);

  useEffect(() => {
    if (contractorStatus === 'online') {
      setTimeout(() => {
        setIsOfferPopupVisible(true);
      }, 5000);
    }
  }, [contractorStatus]);

  useEffect(() => {
    const asyncGetTariffsPreferences = async () => {
      //TODO: Add a real contractor id
      await dispatch(getTariffs({ contractorId: '' }));
      await dispatch(getPreferences({ contractorId: '' }));
      await dispatch(getAchievements({ contractorId: '' }));
    };
    asyncGetTariffsPreferences();
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

  const computedStyles = StyleSheet.create({
    bottomWindowStyle: {
      paddingBottom: isOpened ? 0 : 20,
    },
  });

  return (
    <>
      <BottomWindowWithGesture
        withHiddenPartScroll={false}
        bottomWindowStyle={[styles.bottomWindowStyle, computedStyles.bottomWindowStyle]}
        setIsOpened={setIsOpened}
        ref={bottomWindowRef}
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
          <VisiblePart
            isOpened={isOpened}
            bottomWindowRef={bottomWindowRef}
            setIsPreferencesPopupVisible={setIsPreferencesPopupVisible}
            lineState={lineState}
          />
        }
        hiddenPart={
          <HiddenPart
            isOpened={isOpened}
            bottomWindowRef={bottomWindowRef}
            lineState={lineState}
            setIsAchievementsPopupVisible={setIsAchievementsPopupVisible}
          />
        }
      />
      {isPreferencesPopupVisible && (
        <TariffPreferencesPopup
          onClose={() => setIsPreferencesPopupVisible(false)}
          setIsPreferencesPopupVisible={setIsPreferencesPopupVisible}
        />
      )}
      {offer && isOfferPopupVisible && (
        <OfferPopup
          offer={offer}
          onOfferAccept={onOfferAccept}
          onOfferDecline={onOfferDecline}
          onClose={onOfferPopupClose}
        />
      )}
      {isAchievementsPopupVisible && (
        <AchievementsPopup setIsAchievementsPopupVisible={setIsAchievementsPopupVisible} />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  bottomWindowStyle: {
    paddingHorizontal: 0,
    paddingTop: 12,
  },
});

export default Start;
