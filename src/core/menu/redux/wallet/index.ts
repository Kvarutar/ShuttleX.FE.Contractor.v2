import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PaymentMethod } from 'shuttlex-integration';

import { WalletState } from './types';

const initialState: WalletState = {
  balance: 0,
  payment: {
    selectedMethod: null,
    avaliableMethods: [],
  },
};

const slice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setBalance(state, action: PayloadAction<number>) {
      state.balance = action.payload;
    },
    setSelectedPaymentMethod(state, action: PayloadAction<PaymentMethod>) {
      state.payment.selectedMethod = action.payload;
    },
    setAvaliablePaymentMethods(state, action: PayloadAction<PaymentMethod[]>) {
      state.payment.avaliableMethods = action.payload;
    },
    addAvaliablePaymentMethod(state, action: PayloadAction<PaymentMethod>) {
      state.payment.avaliableMethods.unshift(action.payload);
    },
  },
});

export const { setBalance, setSelectedPaymentMethod, setAvaliablePaymentMethods, addAvaliablePaymentMethod } =
  slice.actions;

export default slice.reducer;
