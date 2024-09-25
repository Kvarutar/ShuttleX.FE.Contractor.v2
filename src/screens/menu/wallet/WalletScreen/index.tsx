import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useSelector } from 'react-redux';
import {
  Bar,
  BottomWindow,
  ButtonV1,
  ButtonV1Modes,
  ButtonV1Shapes,
  DropDownIcon,
  getPaymentIcon,
  PaymentMethod,
  PlusIcon,
  SafeAreaView,
  ScrollViewWithCustomScroll,
  Separator,
  ShortArrowIcon,
  Text,
  useThemeV1,
} from 'shuttlex-integration';

import { setAvaliablePaymentMethods, setBalance, setSelectedPaymentMethod } from '../../../../core/menu/redux/wallet';
import {
  avaliablePaymentMethodsListSelector,
  selectedPaymentMethodSelector,
  walletBalanceSelector,
} from '../../../../core/menu/redux/wallet/selectors';
import { useAppDispatch } from '../../../../core/redux/hooks';
import PaymentMethodContent from './PaymentMethod';
import { WalletScreenProps, WithdrawalHistory } from './props';
import WithdrawalHistoryItem from './WithdrawalHistoryItem';

const fadeAnimationDuration = 200;

const WalletScreen = ({ navigation }: WalletScreenProps): JSX.Element => {
  const { colors } = useThemeV1();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const balance = useSelector(walletBalanceSelector);
  const selectedPaymentMethod = useSelector(selectedPaymentMethodSelector);
  const avaliablePaymentMethods = useSelector(avaliablePaymentMethodsListSelector);

  const [withdrawalHistory, setWithdrawalHistory] = useState<WithdrawalHistory[]>([]);
  const [isPaymentsVariantsVisible, setIsPaymentsVariantsVisible] = useState(false);

  useEffect(() => {
    //for test
    dispatch(setBalance(686.18));
    dispatch(
      setSelectedPaymentMethod({
        method: 'visa',
        details: '1234',
        expiresAt: '12/34',
      }),
    );
    setWithdrawalHistory([
      {
        quantity: '100.18',
        date: new Date().getTime(),
      },
      {
        quantity: '101.18',
        date: new Date().getTime() + 1,
      },
      {
        quantity: '102.18',
        date: new Date().getTime() + 2,
      },
      {
        quantity: '103.18',
        date: new Date().getTime() + 3,
      },
      {
        quantity: '104.18',
        date: new Date().getTime() + 4,
      },
      {
        quantity: '105.18',
        date: new Date().getTime() + 5,
      },
    ]);
    dispatch(
      setAvaliablePaymentMethods([
        {
          method: 'visa',
          details: '1234',
          expiresAt: '12/34',
        },
        {
          method: 'mastercard',
          details: '6578',
          expiresAt: '12/34',
        },
        {
          method: 'mastercard',
          details: '9101',
          expiresAt: '12/34',
        },
      ]),
    );
  }, [dispatch]);

  const computedStyles = StyleSheet.create({
    separator: {
      borderColor: colors.strokeColor,
    },
    balanceTitle: {
      color: colors.textSecondaryColor,
    },
    tripsTitle: {
      color: colors.textSecondaryColor,
    },
    wallet: {
      backgroundColor: colors.backgroundPrimaryColor,
    },
  });

  const onSelectMethod = (method: PaymentMethod) => {
    dispatch(setSelectedPaymentMethod(method));
    setIsPaymentsVariantsVisible(false);
  };

  let paymentMethodsContent = null;

  if (avaliablePaymentMethods.length > 0 && selectedPaymentMethod) {
    paymentMethodsContent = avaliablePaymentMethods.map((method, index, methods) => (
      <PaymentMethodContent
        key={index}
        index={index}
        paymentMethod={method}
        onSelectMethod={() => onSelectMethod(method)}
        selectedPaymentMethod={selectedPaymentMethod}
        paymentMethods={methods}
      />
    ));
  }

  let history = null;

  if (withdrawalHistory.length > 0) {
    const withdrawalHistoryItems = withdrawalHistory.map(historyItem => (
      <WithdrawalHistoryItem key={historyItem.date} withdrawalHistoryItem={historyItem} />
    ));

    history = (
      <View style={styles.history}>
        <Text style={styles.historyTitle}>{t('menu_Wallet_historyTitle')}</Text>
        <ScrollViewWithCustomScroll style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
          {withdrawalHistoryItems}
        </ScrollViewWithCustomScroll>
      </View>
    );
  }

  const onAddCard = () => {
    navigation.navigate('AddPayment');
    setTimeout(() => {
      setIsPaymentsVariantsVisible(false);
    }, 50);
  };

  return (
    <View style={[styles.wallet, computedStyles.wallet]}>
      <SafeAreaView>
        <View style={styles.header}>
          <ButtonV1 onPress={navigation.goBack} shape={ButtonV1Shapes.Circle}>
            <ShortArrowIcon />
          </ButtonV1>
          <Text style={styles.headerTitle}>{t('menu_Wallet_headerTitle')}</Text>
          <View style={styles.headerDummy} />
        </View>
        <View style={styles.totalsWrapper}>
          <View style={styles.balanceWrapper}>
            <Bar style={styles.balance}>
              <View>
                <Text style={[styles.balanceTitle, computedStyles.balanceTitle]}>{t('menu_Wallet_balance')}</Text>
                <Text style={styles.balanceTotal}>${balance}</Text>
              </View>
              <Separator mode="vertical" style={styles.verticalSeparator} />
              <View>
                <Text style={[styles.balanceTitle, computedStyles.balanceTitle]}>{t('menu_Wallet_coinBalance')}</Text>
                <Text style={styles.balanceTotal}>123</Text>
              </View>
            </Bar>
          </View>
          <View style={styles.tripsWrapper}>
            <Bar style={styles.trips}>
              <View>
                <Text style={[styles.tripsTitle, computedStyles.tripsTitle]}>{t('menu_Wallet_trips')}</Text>
                <Text style={styles.tripsTotal}>242</Text>
              </View>
            </Bar>
          </View>
        </View>
        <View style={styles.mainContent}>
          <View style={styles.payment}>
            {selectedPaymentMethod?.method && (
              <Pressable onPress={() => setIsPaymentsVariantsVisible(prevState => !prevState)}>
                <Bar style={styles.selectedMethod}>
                  <View style={styles.selectedMethodWrapper}>
                    {getPaymentIcon(selectedPaymentMethod.method)}
                    <Text style={styles.details}>**** {selectedPaymentMethod.details}</Text>
                  </View>
                  {isPaymentsVariantsVisible ? (
                    <Animated.View
                      entering={FadeIn.duration(fadeAnimationDuration)}
                      exiting={FadeOut.duration(fadeAnimationDuration)}
                      key="active"
                    >
                      <DropDownIcon mode="filled" style={{ transform: [{ rotate: '90deg' }] }} />
                    </Animated.View>
                  ) : (
                    <Animated.View
                      entering={FadeIn.duration(fadeAnimationDuration)}
                      exiting={FadeOut.duration(fadeAnimationDuration)}
                      key="default"
                    >
                      <DropDownIcon />
                    </Animated.View>
                  )}
                </Bar>
              </Pressable>
            )}
          </View>
          <View style={styles.paymentVariants}>
            {isPaymentsVariantsVisible && (
              <Animated.View
                entering={FadeIn.duration(fadeAnimationDuration)}
                exiting={FadeOut.duration(fadeAnimationDuration)}
              >
                <Bar style={styles.bar}>
                  <ScrollViewWithCustomScroll
                    wrapperStyle={styles.paymentScrollViewWrapper}
                    style={styles.paymentScrollView}
                    contentContainerStyle={styles.paymentScrollViewContainer}
                  >
                    {paymentMethodsContent}
                  </ScrollViewWithCustomScroll>
                  <ButtonV1 mode={ButtonV1Modes.Mode4} style={styles.button} onPress={onAddCard}>
                    <PlusIcon />
                  </ButtonV1>
                </Bar>
              </Animated.View>
            )}
          </View>
          <Separator style={styles.mainHorizontalSeparator} />
          {history}
        </View>
      </SafeAreaView>
      <BottomWindow style={styles.bottomWindow}>
        <ButtonV1 text={t('menu_Wallet_withdrawButton')} onPress={() => navigation.navigate('Withdraw')} />
      </BottomWindow>
    </View>
  );
};

const styles = StyleSheet.create({
  wallet: {
    flex: 1,
  },
  mainContent: {
    position: 'relative',
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  headerTitle: {
    fontFamily: 'Inter Medium',
    fontSize: 18,
  },
  headerDummy: {
    width: 50,
  },
  bar: {
    paddingTop: 0,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  totalsWrapper: {
    flexDirection: 'row',
    gap: 15,
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  balanceWrapper: {
    flex: 2,
  },
  balance: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  balanceTitle: {
    fontFamily: 'Inter Medium',
    fontSize: 12,
  },
  balanceTotal: {
    fontFamily: 'Inter Medium',
  },
  tripsWrapper: {
    flex: 1,
  },
  trips: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tripsTitle: {
    fontFamily: 'Inter Medium',
    fontSize: 12,
  },
  tripsTotal: {
    fontFamily: 'Inter Medium',
  },
  selectedMethodContainer: {
    flex: 1,
  },
  selectedMethod: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  selectedMethodWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  details: {
    fontFamily: 'Inter Medium',
    fontSize: 18,
  },
  mainHorizontalSeparator: {
    marginTop: 30,
    marginBottom: 40,
    flex: 0,
  },
  historyTitle: {
    fontFamily: 'Inter Medium',
    fontSize: 18,
    marginBottom: 14,
  },
  scrollView: {
    marginVertical: 0,
  },
  contentContainer: {
    paddingVertical: 0,
  },
  payment: {
    position: 'relative',
    zIndex: 3,
  },
  paymentVariants: {
    position: 'absolute',
    top: 72,
    left: 0,
    right: 0,
    paddingHorizontal: 10,
    zIndex: 2,
  },
  button: {
    paddingVertical: 14,
  },
  history: {
    flex: 1,
    zIndex: 1,
  },
  bottomWindow: {
    position: 'relative',
  },
  paymentScrollViewWrapper: {
    flex: 0,
    maxHeight: 250,
  },
  paymentScrollView: {
    marginVertical: 0,
  },
  paymentScrollViewContainer: {
    paddingVertical: 0,
  },
  verticalSeparator: {
    flex: 0,
  },
});

export default WalletScreen;
