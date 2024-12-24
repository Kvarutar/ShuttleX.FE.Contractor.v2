import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking, StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSelector } from 'react-redux';
import {
  BottomWindowWithGesture,
  Button,
  isIncorrectFieldsError,
  SquareButtonModes,
  SwipeButtonModes,
  UnsupportedCityPopup,
  useChangeData,
  useTariffsIcons,
  VerifyDataPopUp,
} from 'shuttlex-integration';

import { isUnVerifyPhoneError } from '../../../../core/contractor/redux/errors';
import {
  contractorGeneralErrorSelector,
  contractorStatusSelector,
  contractorZoneSelector,
  isTariffsInfoLoadingSelector,
  primaryTariffSelector,
  tariffsInfoErrorSelector,
} from '../../../../core/contractor/redux/selectors';
import { ContractorStatus } from '../../../../core/contractor/redux/types';
import { accountSettingsVerifyStatusSelector } from '../../../../core/menu/redux/accountSettings/selectors';
import { requestAccountSettingsChangeDataVerificationCode } from '../../../../core/menu/redux/accountSettings/thunks';
import { useAppDispatch } from '../../../../core/redux/hooks';
import { twoHighestPriorityAlertsSelector } from '../../../../core/ride/redux/alerts/selectors';
import { setIsCanceledTripsPopupVisible } from '../../../../core/ride/redux/trip';
import { isCanceledTripsPopupVisibleSelector } from '../../../../core/ride/redux/trip/selectors';
import { getCurrentOrder } from '../../../../core/ride/redux/trip/thunks';
import { RootStackParamList } from '../../../../Navigate/props';
import AlertInitializer from '../../../../shared/AlertInitializer';
import AccountIsNotActivePopup from '../popups/AccountIsNotActivePopup';
import AchievementsPopup from '../popups/AchievementsPopup';
import TariffPreferencesPopup from '../popups/PreferencesPopup';
import UnclosablePopupWithModes from '../popups/UnclosablePopupWithModes';
import { UnclosablePopupModes } from '../popups/UnclosablePopupWithModes/props';
import { StartProps } from './types';
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

const Start = ({ bottomWindowRef, achievementsBottomWindowRef, preferencesBottomWindowRef }: StartProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { onVerifyPopupClose, isVerifyPopUpVisible, handleOpenVerifyWindow } = useChangeData();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const isTariffsInfoLoading = useSelector(isTariffsInfoLoadingSelector);
  const tariffsInfoError = useSelector(tariffsInfoErrorSelector);

  const contractorStatus = useSelector(contractorStatusSelector);
  const alerts = useSelector(twoHighestPriorityAlertsSelector);
  const isCanceledTripsPopupVisible = useSelector(isCanceledTripsPopupVisibleSelector);
  const generalError = useSelector(contractorGeneralErrorSelector);

  const [lineState, setLineState] = useState<lineStateTypes>(getRideBuilderRecord(t)[contractorStatus]);
  const [isPreferencesPopupVisible, setIsPreferencesPopupVisible] = useState<boolean>(false);
  const [isAchievementsPopupVisible, setIsAchievementsPopupVisible] = useState<boolean>(false);
  const [isAccountIsNotActivePopupVisible, setIsAccountIsNotActivePopupVisible] = useState<boolean>(false);
  const [isUnsupportedCityPopupVisible, setIsUnsupportedCityPopupVisible] = useState<boolean>(false);
  const [isOpened, setIsOpened] = useState<boolean>(false);
  const contractorZone = useSelector(contractorZoneSelector);
  const accountSettingsVerifyStatus = useSelector(accountSettingsVerifyStatusSelector);

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
    if (generalError && isUnVerifyPhoneError(generalError)) {
      handleOpenVerifyWindow('phone');
    }
  }, [generalError, handleOpenVerifyWindow]);

  useEffect(() => {
    if (isOpened && contractorStatus === 'offline' && !contractorZone) {
      setIsUnsupportedCityPopupVisible(true);
    } else if (!isOpened) {
      setIsUnsupportedCityPopupVisible(false);
    }
  }, [contractorStatus, contractorZone, isOpened]);

  //TODO: Change theese effect and thunks when we know how it seems
  // Unused thunks for now
  // For achievements and preferences
  // useEffect(() => {
  //   (async () => {
  //     await dispatch(getAchievements({ contractorId: '' }));
  //     await dispatch(getPreferences({ contractorId: '' }));
  //   })();
  // }, [dispatch]);

  useEffect(() => {
    if (generalError && isIncorrectFieldsError(generalError)) {
      dispatch(setIsCanceledTripsPopupVisible(true));
    }
  }, [generalError, dispatch]);

  const handleOpenVerificationPhone = () => {
    if (accountSettingsVerifyStatus.phoneInfo) {
      dispatch(
        requestAccountSettingsChangeDataVerificationCode({
          mode: 'phone',
          data: accountSettingsVerifyStatus.phoneInfo,
        }),
      );
    }
    onVerifyPopupClose();
    navigation.navigate('VerifyPhoneCode');
  };

  const onPressConfirmButton = () => {
    dispatch(setIsCanceledTripsPopupVisible(false));
    dispatch(getCurrentOrder());
  };

  //TODO: Add navigation to support page or same thing and resetting cancels
  const onPressContactSupportButton = () => {
    Linking.openURL('https://t.me/ShuttleX_Support');
    dispatch(setIsCanceledTripsPopupVisible(false));
    dispatch(getCurrentOrder());
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
              setIsAccountIsNotActivePopupVisible={setIsAccountIsNotActivePopupVisible}
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
      {isVerifyPopUpVisible && (
        <VerifyDataPopUp
          data={accountSettingsVerifyStatus.phoneInfo}
          mode="phone"
          handleOpenVerification={handleOpenVerificationPhone}
          onVerifyPopupClose={onVerifyPopupClose}
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
