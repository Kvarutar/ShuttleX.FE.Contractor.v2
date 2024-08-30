import { t } from 'i18next';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import {
  ButtonV1,
  ButtonV1Shapes,
  CustomKeyboardAvoidingView,
  SafeAreaView,
  ShortArrowIcon,
  Text,
  TextInput,
  TextInputInputMode,
  useThemeV1,
} from 'shuttlex-integration';

import { walletBalanceSelector } from '../../../../core/menu/redux/wallet/selectors';
import { WithdrawScreenProps } from './props';
import SuccessModal from './SuccessModal';

const WithdrawScreen = ({ navigation }: WithdrawScreenProps): JSX.Element => {
  const { colors } = useThemeV1();
  const balance = useSelector(walletBalanceSelector);

  const [amount, setAmount] = useState(100);
  const [isError, setIsError] = useState(false);
  const [isSuccessPopupVisible, setIsSuccessPopupVisible] = useState(false);

  const computedStyles = StyleSheet.create({
    available: {
      color: colors.textSecondaryColor,
    },
    input: {
      color: isError ? colors.errorColor : colors.textPrimaryColor,
    },
  });

  const onChangeText = (text: string) => {
    setAmount(Number(text.replace(/[^+\d]/g, '')));
    if (isError) {
      setIsError(false);
    }
  };

  const onWithdraw = () => {
    if (Number(amount) > balance) {
      setIsError(true);
    } else {
      setIsSuccessPopupVisible(true);
    }
  };

  return (
    <CustomKeyboardAvoidingView>
      <SafeAreaView containerStyle={styles.container}>
        <View style={styles.header}>
          <ButtonV1 onPress={navigation.goBack} shape={ButtonV1Shapes.Circle}>
            <ShortArrowIcon />
          </ButtonV1>
          <Text style={styles.headerTitle}>{t('menu_Withdraw_headerTitle')}</Text>
          <View style={styles.headerDummy} />
        </View>
        <View>
          <Text style={[styles.available, computedStyles.available]}>{t('menu_Withdraw_avaliable', { balance })}</Text>
          <TextInput
            inputMode={TextInputInputMode.Money}
            value={amount.toString()}
            onChangeText={onChangeText}
            style={[styles.input, computedStyles.input]}
            multiline
          />
        </View>
        <ButtonV1 text={t('menu_Withdraw_withdrawButton')} onPress={onWithdraw} />
      </SafeAreaView>
      {isSuccessPopupVisible && <SuccessModal amount={amount} onContinue={navigation.goBack} />}
    </CustomKeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Inter Medium',
    fontSize: 18,
  },
  headerDummy: {
    width: 50,
  },
  container: {
    justifyContent: 'space-between',
  },
  available: {
    textAlign: 'center',
    fontSize: 12,
    fontFamily: 'Inter Medium',
  },
  input: {
    textAlign: 'center',
    fontFamily: 'Inter Medium',
    fontSize: 32,
    borderWidth: 0,
    paddingHorizontal: 0,
  },
});

export default WithdrawScreen;
