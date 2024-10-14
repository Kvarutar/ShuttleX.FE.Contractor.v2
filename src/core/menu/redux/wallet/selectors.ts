import { createSelector } from '@reduxjs/toolkit';

import { AppState } from '../../../redux/store';

export const walletBalanceSelector = (state: AppState) => state.wallet.balance;
export const totalWalletBalanceSelector = createSelector([walletBalanceSelector], balance =>
  Object.values(balance).reduce((total, dayBalance) => Number(total.toFixed(2)) + dayBalance, 0),
);
export const tokensAmountSelector = (state: AppState) => state.wallet.tokensAmount;
export const tripsAmountSelector = (state: AppState) => state.wallet.tripsAmount;
export const selectedPaymentMethodSelector = (state: AppState) => state.wallet.payment.selectedMethod;
export const avaliablePaymentMethodsListSelector = (state: AppState) => state.wallet.payment.avaliableMethods;
export const withdrawalHistoryListSelector = (state: AppState) => state.wallet.payment.withdrawalHistory;
