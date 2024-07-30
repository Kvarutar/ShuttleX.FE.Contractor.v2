import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import {
  Bar,
  BottomWindow,
  Button,
  ButtonModes,
  PreferencesIcon,
  StatisticsIcon,
  SwipeButtonModes,
  Text,
  useTheme,
} from 'shuttlex-integration';

import { contractorStatusSelector } from '../../../core/contractor/redux/selectors';
import { updateContractorStatus } from '../../../core/contractor/redux/thunks';
import { ContractorStatus } from '../../../core/contractor/redux/types';
import { useAppDispatch } from '../../../core/redux/hooks';
import { twoHighestPriorityAlertsSelector } from '../../../core/ride/redux/alerts/selectors';
import { setOrder } from '../../../core/ride/redux/trip';
import { responseToOffer } from '../../../core/ride/redux/trip/thunks';
import { OfferType } from '../../../core/ride/redux/trip/types';
import AlertInitializer from '../../../shared/AlertInitializer';
import ConfirmationPopup from './popups/ConfirmationPopup';
import OfferPopup from './popups/OfferPopup';
import TariffPreferencesPopup from './popups/PreferencesPopup';
import TarifsCarousel from './TarifsCarousel';

type lineStateTypes = {
  popupTitle: string;
  toLineState: ContractorStatus;
  bottomTitle: string;
  buttonText: string;
  buttonMode: ButtonModes;
  swipeMode: SwipeButtonModes;
};

const getRideBuilderRecord = (t: ReturnType<typeof useTranslation>['t']): Record<ContractorStatus, lineStateTypes> => ({
  online: {
    popupTitle: t('ride_Ride_Popup_onlineTitle'),
    toLineState: 'offline',
    bottomTitle: t('ride_Ride_BottomWindow_onlineTitle'),
    buttonText: t('ride_Ride_Bar_onlineTitle'),
    buttonMode: ButtonModes.Mode3,
    swipeMode: SwipeButtonModes.Decline,
  },
  offline: {
    popupTitle: t('ride_Ride_Popup_offlineTitle'),
    toLineState: 'online',
    bottomTitle: t('ride_Ride_BottomWindow_offlineTitle'),
    buttonText: t('ride_Ride_Bar_offlineTitle'),
    buttonMode: ButtonModes.Mode1,
    swipeMode: SwipeButtonModes.Confirm,
  },
});

const Start = () => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const alerts = useSelector(twoHighestPriorityAlertsSelector);

  const [offer, setOffer] = useState<OfferType>();
  const contractorStatus = useSelector(contractorStatusSelector);
  const [lineState, setLineState] = useState<lineStateTypes>(getRideBuilderRecord(t)[contractorStatus]);

  const [isConfirmationPopupVisible, setIsConfirmationPopupVisible] = useState<boolean>(false);
  const [isPreferencesPopupVisible, setIsPreferencesPopupVisible] = useState<boolean>(false);
  const [isOfferPopupVisible, setIsOfferPopupVisible] = useState<boolean>(false);

  const computedStyles = StyleSheet.create({
    title: {
      color: colors.textPrimaryColor,
    },
  });

  useEffect(() => {
    setLineState(getRideBuilderRecord(t)[contractorStatus]);
  }, [contractorStatus, t]);

  useEffect(() => {
    setOffer({
      startPosition: {
        address: '123 Queen St W, Toronto, ON M5H 2M9',
        latitude: 12312312,
        longitude: 123123123,
      },
      targetPointsPosition: [
        {
          address: '241 Harvie Ave, York, ON M6E 4K9',
          latitude: 123123123,
          longitude: 123123123,
        },
        {
          address: '450 Blythwood Rd, North York, ON M4N 1A9',
          latitude: 123123123,
          longitude: 123123123,
        },
        {
          address: '12 Bushbury Dr, North York, ON M3A 2Z7',
          latitude: 123123123,
          longitude: 123213123,
        },
      ],
      passengerId: '0',
      passenger: {
        name: 'Michael',
        lastName: 'Skorodumov',
        phone: '89990622720',
      },
      tripTariff: 'BasicX',
      total: '20.45',
      fullDistance: 20.4,
      fullTime: 25,
    });
  }, []);

  const swipeHandler = async (mode: ContractorStatus) => {
    setIsConfirmationPopupVisible(false);
    await dispatch(updateContractorStatus(mode));
  };

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
      dispatch(setOrder(offer));
    }
  };

  return (
    <>
      <BottomWindow
        style={styles.bottom}
        alerts={alerts.map(alertData => (
          <AlertInitializer
            key={alertData.id}
            id={alertData.id}
            priority={alertData.priority}
            type={alertData.type}
            options={'options' in alertData ? alertData.options : undefined}
          />
        ))}
      >
        <View style={styles.infoWrapper}>
          <Pressable onPress={() => setIsPreferencesPopupVisible(true)} hitSlop={10}>
            <PreferencesIcon />
          </Pressable>
          <Text style={[computedStyles.title, styles.title]}>{lineState.bottomTitle}</Text>
          <Pressable onPress={() => setIsOfferPopupVisible(true)} hitSlop={10}>
            <StatisticsIcon />
          </Pressable>
        </View>
        <Bar style={styles.card}>
          <TarifsCarousel />
          <Button
            mode={lineState.buttonMode}
            text={lineState.buttonText}
            onPress={() => setIsConfirmationPopupVisible(true)}
          />
        </Bar>
      </BottomWindow>
      {isConfirmationPopupVisible && (
        <ConfirmationPopup
          onClose={() => setIsConfirmationPopupVisible(false)}
          onSwipeEnd={() => swipeHandler(lineState.toLineState)}
          popupTitle={lineState.popupTitle}
          swipeMode={lineState.swipeMode}
        />
      )}
      {isPreferencesPopupVisible && <TariffPreferencesPopup onClose={() => setIsPreferencesPopupVisible(false)} />}
      {offer && isOfferPopupVisible && (
        <OfferPopup
          offer={offer}
          onOfferAccept={onOfferAccept}
          onOfferDecline={onOfferDecline}
          onClose={onOfferPopupClose}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  bottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  infoWrapper: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 28,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter Medium',
    textAlign: 'center',
  },
  card: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default Start;
