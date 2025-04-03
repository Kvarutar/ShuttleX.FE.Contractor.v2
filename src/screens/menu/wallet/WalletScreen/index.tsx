import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Shadow } from 'react-native-shadow-2';
import { useSelector } from 'react-redux';
import {
  ArrowInPrimaryColorIcon,
  Button,
  ButtonSizes,
  CircleButtonModes,
  defaultShadow,
  getPaymentIcon,
  GroupedButtons,
  GroupedButtonsMode,
  IS_ANDROID,
  MenuHeader,
  SafeAreaView,
  ScrollViewWithCustomScroll,
  sizes,
  SquareButtonModes,
  Text,
  useTheme,
  WINDOW_WIDTH,
} from 'shuttlex-integration';

import { setSelectedPaymentMethod } from '../../../../core/menu/redux/wallet';
import {
  avaliablePaymentMethodsListSelector,
  currencySignCashBalanceSelector,
  currencySignCryptoBalanceSelector,
  currencySymbolCashBalanceSelector,
  emailOrBinanceIdCryptoSelector,
  minWithdrawSumCashSelector,
  minWithdrawSumCryptoSelector,
  selectedPaymentMethodSelector,
  totalWalletCashBalanceSelector,
  totalWalletCryptoBalanceSelector,
  walletCashBalanceSelector,
  walletCryptoBalanceSelector,
  withdrawalCashHistoryListSelector,
  withdrawalCryptoHistoryListSelector,
} from '../../../../core/menu/redux/wallet/selectors';
import { getWalletStatistic } from '../../../../core/menu/redux/wallet/thunks';
import { useAppDispatch } from '../../../../core/redux/hooks';
import Menu from '../../../ride/Menu';
import AddCardPopup from '../popups/AddCardPopup';
import AddCryptoMethodPopup from '../popups/AddCryptoMethodPopup';
import PaymentMethodPopup from '../popups/PaymentMethodPopup';
import BalancePerDayBlock from './BalancePerDayBlock';
import BalancePerDayText from './BalancePerDayText';
import { WalletScreenProps, СurrentBalanceInfo } from './types';
import WithdrawalHistoryItem from './WithdrawalHistoryItem';

const WalletScreen = ({ navigation }: WalletScreenProps): JSX.Element => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();

  const [isSelectedCash, setIsSelectedCash] = useState<boolean>(true);

  const balanceCash = useSelector(walletCashBalanceSelector);
  const currencyCashSymbol = useSelector(currencySymbolCashBalanceSelector);
  const currencyCashSign = useSelector(currencySignCashBalanceSelector);
  const totalBalanceCash = useSelector(totalWalletCashBalanceSelector);
  const withdrawalCashHistory = useSelector(withdrawalCashHistoryListSelector);
  const minWithdrawSumCash = useSelector(minWithdrawSumCashSelector);

  const balanceCrypto = useSelector(walletCryptoBalanceSelector);
  const currencyCryptoSign = useSelector(currencySignCryptoBalanceSelector);
  const totalBalanceCrypto = useSelector(totalWalletCryptoBalanceSelector);
  const withdrawalCryptoHistory = useSelector(withdrawalCryptoHistoryListSelector);
  const minWithdrawSumCrypto = useSelector(minWithdrawSumCryptoSelector);

  const currentWalletInfo: СurrentBalanceInfo = useMemo(() => {
    const current = {
      balance: balanceCrypto,
      currency: currencyCryptoSign,
      totalBalance: totalBalanceCrypto,
      withdrawalHistory: withdrawalCryptoHistory,
      currencySign: currencyCryptoSign,
      minWithdrawSum: minWithdrawSumCrypto,
    };
    if (isSelectedCash) {
      current.balance = balanceCash;
      current.currency = currencyCashSymbol;
      current.totalBalance = totalBalanceCash;
      current.withdrawalHistory = withdrawalCashHistory;
      current.currencySign = currencyCashSign;
      current.minWithdrawSum = minWithdrawSumCash;
    }
    return current;
  }, [
    isSelectedCash,
    balanceCrypto,
    balanceCash,
    currencyCryptoSign,
    currencyCashSign,
    currencyCashSymbol,
    totalBalanceCrypto,
    totalBalanceCash,
    withdrawalCryptoHistory,
    withdrawalCashHistory,
    minWithdrawSumCash,
    minWithdrawSumCrypto,
  ]);

  const selectedPaymentMethod = useSelector(selectedPaymentMethodSelector);
  const availablePaymentMethods = useSelector(avaliablePaymentMethodsListSelector);
  const emailOrIdCrypto = useSelector(emailOrBinanceIdCryptoSelector);

  // Removed from render part in Task-263
  // TODO: Uncomment this components when work with trips or tokens amount
  // const tokensAmount = useSelector(tokensAmountSelector);
  // const tripsAmount = useSelector(tripsAmountSelector);

  const [isPaymentsVariantsVisible, setIsPaymentsVariantsVisible] = useState(false);
  const [isAddCardPopupVisible, setIsAddCardPopupVisible] = useState(false);
  const [isAddCryptoMethodPopupVisible, setIsAddCryptoMethodPopupVisible] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState<boolean>(false);

  const maxSum = Math.max(...Object.values(currentWalletInfo.balance));
  const isTotalBalanceLessThanMinSum = currentWalletInfo.totalBalance < currentWalletInfo.minWithdrawSum;

  const dayTitles: Record<keyof typeof currentWalletInfo.balance, string> = {
    monday: 'menu_Wallet_monday',
    tuesday: 'menu_Wallet_tuesday',
    wednesday: 'menu_Wallet_wednesday',
    thursday: 'menu_Wallet_thursday',
    friday: 'menu_Wallet_friday',
    saturday: 'menu_Wallet_saturday',
    sunday: 'menu_Wallet_sunday',
  };

  useEffect(() => {
    //for test
    (async () => {
      dispatch(getWalletStatistic({ contractorId: '' }));
    })();
  }, [dispatch]);

  //TODO: Change selected method setting when work with "redux persist store"
  useEffect(() => {
    dispatch(setSelectedPaymentMethod(availablePaymentMethods[0]));
  }, [dispatch, availablePaymentMethods]);

  const computedStyles = StyleSheet.create({
    safeAreaWrapper: {
      backgroundColor: colors.primaryColor,
    },
    safeAreaContainer: {
      paddingTop: IS_ANDROID ? sizes.paddingVertical : undefined,
    },
    balanceTotal: {
      color: colors.textPrimaryColor,
    },
    balanceTitle: {
      color: colors.textPrimaryColor,
    },
    mainContent: {
      backgroundColor: colors.backgroundSecondaryColor,
      paddingBottom: insets.bottom === 0 ? sizes.paddingVertical / 2 : insets.bottom,
    },
    tokensAndTrips: {
      backgroundColor: colors.backgroundPrimaryColor,
    },
    tokensAndTripsCounter: {
      color: colors.textPrimaryColor,
    },
    tokensAndTripsTitle: {
      color: colors.textQuadraticColor,
    },
    selectedMethod: {
      backgroundColor: colors.backgroundPrimaryColor,
    },
    detailsStars: {
      color: colors.textQuadraticColor,
    },
    addCardText: {
      color: colors.textPrimaryColor,
    },
    withdrawButton: {
      borderColor: colors.borderColor,
      borderWidth: isTotalBalanceLessThanMinSum ? 1 : 0,
    },
    withdrawButtonText: {
      color: isTotalBalanceLessThanMinSum ? colors.textQuadraticColor : colors.textPrimaryColor,
    },
  });

  let history = null;

  if (currentWalletInfo.withdrawalHistory.length > 0) {
    const withdrawalHistoryItems = currentWalletInfo.withdrawalHistory.map(historyItem => (
      <WithdrawalHistoryItem
        key={historyItem.date}
        withdrawalHistoryItem={historyItem}
        itemCurrency={isSelectedCash ? currentWalletInfo.currency : currentWalletInfo.currency + ' '}
      />
    ));

    history = (
      <>
        <Text style={styles.historyTitle}>{t('menu_Wallet_historyTitle')}</Text>
        <ScrollViewWithCustomScroll style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
          {withdrawalHistoryItems}
        </ScrollViewWithCustomScroll>
      </>
    );
  }

  const formatNumberWithCommas = (num: number): string => {
    const [integerPart, decimalPart] = num.toFixed(2).split('.');
    const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    return decimalPart ? `${formattedIntegerPart}.${decimalPart}` : formattedIntegerPart;
  };

  const onPaymentBarPress = () => {
    if (isSelectedCash) {
      setIsPaymentsVariantsVisible(prevState => !prevState);
    } else {
      setIsAddCryptoMethodPopupVisible(true);
    }
  };

  const onWithdraw = () => {
    if (isTotalBalanceLessThanMinSum) {
      Alert.alert(
        t('menu_Wallet_alertTitle'),
        t('menu_Wallet_alertDescription', { minWithdrawSum: currentWalletInfo.minWithdrawSum }),
      );
      return;
    }
    navigation.navigate('Withdraw', {
      selectedTotalBalance: currentWalletInfo.totalBalance,
      currencySign: currentWalletInfo.currencySign ?? '',
      withdrawType: isSelectedCash ? 'cash' : 'crypto',
    });
  };

  const paymentBarInfo = () => {
    if (isSelectedCash) {
      if (selectedPaymentMethod?.method) {
        return (
          <>
            {getPaymentIcon(selectedPaymentMethod?.method === 'unknown' ? 'card' : selectedPaymentMethod.method)}
            <View style={styles.detailsWrapper}>
              <Text style={[styles.detailsStars, computedStyles.detailsStars]}>****</Text>
              <Text style={styles.details}>{selectedPaymentMethod.details}</Text>
            </View>
          </>
        );
      }
      return (
        <>
          {getPaymentIcon('card')}
          <Text style={[styles.addCardText, computedStyles.addCardText]}>{t('menu_Wallet_AddCard')}</Text>
        </>
      );
    } else {
      if (emailOrIdCrypto) {
        return <Text>{emailOrIdCrypto}</Text>;
      }
      return (
        <Text style={[styles.addCardText, computedStyles.addCardText]}>{t('menu_Wallet_AddEmailOrBinanceID')}</Text>
      );
    }
  };

  return (
    <View style={styles.wallet}>
      <SafeAreaView
        wrapperStyle={computedStyles.safeAreaWrapper}
        containerStyle={[styles.safeAreaWrapper, computedStyles.safeAreaContainer]}
      >
        <MenuHeader
          leftButtonProps={{
            mode: CircleButtonModes.Mode1,
            size: ButtonSizes.S,
            disableShadow: true,
            circleSubContainerStyle: styles.circleSubContainerStyle,
          }}
          onMenuPress={() => setIsMenuVisible(true)}
        >
          <GroupedButtons
            setIsFirstButtonSelected={setIsSelectedCash}
            isFirstButtonSelected={isSelectedCash}
            width={WINDOW_WIDTH * 0.65}
            firstButtonText={t('menu_Wallet_groupedButtonsFirstText')}
            secondButtonText={t('menu_Wallet_groupedButtonsSecondText')}
            mode={GroupedButtonsMode.Dark}
          />
        </MenuHeader>
        <View style={styles.totalsWrapper}>
          <View style={styles.balanceTotalContainer}>
            <Text style={styles.balanceTotalCurrency}>
              {currentWalletInfo.currency}
              {!isSelectedCash ? ' ' : ''}
            </Text>
            <Text style={[styles.balanceTotal, computedStyles.balanceTotal]}>
              {currentWalletInfo.totalBalance > 1
                ? formatNumberWithCommas(currentWalletInfo.totalBalance)
                : currentWalletInfo.totalBalance}
            </Text>
          </View>
          <Text style={[styles.balanceTitle, computedStyles.balanceTitle]}>{t('menu_Wallet_balance')}</Text>
        </View>
        <View style={styles.balancePerDay}>
          <View style={styles.balancePerDayBlocks}>
            {Object.entries(currentWalletInfo.balance).map(([dayTitle, sumPerDay]) => (
              <BalancePerDayBlock key={dayTitle} sumPerDay={sumPerDay} maxSum={maxSum > 0 ? maxSum : 0} />
            ))}
          </View>
          <View style={styles.balancePerDayBlocks}>
            {(Object.keys(currentWalletInfo.balance) as (keyof typeof currentWalletInfo.balance)[]).map(dayTitle => (
              <BalancePerDayText
                key={dayTitle}
                title={t(dayTitles[dayTitle])}
                sumPerDay={currentWalletInfo.balance[dayTitle]}
              />
            ))}
          </View>
        </View>
      </SafeAreaView>
      <View style={[styles.mainContent, computedStyles.mainContent]}>
        <View style={styles.paymentAndTokensWrapper}>
          {/* Removed from render part in Task-263 */}
          {/* TODO: Uncomment this components when work with trips or tokens amount */}

          {/* <Shadow {...defaultShadow(colors.strongShadowColor)} style={styles.mainContentShadow}>
            <View style={[styles.tokensAndTrips, computedStyles.tokensAndTrips]}>
              <View style={styles.tokensAndTripsTextsWrapper}>
                <Text style={[styles.tokensAndTripsCounter, computedStyles.tokensAndTripsCounter]}>{tokensAmount}</Text>
                <Text style={[styles.tokensAndTripsTitle, computedStyles.tokensAndTripsTitle]}>
                  {t('menu_Wallet_tokensBalance')}
                </Text>
              </View>
              <Separator mode="vertical" style={styles.separatorVertical} />
              <View style={styles.tokensAndTripsTextsWrapper}>
                <Text style={[styles.tokensAndTripsCounter, computedStyles.tokensAndTripsCounter]}>{tripsAmount}</Text>
                <Text style={[styles.tokensAndTripsTitle, computedStyles.tokensAndTripsTitle]}>
                  {t('menu_Wallet_trips')}
                </Text>
              </View>
            </View>
          </Shadow> */}

          <Shadow {...defaultShadow(colors.strongShadowColor)} style={styles.mainContentShadow}>
            <Pressable onPress={onPaymentBarPress}>
              <View style={[styles.selectedMethod, computedStyles.selectedMethod]}>
                <View style={styles.selectedMethodWrapper}>{paymentBarInfo()}</View>
                <ArrowInPrimaryColorIcon />
              </View>
            </Pressable>
          </Shadow>
        </View>
        <View style={styles.history}>{history}</View>
        <Button
          text={t('menu_Wallet_withdrawButton')}
          mode={isTotalBalanceLessThanMinSum ? SquareButtonModes.Mode5 : SquareButtonModes.Mode1}
          textStyle={computedStyles.withdrawButtonText}
          style={computedStyles.withdrawButton}
          onPress={onWithdraw}
        />
      </View>
      {isPaymentsVariantsVisible && (
        <PaymentMethodPopup
          setIsPaymentsVariantsVisible={setIsPaymentsVariantsVisible}
          onOpenAddCardPopup={() => setIsAddCardPopupVisible(true)}
        />
      )}
      {isAddCardPopupVisible && (
        <AddCardPopup
          setIsAddCardPopupVisible={setIsAddCardPopupVisible}
          setIsPaymentsVariantsVisible={setIsPaymentsVariantsVisible}
        />
      )}
      {isAddCryptoMethodPopupVisible && (
        <AddCryptoMethodPopup setIsAddCryptoMethodPopupVisible={setIsAddCryptoMethodPopupVisible} />
      )}
      {isMenuVisible && <Menu onClose={() => setIsMenuVisible(false)} />}
    </View>
  );
};

const styles = StyleSheet.create({
  safeAreaWrapper: {
    paddingBottom: 44,
  },
  wallet: {
    flex: 1,
  },
  circleSubContainerStyle: {
    borderColor: '#0707071A', //TODO: Check on dark theme
  },
  headerTitle: {
    fontFamily: 'Inter Medium',
    fontSize: 17,
    lineHeight: 22,
  },
  totalsWrapper: {
    alignItems: 'center',
    gap: 4,
    marginTop: 28,
    marginBottom: 24,
  },
  balanceTotalContainer: {
    flexDirection: 'row',
  },
  // TODO: Check "color" on dark theme
  balanceTotalCurrency: {
    fontFamily: 'Inter Bold',
    fontSize: 32,
    letterSpacing: -0.64,
    alignSelf: 'center',
    color: '#7C9718', // This color is used only here
  },
  balanceTotal: {
    fontFamily: 'Inter Bold',
    fontSize: 32,
    letterSpacing: -0.64,
    alignSelf: 'center',
  },
  balanceTitle: {
    fontFamily: 'Inter Medium',
    fontSize: 17,
    lineHeight: 20,
    letterSpacing: -0.48,
    alignSelf: 'center',
    opacity: 0.4,
  },
  balancePerDay: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 4,
    gap: 10,
  },
  balancePerDayBlocks: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: 10,
  },
  scrollView: {
    marginVertical: 0,
  },
  contentContainer: {
    paddingVertical: 0,
  },
  mainContent: {
    flex: 1,
    maxHeight: '45%',
    paddingHorizontal: sizes.paddingHorizontal,
  },
  paymentAndTokensWrapper: {
    top: -32,
    gap: 8,
  },
  mainContentShadow: {
    alignSelf: 'stretch',
  },
  tokensAndTrips: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 18,
    borderRadius: 12,
  },
  tokensAndTripsTextsWrapper: {
    flex: 1,
    gap: 4,
    paddingHorizontal: 28,
  },
  tokensAndTripsCounter: {
    fontFamily: 'Inter Medium',
    fontSize: 17,
    letterSpacing: -0.64,
    alignSelf: 'center',
  },
  tokensAndTripsTitle: {
    fontFamily: 'Inter Medium',
    fontSize: 12,
    letterSpacing: 0.48,
    alignSelf: 'center',
  },
  separatorVertical: {
    flex: 0,
  },
  selectedMethod: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingRight: 16,
    paddingLeft: 24,
    borderRadius: 12,
  },
  selectedMethodWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  detailsWrapper: {
    paddingTop: 4,
    flexDirection: 'row',
    gap: 4,
  },
  detailsStars: {
    paddingTop: 4,
    fontFamily: 'Inter Medium',
    fontSize: 17,
    lineHeight: 22,
    textAlignVertical: 'center',
  },
  details: {
    fontFamily: 'Inter Medium',
    fontSize: 17,
    lineHeight: 22,
  },
  addCardText: {
    fontFamily: 'Inter Medium',
    fontSize: 17,
    lineHeight: 22,
    opacity: 0.28,
  },
  historyTitle: {
    fontFamily: 'Inter Medium',
    fontSize: 18,
    marginBottom: 10,
  },
  history: {
    flex: 1,
    zIndex: 1,
  },
});

export default WalletScreen;
