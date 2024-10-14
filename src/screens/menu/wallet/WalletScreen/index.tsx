import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import { useSelector } from 'react-redux';
import {
  ArrowInPrimaryColorIcon,
  Button,
  ButtonSizes,
  CircleButtonModes,
  defaultShadow,
  getPaymentIcon,
  MenuHeader,
  SafeAreaView,
  ScrollViewWithCustomScroll,
  sizes,
  Text,
  useTheme,
} from 'shuttlex-integration';

import { setSelectedPaymentMethod } from '../../../../core/menu/redux/wallet';
import {
  avaliablePaymentMethodsListSelector,
  selectedPaymentMethodSelector,
  totalWalletBalanceSelector,
  walletBalanceSelector,
  withdrawalHistoryListSelector,
} from '../../../../core/menu/redux/wallet/selectors';
import { getWalletStatistic } from '../../../../core/menu/redux/wallet/thunks';
import { useAppDispatch } from '../../../../core/redux/hooks';
import Menu from '../../../ride/Menu';
import AddCardPopup from '../popups/AddCardPopup';
import PaymentMethodPopup from '../popups/PaymentMethodPopup';
import BalancePerDayBlock from './BalancePerDayBlock';
import BalancePerDayText from './BalancePerDayText';
import { WalletScreenProps } from './props';
import WithdrawalHistoryItem from './WithdrawalHistoryItem';

const currency = '₴';

const WalletScreen = ({ navigation }: WalletScreenProps): JSX.Element => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const balance = useSelector(walletBalanceSelector);
  const totalBalance = useSelector(totalWalletBalanceSelector);
  const selectedPaymentMethod = useSelector(selectedPaymentMethodSelector);
  const availablePaymentMethods = useSelector(avaliablePaymentMethodsListSelector);
  const withdrawalHistory = useSelector(withdrawalHistoryListSelector);
  // Removed from render part in Task-263
  // TODO: Uncomment this components when work with trips or tokens amount
  // const tokensAmount = useSelector(tokensAmountSelector);
  // const tripsAmount = useSelector(tripsAmountSelector);

  const [isPaymentsVariantsVisible, setIsPaymentsVariantsVisible] = useState(false);
  const [isAddCardPopupVisible, setIsAddCardPopupVisible] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState<boolean>(false);

  const maxSum = Math.max(...Object.values(balance).filter(sum => sum > 0));

  const dayTitles: Record<keyof typeof balance, string> = {
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
    balanceTotal: {
      color: colors.textPrimaryColor,
    },
    balanceTitle: {
      color: colors.textPrimaryColor,
    },
    mainContent: {
      backgroundColor: colors.backgroundSecondaryColor,
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
  });

  let history = null;

  if (withdrawalHistory.length > 0) {
    const withdrawalHistoryItems = withdrawalHistory.map(historyItem => (
      <WithdrawalHistoryItem key={historyItem.date} withdrawalHistoryItem={historyItem} />
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

  return (
    <View style={[styles.wallet]}>
      <SafeAreaView wrapperStyle={computedStyles.safeAreaWrapper} containerStyle={styles.safeAreaWrapper}>
        <MenuHeader
          leftButtonProps={{
            mode: CircleButtonModes.Mode1,
            size: ButtonSizes.S,
            disableShadow: true,
          }}
          onMenuPress={() => setIsMenuVisible(true)}
          onNotificationPress={() => {}}
        >
          <Text style={[styles.headerTitle]}>{t('menu_Wallet_headerTitle')}</Text>
        </MenuHeader>
        <View style={styles.totalsWrapper}>
          <Text style={[styles.balanceTotal, computedStyles.balanceTotal]}>
            {currency + formatNumberWithCommas(totalBalance)}
          </Text>
          <Text style={[styles.balanceTitle, computedStyles.balanceTitle]}>{t('menu_Wallet_balance')}</Text>
        </View>
        <View style={styles.balancePerDay}>
          <View style={styles.balancePerDayBlocks}>
            {Object.entries(balance).map(([dayTitle, sumPerDay]) => (
              <BalancePerDayBlock key={dayTitle} sumPerDay={sumPerDay} maxSum={maxSum} />
            ))}
          </View>
          <View style={styles.balancePerDayBlocks}>
            {(Object.keys(balance) as (keyof typeof balance)[]).map(dayTitle => (
              <BalancePerDayText key={dayTitle} title={t(dayTitles[dayTitle])} sumPerDay={balance[dayTitle]} />
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

          {selectedPaymentMethod?.method && (
            <Shadow {...defaultShadow(colors.strongShadowColor)} style={styles.mainContentShadow}>
              <Pressable onPress={() => setIsPaymentsVariantsVisible(prevState => !prevState)}>
                <View style={[styles.selectedMethod, computedStyles.selectedMethod]}>
                  <View style={styles.selectedMethodWrapper}>
                    {getPaymentIcon(selectedPaymentMethod.method)}
                    <View style={styles.detailsWrapper}>
                      <Text style={[styles.detailsStars, computedStyles.detailsStars]}>****</Text>
                      <Text style={styles.details}>{selectedPaymentMethod.details}</Text>
                    </View>
                  </View>
                  <ArrowInPrimaryColorIcon />
                </View>
              </Pressable>
            </Shadow>
          )}
        </View>
        <View style={styles.history}>{history}</View>
        <Button text={t('menu_Wallet_withdrawButton')} onPress={() => navigation.navigate('Withdraw')} />
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
  headerTitle: {
    fontFamily: 'Inter Medium',
    fontSize: 17,
    lineHeight: 22,
  },
  totalsWrapper: {
    gap: 4,
    marginTop: 28,
    marginBottom: 24,
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
    paddingBottom: 36,
    paddingHorizontal: sizes.paddingHorizontal,
  },
  paymentAndTokensWrapper: {
    top: -36,
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
