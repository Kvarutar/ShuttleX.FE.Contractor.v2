import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Keyboard, Linking, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import {
  BottomWindowWithGesture,
  ChangeDataPopUp,
  CodeVerificationScreen,
  CodeVerificationScreenRef,
  isLockedError,
  milSecToTime,
  Nullable,
  useChangeData,
} from 'shuttlex-integration';

import {
  accountSettingsVerifyErrorSelector,
  accountSettingsVerifyStatusSelector,
  isAccountSettingsChangeDataLoadingSelector,
  isAccountSettingsVerifyLoadingSelector,
} from '../../../core/menu/redux/accountSettings/selectors';
import {
  changeAccountContactData,
  requestAccountSettingsChangeDataVerificationCode,
  verifyAccountSettingsDataCode,
} from '../../../core/menu/redux/accountSettings/thunks';
import { useAppDispatch } from '../../../core/redux/hooks';
import { RootStackParamList } from '../../../Navigate/props';

const VerifyPhoneCodeScreen = (): JSX.Element => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { onChangeDataPopupClose, changedValue, handleValueChange } = useChangeData();

  const codeVerificationRef = useRef<Nullable<CodeVerificationScreenRef>>(null);
  const previousChangedValue = useRef<Nullable<string>>(null);

  const initialPhone = useSelector(accountSettingsVerifyStatusSelector).phoneInfo;
  const verifyDateError = useSelector(accountSettingsVerifyErrorSelector);

  const isVerificationLoading = useSelector(isAccountSettingsVerifyLoadingSelector);
  const isChangeDataLoading = useSelector(isAccountSettingsChangeDataLoadingSelector);

  const [isIncorrectCode, setIsIncorrectCode] = useState<boolean>(false);
  const [lockoutMinutes, setLockoutMinutes] = useState('');
  const [lockoutEndTimestamp, setLockoutEndTimestamp] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [isBottomWindowOpened, setIsBottomWindowOpened] = useState(false);
  const [verificationCode, setVerificationCode] = useState<Nullable<string>>(null);

  const handleCodeChange = useCallback(
    (newCode: string) => {
      if (newCode.length === 4) {
        setVerificationCode(newCode);
        dispatch(
          verifyAccountSettingsDataCode({
            mode: 'phone',
            code: newCode,
            body: changedValue.length ? changedValue : initialPhone,
          }),
        );
      } else {
        setVerificationCode(null);
      }
    },
    [changedValue, dispatch, initialPhone],
  );

  useEffect(() => {
    if (verifyDateError) {
      setIsIncorrectCode(true);
      if (isLockedError(verifyDateError)) {
        setIsIncorrectCode(true);
        const lockoutEndDate = Date.parse(verifyDateError.body.lockOutEndTime) - Date.now();

        setLockoutMinutes(Math.round(milSecToTime(lockoutEndDate)).toString());
        setLockoutEndTimestamp(lockoutEndDate);
        setIsBlocked(true);
      }
    } else {
      setIsIncorrectCode(false);
    }
  }, [verifyDateError]);

  useEffect(() => {
    if (!isVerificationLoading && !verifyDateError && verificationCode) {
      navigation.goBack();
    }
  }, [isVerificationLoading, navigation, verificationCode, verifyDateError]);

  useEffect(() => {
    setIsBottomWindowOpened(false);

    if (changedValue.length && changedValue !== previousChangedValue.current) {
      codeVerificationRef.current?.refresh();
      previousChangedValue.current = changedValue;

      dispatch(
        changeAccountContactData({
          mode: 'phone',
          data: { oldData: initialPhone, newData: changedValue },
        }),
      );
    }
  }, [initialPhone, changedValue, dispatch]);

  const handleRequestAgain = () => {
    dispatch(
      requestAccountSettingsChangeDataVerificationCode({
        mode: 'phone',
        data: changedValue.length ? changedValue : initialPhone,
      }),
    );
  };

  const onBannedAgainPress = () => {
    handleRequestAgain();
    setIsBlocked(false);
  };

  const openChangePhonePopUp = () => {
    Keyboard.dismiss();
    setIsBottomWindowOpened(true);
  };

  return (
    <>
      <CodeVerificationScreen
        ref={codeVerificationRef}
        headerFirstText={t('verification_VerifyPhoneCode_firstHeader')}
        headerSecondText={changedValue.length ? changedValue : initialPhone}
        onBackButtonPress={navigation.goBack}
        onAgainButtonPress={handleRequestAgain}
        onCodeChange={handleCodeChange}
        titleText={t('verification_VerifyPhoneCode_title')}
        isBlocked={isBlocked}
        isError={isIncorrectCode}
        lockOutTime={lockoutEndTimestamp}
        lockOutTimeForText={lockoutMinutes}
        underButtonText={t('verification_VerifyPhoneCode_underButtonText')}
        underButtonPressableText={t('verification_VerifyPhoneCode_underButtonPressableText')}
        onPressUnderButtonText={openChangePhonePopUp}
        onBannedAgainButtonPress={onBannedAgainPress}
        onSupportButtonPress={() => Linking.openURL('https://t.me/ShuttleX_Support')}
      />
      {isBottomWindowOpened && (
        <BottomWindowWithGesture
          hiddenPart={
            <ChangeDataPopUp
              setNewValue={handleValueChange}
              currentValue={initialPhone}
              mode="phone"
              onChangeDataPopupClose={onChangeDataPopupClose}
              isChangeDataLoading={isChangeDataLoading}
            />
          }
          hiddenPartContainerStyle={styles.hiddenPartContainerStyle}
          setIsOpened={setIsBottomWindowOpened}
          withShade
          opened
          withHiddenPartScroll
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  hiddenPartContainerStyle: {
    height: '100%',
  },
});

export default VerifyPhoneCodeScreen;
