import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { CodeVerificationScreen, SafeAreaView } from 'shuttlex-integration';

import {
  incremenChangestAttempts,
  resetIsBlocked,
  //TODO get to know if we need this
  // resetLockoutChanges,
  setIsVerificationDone,
} from '../../../core/menu/redux/accountSettings';
import { selectIsBlocked } from '../../../core/menu/redux/accountSettings/selectors';
import { useAppDispatch } from '../../../core/redux/hooks';
import { RootStackParamList } from '../../../Navigate/props';

const AccountVerificateCodeScreen = (): JSX.Element => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useAppDispatch();
  const isBlocked = useSelector(selectIsBlocked);
  const [isCorrectCode, setIsCorrectCode] = useState<boolean>(false);

  const { t } = useTranslation();

  //TODO Add logic to send data on backend
  const handleCodeChange = (newCode: string) => {
    setIsCorrectCode(false);
    if (newCode.length === 4) {
      if (newCode === '4444') {
        setIsCorrectCode(true);
      } else {
        dispatch(setIsVerificationDone(true));
        navigation.goBack();
      }
    }
  };

  const onRequestAgain = () => {
    dispatch(incremenChangestAttempts());
  };

  return (
    <SafeAreaView>
      <CodeVerificationScreen
        headerFirstText={t('menu_AccountVerificateCode_firstHeader')}
        headerSecondText={t('menu_AccountVerificateCode_secondHeader')}
        onBackButtonPress={navigation.goBack}
        onAgainButtonPress={onRequestAgain}
        onCodeChange={handleCodeChange}
        titleText={t('menu_AccountVerificateCode_change')}
        isBlocked={isBlocked}
        isError={isCorrectCode}
        lockOutTime={10000}
        lockOutTimeForText={'5'}
        onBannedAgainButtonPress={() => dispatch(resetIsBlocked())}
        onSupportButtonPress={() => {
          // TODO: onSupportPress
        }}
      />
    </SafeAreaView>
  );
};

export default AccountVerificateCodeScreen;
