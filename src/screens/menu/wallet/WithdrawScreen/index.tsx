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
  selectedPaymentMethodSelector,
  totalWalletBalanceSelector,
} from '../../../../core/menu/redux/wallet/selectors';
import { fetchWithdraw } from '../../../../core/menu/redux/wallet/thunks';
import { useAppDispatch } from '../../../../core/redux/hooks';
import { WithdrawScreenProps } from './props';
import SliderAmount from './SliderAmount';

const minWithdrawSum = 100;
const currency = '₴';

const animationDuration = 150;

const WithdrawScreen = ({ navigation }: WithdrawScreenProps): JSX.Element => {
  const dispatch = useAppDispatch();

  const { colors } = useTheme();
  const activeBackgroundColor = useSharedValue(colors.backgroundPrimaryColor);

  const balanceTotal = useSelector(totalWalletBalanceSelector);
  const selectedPaymentMethod = useSelector(selectedPaymentMethodSelector);

  const [inputAmount, setInputAmount] = useState<number>(minWithdrawSum);
  const [isVisibleSlider, setIsVisibleSlider] = useState(true);

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
      color: isError ? colors.textSecondaryColor : colors.textTertiaryColor,
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
      t('menu_Withdraw_alertDescription', {
        withdrawAmount: inputAmount,
        cardEnding: selectedPaymentMethod?.details,
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
            <TextInput
              currencySymbol="₴"
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
                {currency + balanceTotal.toString()}
              </Text>
            </View>
          </View>
          <Button
            text={t('menu_Withdraw_withdrawButton')}
            onPress={onWithdraw}
            mode={isError ? SquareButtonModes.Mode5 : SquareButtonModes.Mode2}
            disabled={isError}
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
    paddingHorizontal: 0,
  },
});

export default WithdrawScreen;
