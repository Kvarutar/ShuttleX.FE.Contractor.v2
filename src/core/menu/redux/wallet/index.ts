import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { WithdrawalHistory } from '../../../../screens/menu/wallet/WalletScreen/types';
import {
  addAvailablePaymentMethod,
  getAvailablePaymentMethods,
  getEmailOrBinanceId,
  getTokensAmount,
  getTripsAmount,
  getWalletCashBalance,
  getWalletCryptoBalance,
  getWithdrawalCashHistory,
  getWithdrawalCryptoHistory,
  removePaymentMethod,
  sendCryptoEmailOrBinanceId,
  sendSelectedPaymentMethod,
} from './thunks';
import {
  CurrencySigns,
  EmailOrBinanceId,
  PaymentMethodWithoutExpiresAt,
  WalletBalanceAPIResponse,
  WalletState,
} from './types';

const initialState: WalletState = {
  balances: {
    cash: {
      balance: {
        monday: 0,
        tuesday: 0,
        wednesday: 0,
        thursday: 0,
        friday: 0,
        saturday: 0,
        sunday: 0,
      },
      currency: {
        symbol: '',
        sign: '',
      },
      minWithdrawSum: 100,
    },
    crypto: {
      balance: {
        monday: 0,
        tuesday: 0,
        wednesday: 0,
        thursday: 0,
        friday: 0,
        saturday: 0,
        sunday: 0,
      },
      currency: {
        symbol: '',
        sign: '',
      },
      minWithdrawSum: 0.0000001,
    },
  },
  payment: {
    cash: {
      selectedMethod: null,
      avaliableMethods: [],
      withdrawalHistory: [],
    },
    crypto: {
      emailOrID: null,
      withdrawalHistory: [],
    },
  },
  tokensAmount: 0,
  tripsAmount: 0,
};

const slice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setBalanceCash(state, action: PayloadAction<WalletBalanceAPIResponse>) {
      state.balances.cash.balance = action.payload;
    },
    setCryptoBalance(state, action: PayloadAction<WalletBalanceAPIResponse>) {
      state.balances.crypto.balance = action.payload;
    },
    setCurrencyCash(state, action: PayloadAction<CurrencySigns>) {
      state.balances.cash.currency = action.payload;
    },
    setCurrencyCrypto(state, action: PayloadAction<CurrencySigns>) {
      state.balances.crypto.currency = action.payload;
    },
    setSelectedPaymentMethod(state, action: PayloadAction<PaymentMethodWithoutExpiresAt>) {
      state.payment.cash.selectedMethod = action.payload;
    },
    setWithdrawalCashHistoryList(state, action: PayloadAction<WithdrawalHistory[]>) {
      state.payment.cash.withdrawalHistory = action.payload;
    },
    setWithdrawalCryptoHistoryList(state, action: PayloadAction<WithdrawalHistory[]>) {
      state.payment.crypto.withdrawalHistory = action.payload;
    },
    setAvaliablePaymentMethods(state, action: PayloadAction<PaymentMethodWithoutExpiresAt[]>) {
      state.payment.cash.avaliableMethods = action.payload;
    },
    setTokensAmount(state, action: PayloadAction<number>) {
      state.tokensAmount = action.payload;
    },
    setTripsAmount(state, action: PayloadAction<number>) {
      state.tripsAmount = action.payload;
    },
    setEmailOrBinanceId(state, action: PayloadAction<EmailOrBinanceId>) {
      state.payment.crypto.emailOrID = action.payload;
    },
    setMinWithdrawSumCash(state, action: PayloadAction<number>) {
      state.balances.cash.minWithdrawSum = action.payload;
    },
    setMinWithdrawSumCrypto(state, action: PayloadAction<number>) {
      state.balances.crypto.minWithdrawSum = action.payload;
    },
  },

  extraReducers: builder =>
    builder
      .addCase(getWalletCashBalance.fulfilled, (state, action) => {
        slice.caseReducers.setBalanceCash(state, {
          payload: action.payload.balance,
          type: setBalanceCash.type,
        });
        slice.caseReducers.setCurrencyCash(state, {
          payload: action.payload.currency,
          type: setCurrencyCash.type,
        });
        slice.caseReducers.setMinWithdrawSumCash(state, {
          payload: action.payload.minWithdrawSum,
          type: setMinWithdrawSumCash.type,
        });
      })
      .addCase(getWalletCryptoBalance.fulfilled, (state, action) => {
        slice.caseReducers.setCryptoBalance(state, {
          payload: action.payload.balance,
          type: setCryptoBalance.type,
        });
        slice.caseReducers.setCurrencyCrypto(state, {
          payload: action.payload.currency,
          type: setCurrencyCrypto.type,
        });
        slice.caseReducers.setMinWithdrawSumCrypto(state, {
          payload: action.payload.minWithdrawSum,
          type: setMinWithdrawSumCrypto.type,
        });
      })
      .addCase(getTokensAmount.fulfilled, (state, action) => {
        slice.caseReducers.setTokensAmount(state, {
          payload: action.payload,
          type: setTokensAmount.type,
        });
      })
      .addCase(getTripsAmount.fulfilled, (state, action) => {
        slice.caseReducers.setTripsAmount(state, {
          payload: action.payload,
          type: setTripsAmount.type,
        });
      })
      .addCase(getAvailablePaymentMethods.fulfilled, (state, action) => {
        slice.caseReducers.setAvaliablePaymentMethods(state, {
          payload: action.payload,
          type: setAvaliablePaymentMethods.type,
        });
      })
      .addCase(addAvailablePaymentMethod.fulfilled, (state, action) => {
        const cardData = action.payload;
        const cardSafeNumber = cardData.number.split(' ');
        const newCard: PaymentMethodWithoutExpiresAt = {
          method: cardData.type ?? 'unknown',
          details: cardSafeNumber[cardSafeNumber.length - 1],
        };
        slice.caseReducers.setAvaliablePaymentMethods(state, {
          payload: [newCard, ...state.payment.cash.avaliableMethods],
          type: setAvaliablePaymentMethods.type,
        });
        slice.caseReducers.setSelectedPaymentMethod(state, {
          payload: newCard,
          type: setAvaliablePaymentMethods.type,
        });
      })
      .addCase(sendSelectedPaymentMethod.fulfilled, (state, action) => {
        if (action.payload) {
          slice.caseReducers.setSelectedPaymentMethod(state, {
            payload: action.meta.arg.method,
            type: setAvaliablePaymentMethods.type,
          });
        }
      })
      .addCase(sendCryptoEmailOrBinanceId.fulfilled, (state, action) => {
        if (action.payload) {
          slice.caseReducers.setEmailOrBinanceId(state, {
            payload: action.meta.arg.emailOrBinanceId,
            type: setEmailOrBinanceId.type,
          });
        }
      })
      .addCase(getWithdrawalCashHistory.fulfilled, (state, action) => {
        slice.caseReducers.setWithdrawalCashHistoryList(state, {
          payload: action.payload,
          type: setWithdrawalCashHistoryList.type,
        });
      })
      .addCase(getWithdrawalCryptoHistory.fulfilled, (state, action) => {
        slice.caseReducers.setWithdrawalCryptoHistoryList(state, {
          payload: action.payload,
          type: setWithdrawalCryptoHistoryList.type,
        });
      })
      .addCase(getEmailOrBinanceId.fulfilled, (state, action) => {
        slice.caseReducers.setEmailOrBinanceId(state, {
          payload: action.payload,
          type: setEmailOrBinanceId.type,
        });
      })
      .addCase(removePaymentMethod.fulfilled, (state, action) => {
        slice.caseReducers.setAvaliablePaymentMethods(state, {
          payload: action.payload,
          type: setAvaliablePaymentMethods.type,
        });
        const isRemovedSelectedMethod = !action.payload.some(
          method =>
            method.details === state.payment.cash.selectedMethod?.details &&
            method.method === state.payment.cash.selectedMethod.method,
        );
        if (isRemovedSelectedMethod && action.payload.length > 0) {
          setSelectedPaymentMethod(action.payload[0]);
        }
      }),
});

export const {
  setBalanceCash,
  setCurrencyCash,
  setCryptoBalance,
  setCurrencyCrypto,
  setSelectedPaymentMethod,
  setEmailOrBinanceId,
  setAvaliablePaymentMethods,
  setWithdrawalCashHistoryList,
  setWithdrawalCryptoHistoryList,
  setTokensAmount,
  setTripsAmount,
  setMinWithdrawSumCash,
  setMinWithdrawSumCrypto,
} = slice.actions;

export default slice.reducer;
