import { useRoute } from '@react-navigation/native';
import { t } from 'i18next';
import { useCallback, useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSelector } from 'react-redux';
import {
  Button,
  ButtonShapes,
  ButtonSizes,
  CustomKeyboardAvoidingView,
  SafeAreaView,
  ShortArrowIcon,
  SquareButtonModes,
  Text,
  TextInput,
  TextInputInputMode,
  useTheme,
} from 'shuttlex-integration';

import {
  emailOrBinanceIdCryptoSelector,
  selectedPaymentMethodSelector,
} from '../../../../core/menu/redux/wallet/selectors';
import { fetchWithdraw } from '../../../../core/menu/redux/wallet/thunks';
import { useAppDispatch } from '../../../../core/redux/hooks';
import SliderAmount from './SliderAmount';
import { WithdrawScreenProps } from './types';

const animationDuration = 150;

const WithdrawScreen = ({ navigation }: WithdrawScreenProps): JSX.Element => {
  const dispatch = useAppDispatch();
  const route = useRoute<WithdrawScreenProps['route']>();
  const { selectedTotalBalance, currencySign, withdrawType } = route.params;

  const { colors } = useTheme();
  const activeBackgroundColor = useSharedValue(colors.backgroundPrimaryColor);

  const minWithdrawSum = withdrawType === 'cash' ? 100 : 10;

  const balanceTotal = selectedTotalBalance;
  const selectedPaymentMethod = useSelector(selectedPaymentMethodSelector);
  const emailOrBinanceId = useSelector(emailOrBinanceIdCryptoSelector);

  const [inputAmount, setInputAmount] = useState<number>(minWithdrawSum);
  const [isVisibleSlider, setIsVisibleSlider] = useState(true);

  const isAddedOutputMethod =
    (withdrawType === 'cash' && selectedPaymentMethod) || (withdrawType === 'crypto' && emailOrBinanceId);

  const isError = inputAmount > balanceTotal || inputAmount < minWithdrawSum;

  const changeBackground = useCallback(
    (color: string) => {
      activeBackgroundColor.value = withTiming(color, { duration: animationDuration });
    },
    [activeBackgroundColor],
  );

  useEffect(() => {
    if (inputAmount > minWithdrawSum + 1 && inputAmount <= balanceTotal) {
      changeBackground(colors.primaryColor);
    } else if (isError) {
      changeBackground(colors.errorColor);
    } else {
      changeBackground(colors.backgroundPrimaryColor);
    }
  }, [
    minWithdrawSum,
    inputAmount,
    balanceTotal,
    activeBackgroundColor,
    isError,
    changeBackground,
    colors.errorColor,
    colors.backgroundPrimaryColor,
    colors.primaryColor,
  ]);

  const computedStyles = StyleSheet.create({
    container: {
      backgroundColor: 'transparent',
    },
    availableFirstText: {
      color: colors.textPrimaryColor,
      opacity: 0.3,
    },
    availableSecondText: {
      color: colors.textPrimaryColor,
    },
    input: {
      color: colors.textPrimaryColor,
      fontSize: inputAmount.toString().length < 5 ? 72 : 54,
    },
    buttonText: {
      color: isError || !isAddedOutputMethod ? colors.textSecondaryColor : colors.textTertiaryColor,
    },
    currencySign: {
      color: colors.textPrimaryColor,
    },
  });

  const onChangeText = (text: string) => {
    setInputAmount(Number(text.replace(/[^+\d.]/g, '')));
  };

  const AsyncAlert = async (title: string, description: string, buttonText: string) =>
    new Promise(() => {
      Alert.alert(
        title,
        description,
        [
          {
            text: buttonText,
            onPress: () => {
              setIsVisibleSlider(false);
              navigation.goBack();
            },
          },
        ],
        { cancelable: false },
      );
    });

  //TODO: Add logic receiving correct response from back-end
  const onWithdraw = async () => {
    await dispatch(fetchWithdraw({ withdrawSum: inputAmount }));

    await AsyncAlert(
      t('menu_Withdraw_alertTitle'),
      withdrawType === 'cash'
        ? t('menu_Withdraw_alertDescription', {
            withdrawAmount: inputAmount,
            cardEnding: selectedPaymentMethod?.details,
          })
        : t('menu_Withdraw_alertDescriptionCrypto', {
            cryptoAmount: inputAmount,
            cryptoCurrencySign: currencySign,
            //TODO: Add responsing UID before calling alert(?)
            cryptoUID: emailOrBinanceId,
          }),
      t('menu_Withdraw_alertContinueButton'),
    );
  };

  // To properly hide the slider component before the "goBack" function starts
  const onBackButtonPress = () => {
    setIsVisibleSlider(false);
    setTimeout(navigation.goBack, 0);
  };

  const animatedViewStyle = useAnimatedStyle(() => ({
    backgroundColor: activeBackgroundColor.value,
  }));

  return (
    <CustomKeyboardAvoidingView>
      <Animated.View style={[styles.animatedView, animatedViewStyle]}>
        <SafeAreaView
          containerStyle={[styles.container, computedStyles.container]}
          wrapperStyle={computedStyles.container}
        >
          <View style={styles.header}>
            <Button
              onPress={onBackButtonPress}
              shape={ButtonShapes.Circle}
              size={ButtonSizes.S}
              disableShadow
              style={styles.headerButtonStyle}
              circleSubContainerStyle={[styles.headerButtonSubContainerStyle, styles.headerButtonStyle]}
            >
              <ShortArrowIcon />
            </Button>
            <Text style={styles.headerTitle}>{t('menu_Withdraw_headerTitle')}</Text>
            <View style={styles.headerDummy} />
          </View>
          <View>
            <Text style={[styles.currencySign, computedStyles.currencySign]}>{currencySign}</Text>
            <TextInput
              inputMode={TextInputInputMode.Money}
              value={inputAmount.toString()}
              onChangeText={onChangeText}
              containerStyle={styles.inputContainer}
              inputStyle={[styles.input, computedStyles.input]}
            />
            {isVisibleSlider && (
              <SliderAmount
                balanceTotal={balanceTotal}
                minWithdrawSum={minWithdrawSum}
                inputAmount={inputAmount}
                setInputAmount={setInputAmount}
              />
            )}
            <View style={styles.availableTextsWrapper}>
              <Text style={[styles.availableFirstText, computedStyles.availableFirstText]}>
                {t('menu_Withdraw_avaliable')}
              </Text>
              <Text style={[styles.availableSecondText, computedStyles.availableSecondText]}>
                {currencySign + ' ' + balanceTotal.toString()}
              </Text>
            </View>
          </View>
          <Button
            text={t('menu_Withdraw_withdrawButton')}
            onPress={onWithdraw}
            mode={isError || !isAddedOutputMethod ? SquareButtonModes.Mode5 : SquareButtonModes.Mode2}
            disabled={isError || !isAddedOutputMethod}
            textStyle={computedStyles.buttonText}
          />
        </SafeAreaView>
      </Animated.View>
    </CustomKeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  animatedView: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Inter Medium',
    fontSize: 18,
  },
  headerButtonSubContainerStyle: {
    borderColor: '#0707071A', //TODO: Check on dark theme
  },
  headerButtonStyle: {
    backgroundColor: 'transparent',
  },
  headerDummy: {
    width: 50,
  },
  currencySign: {
    fontFamily: 'Inter Bold',
    fontSize: 32,
    lineHeight: 38,
    alignSelf: 'center',
    opacity: 0.4,
    marginBottom: 28, // less than in design due to input
  },
  container: {
    justifyContent: 'space-between',
  },
  availableTextsWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
  },
  availableFirstText: {
    textAlign: 'center',
    fontSize: 17,
    fontFamily: 'Inter Medium',
  },
  availableSecondText: {
    fontSize: 17,
    fontFamily: 'Inter Medium',
  },
  inputContainer: {
    borderWidth: 0,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    textAlign: 'center',
    fontFamily: 'Inter Medium',
    borderWidth: 0,
    height: 90,
    paddingVertical: 0,
  },
});

export default WithdrawScreen;
