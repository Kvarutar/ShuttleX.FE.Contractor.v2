import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { WithdrawalHistory } from '../../../../screens/menu/wallet/WalletScreen/props';
import {
  addAvailablePaymentMethod,
  getAvailablePaymentMethods,
  getTokensAmount,
  getTripsAmount,
  getWalletBalance,
  getWithdrawalHistory,
  removePaymentMethod,
  sendSelectedPaymentMethod,
} from './thunks';
import { PaymentMethodWithoutExpiresAt, WalletBalanceAPIResponse, WalletState } from './types';

const initialState: WalletState = {
  balance: {
    monday: 0,
    tuesday: 0,
    wednesday: 0,
    thursday: 0,
    friday: 0,
    saturday: 0,
    sunday: 0,
  },
  payment: {
    selectedMethod: null,
    avaliableMethods: [],
    withdrawalHistory: [],
  },
  tokensAmount: 0,
  tripsAmount: 0,
};

const slice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setBalance(state, action: PayloadAction<WalletBalanceAPIResponse>) {
      state.balance = action.payload;
    },
    setSelectedPaymentMethod(state, action: PayloadAction<PaymentMethodWithoutExpiresAt>) {
      state.payment.selectedMethod = action.payload;
    },
    setWithdrawalHistoryList(state, action: PayloadAction<WithdrawalHistory[]>) {
      state.payment.withdrawalHistory = action.payload;
    },
    setAvaliablePaymentMethods(state, action: PayloadAction<PaymentMethodWithoutExpiresAt[]>) {
      state.payment.avaliableMethods = action.payload;
    },
    setTokensAmount(state, action: PayloadAction<number>) {
      state.tokensAmount = action.payload;
    },
    setTripsAmount(state, action: PayloadAction<number>) {
      state.tripsAmount = action.payload;
    },
  },

  extraReducers: builder =>
    builder
      .addCase(getWalletBalance.fulfilled, (state, action) => {
        slice.caseReducers.setBalance(state, {
          payload: action.payload,
          type: setBalance.type,
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
          payload: [newCard, ...state.payment.avaliableMethods],
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
      .addCase(getWithdrawalHistory.fulfilled, (state, action) => {
        slice.caseReducers.setWithdrawalHistoryList(state, {
          payload: action.payload,
          type: setWithdrawalHistoryList.type,
        });
      })
      .addCase(removePaymentMethod.fulfilled, (state, action) => {
        slice.caseReducers.setAvaliablePaymentMethods(state, {
          payload: action.payload,
          type: setAvaliablePaymentMethods.type,
        });
        const isRemovedSelectedMethod = !action.payload.some(
          method =>
            method.details === state.payment.selectedMethod?.details &&
            method.method === state.payment.selectedMethod.method,
        );
        if (isRemovedSelectedMethod && action.payload.length > 0) {
          state.payment.selectedMethod = action.payload[0];
        }
      }),
});

export const {
  setBalance,
  setSelectedPaymentMethod,
  setAvaliablePaymentMethods,
  setWithdrawalHistoryList,
  setTokensAmount,
  setTripsAmount,
} = slice.actions;

export default slice.reducer;
