import { createSelector } from '@reduxjs/toolkit';

import { AppState } from '../../../redux/store';
// Cash
export const walletCashBalanceSelector = (state: AppState) => state.wallet.balances.cash.balance;
export const currencySymbolCashBalanceSelector = (state: AppState) => state.wallet.balances.cash.currency.symbol ?? '';
export const currencySignCashBalanceSelector = (state: AppState) => state.wallet.balances.cash.currency.sign ?? '';
export const totalWalletCashBalanceSelector = createSelector([walletCashBalanceSelector], balance =>
  Object.values(balance).reduce((total, dayBalance) => total + dayBalance, 0),
);
export const withdrawalCashHistoryListSelector = (state: AppState) => state.wallet.payment.cash.withdrawalHistory;
// Crypto
export const walletCryptoBalanceSelector = (state: AppState) => state.wallet.balances.crypto.balance;
export const currencySymbolCryptoBalanceSelector = (state: AppState) =>
  state.wallet.balances.crypto.currency.symbol ?? '';
export const currencySignCryptoBalanceSelector = (state: AppState) => state.wallet.balances.crypto.currency.sign ?? '';
export const totalWalletCryptoBalanceSelector = createSelector([walletCryptoBalanceSelector], balance =>
  Object.values(balance).reduce((total, dayBalance) => total + dayBalance, 0),
);
export const withdrawalCryptoHistoryListSelector = (state: AppState) => state.wallet.payment.crypto.withdrawalHistory;
// Unique
export const tokensAmountSelector = (state: AppState) => state.wallet.tokensAmount;
export const tripsAmountSelector = (state: AppState) => state.wallet.tripsAmount;
export const selectedPaymentMethodSelector = (state: AppState) => state.wallet.payment.cash.selectedMethod;
export const avaliablePaymentMethodsListSelector = (state: AppState) => state.wallet.payment.cash.avaliableMethods;
export const emailOrBinanceIdCryptoSelector = (state: AppState) => state.wallet.payment.crypto.emailOrID;
export const minWithdrawSumCashSelector = (state: AppState) => state.wallet.balances.cash.minWithdrawSum;
export const minWithdrawSumCryptoSelector = (state: AppState) => state.wallet.balances.crypto.minWithdrawSum;
