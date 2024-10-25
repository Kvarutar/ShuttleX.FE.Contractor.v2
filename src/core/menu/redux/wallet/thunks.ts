import { createAsyncThunk } from '@reduxjs/toolkit';
import { Card } from 'shuttlex-integration';

import { WithdrawalHistory } from '../../../../screens/menu/wallet/WalletScreen/types';
import { AppState } from '../../../redux/store';
import { CurrencySigns, EmailOrBinanceId, PaymentMethodWithoutExpiresAt, WalletBalanceAPIResponse } from './types';

//TODO: There's just example! Rewrite when info about it logic will be known
export const getWalletCashBalance = createAsyncThunk<
  { balance: WalletBalanceAPIResponse; currency: CurrencySigns },
  { contractorId: string }
>('wallet/getWalletCashBalance', async () => {
  //TODO: Add networking
  // try {
  //   return await shuttlexContractorInstance.get(`/statistic/contractor/${payload.contractorId}`, {});
  // } catch (error) {
  //   const { code, message } = getAxiosErrorInfo(error);
  //   return rejectWithValue({
  //     code,
  //     message,
  //   });
  // }
  const walletBalanceFromBack: { balance: WalletBalanceAPIResponse; currency: CurrencySigns } = {
    balance: {
      monday: 2200.14,
      tuesday: 300.2,
      wednesday: 500.12,
      thursday: 120,
      friday: 90,
      saturday: 0,
      sunday: 0,
    },
    currency: {
      symbol: '₴',
      sign: 'UAH',
    },
  };
  return walletBalanceFromBack;
});

//TODO: There's just example! Rewrite when info about it logic will be known
export const getWalletCryptoBalance = createAsyncThunk<
  { balance: WalletBalanceAPIResponse; currency: CurrencySigns },
  { contractorId: string }
>('wallet/getWalletCryptoBalance', async () => {
  //TODO: Add networking
  // try {
  //   return await shuttlexContractorInstance.get(`/statistic/contractor/${payload.contractorId}`, {});
  // } catch (error) {
  //   const { code, message } = getAxiosErrorInfo(error);
  //   return rejectWithValue({
  //     code,
  //     message,
  //   });
  // }
  const walletCryptoBalanceFromBack: { balance: WalletBalanceAPIResponse; currency: CurrencySigns } = {
    balance: {
      monday: 100.14,
      tuesday: 40.2,
      wednesday: 50.12,
      thursday: 20,
      friday: 9,
      saturday: 10,
      sunday: 0,
    },
    currency: {
      sign: 'USDT',
      symbol: null,
    },
  };
  return walletCryptoBalanceFromBack;
});

//TODO: There's just example! Rewrite when info about it logic will be known
export const getTokensAmount = createAsyncThunk<number, { contractorId: string }>(
  'wallet/getTokensAmount',
  async () => {
    //TODO: Add networking
    // try {
    //   return await shuttlexContractorInstance.get(`/statistic/contractor/${payload.contractorId}`, {});
    // } catch (error) {
    //   const { code, message } = getAxiosErrorInfo(error);
    //   return rejectWithValue({
    //     code,
    //     message,
    //   });
    // }
    const tokensAmountFromBack = 1800;
    return tokensAmountFromBack;
  },
);

//TODO: There's just example! Rewrite when info about it logic will be known
export const getTripsAmount = createAsyncThunk<number, { contractorId: string }>('wallet/getTripsAmount', async () => {
  //TODO: Add networking
  // try {
  //   return await shuttlexContractorInstance.get(`/statistic/contractor/${payload.contractorId}`, {});
  // } catch (error) {
  //   const { code, message } = getAxiosErrorInfo(error);
  //   return rejectWithValue({
  //     code,
  //     message,
  //   });
  // }
  const tripsAmountFromBack = 374;
  return tripsAmountFromBack;
});

//TODO: There's just example! Rewrite when info about it logic will be known
export const getAvailablePaymentMethods = createAsyncThunk<PaymentMethodWithoutExpiresAt[], { contractorId: string }>(
  'wallet/getAvailablePaymentMethods',
  async () => {
    //TODO: Add networking
    // try {
    //   return await shuttlexContractorInstance.get(`/statistic/contractor/${payload.contractorId}`, {});
    // } catch (error) {
    //   const { code, message } = getAxiosErrorInfo(error);
    //   return rejectWithValue({
    //     code,
    //     message,
    //   });
    // }
    const availablePaymentMethodsFromBack: PaymentMethodWithoutExpiresAt[] = [
      {
        method: 'mastercard',
        details: '6578',
      },
      {
        method: 'visa',
        details: '1234',
      },
      {
        method: 'mastercard',
        details: '9101',
      },
      {
        method: 'mastercard',
        details: '1101',
      },
    ];
    return availablePaymentMethodsFromBack;
  },
);

//TODO: There's just example! Rewrite when info about it logic will be known
export const getEmailOrBinanceId = createAsyncThunk<EmailOrBinanceId, { contractorId: string }>(
  'wallet/getEmailOrBinanceId',
  async () => {
    //TODO: Add networking
    // try {
    //   return await shuttlexContractorInstance.get(`/statistic/contractor/${payload.contractorId}`, {});
    // } catch (error) {
    //   const { code, message } = getAxiosErrorInfo(error);
    //   return rejectWithValue({
    //     code,
    //     message,
    //   });
    // }
    const emailOrBinanceIdFromBack: string | null = null;
    return emailOrBinanceIdFromBack;
  },
);

//TODO: There's just example! Rewrite when info about it logic will be known
export const getWithdrawalCryptoHistory = createAsyncThunk<WithdrawalHistory[], { contractorId: string }>(
  'wallet/getWithdrawalCryptoHistory',
  async () => {
    //TODO: Add networking
    // try {
    //   return await shuttlexContractorInstance.get(`/statistic/contractor/${payload.contractorId}`, {});
    // } catch (error) {
    //   const { code, message } = getAxiosErrorInfo(error);
    //   return rejectWithValue({
    //     code,
    //     message,
    //   });
    // }
    const withdrawalCashHistoryFromBack: WithdrawalHistory[] = [
      {
        quantity: '1.18',
        date: new Date().getTime(),
      },
      {
        quantity: '2.18',
        date: new Date().getTime() + 1,
      },
      {
        quantity: '3.18',
        date: new Date().getTime() + 2,
      },
      {
        quantity: '4.18',
        date: new Date().getTime() + 3,
      },
      {
        quantity: '5.18',
        date: new Date().getTime() + 4,
      },
      {
        quantity: '6.18',
        date: new Date().getTime() + 5,
      },
    ];
    return withdrawalCashHistoryFromBack;
  },
);

//TODO: There's just example! Rewrite when info about it logic will be known
export const getWithdrawalCashHistory = createAsyncThunk<WithdrawalHistory[], { contractorId: string }>(
  'wallet/getWithdrawalCashHistory',
  async () => {
    //TODO: Add networking
    // try {
    //   return await shuttlexContractorInstance.get(`/statistic/contractor/${payload.contractorId}`, {});
    // } catch (error) {
    //   const { code, message } = getAxiosErrorInfo(error);
    //   return rejectWithValue({
    //     code,
    //     message,
    //   });
    // }
    const withdrawalCryptoHistoryFromBack: WithdrawalHistory[] = [
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
    ];
    return withdrawalCryptoHistoryFromBack;
  },
);

//TODO: There's just example! Rewrite when info about it logic will be known
export const addAvailablePaymentMethod = createAsyncThunk<Card, { cardData: Card }>(
  'wallet/addAvailablePaymentMethod',
  async ({ cardData }) => {
    //TODO: Add networking
    // try {
    //   return await shuttlexContractorInstance.get(`/statistic/contractor/${cardData}`, {});
    // } catch (error) {
    //   const { code, message } = getAxiosErrorInfo(error);
    //   return rejectWithValue({
    //     code,
    //     message,
    //   });
    // }

    return cardData;
  },
);

//TODO: There's just example! Rewrite when info about it logic will be known
export const sendSelectedPaymentMethod = createAsyncThunk<boolean, { method: PaymentMethodWithoutExpiresAt }>(
  'wallet/sendSelectedPaymentMethod',
  async () => {
    //TODO: Add networking
    // try {
    //   return await shuttlexContractorInstance.get(`/statistic/contractor/${cardData}`, {});
    // } catch (error) {
    //   const { code, message } = getAxiosErrorInfo(error);
    //   return rejectWithValue({
    //     code,
    //     message,
    //   });
    // }

    return true;
  },
);

//TODO: There's just example! Rewrite when info about it logic will be known
export const sendCryptoEmailOrBinanceId = createAsyncThunk<boolean, { emailOrBinanceId: string }>(
  'wallet/sendCryptoEmailOrBinanceId',
  async () => {
    //TODO: Add networking
    // try {
    //   return await shuttlexContractorInstance.get(`/statistic/contractor/${cardData}`, {});
    // } catch (error) {
    //   const { code, message } = getAxiosErrorInfo(error);
    //   return rejectWithValue({
    //     code,
    //     message,
    //   });
    // }
    return true;
  },
);

//TODO: There's just example! Rewrite when info about it logic will be known
export const fetchWithdraw = createAsyncThunk<boolean, { withdrawSum: number }>('wallet/fetchWithdraw', async () => {
  //TODO: Add networking
  //TODO: Add logic receiving correct responce from back-end
  // try {
  //   return await shuttlexContractorInstance.get(`/statistic/contractor/${cardData}`, {});
  // } catch (error) {
  //   const { code, message } = getAxiosErrorInfo(error);
  //   return rejectWithValue({
  //     code,
  //     message,
  //   });
  // }

  return true;
});

//TODO: There's just example! Rewrite when info about it logic will be known
export const removePaymentMethod = createAsyncThunk<
  PaymentMethodWithoutExpiresAt[],
  { methodForRemoving: PaymentMethodWithoutExpiresAt; contractorId: string }
>('wallet/removePaymentMethod', async ({ methodForRemoving }, { getState }) => {
  //TODO: Add networking
  // try {
  //   return await shuttlexContractorInstance.get(`/statistic/contractor/${cardData}`, {});
  // } catch (error) {
  //   const { code, message } = getAxiosErrorInfo(error);
  //   return rejectWithValue({
  //     code,
  //     message,
  //   });
  // }

  // This logic will be removed when networking is added
  const state = getState() as AppState;
  const filteredState: PaymentMethodWithoutExpiresAt[] = state.wallet.payment.cash.avaliableMethods.filter(
    availableMethod =>
      !(availableMethod.details === methodForRemoving.details && availableMethod.method === methodForRemoving.method),
  );

  return filteredState;
});

//TODO: There's just example! Rewrite when info about it logic will be known
export const getWalletStatistic = createAsyncThunk<void, { contractorId: string }>(
  'wallet/getWalletStatistic',
  async ({ contractorId }, { dispatch }) => {
    await dispatch(getWalletCashBalance({ contractorId }));
    await dispatch(getWalletCryptoBalance({ contractorId }));
    await dispatch(getTokensAmount({ contractorId }));
    await dispatch(getTripsAmount({ contractorId }));
    await dispatch(getAvailablePaymentMethods({ contractorId }));
    await dispatch(getWithdrawalCashHistory({ contractorId }));
    await dispatch(getWithdrawalCryptoHistory({ contractorId }));
    await dispatch(getEmailOrBinanceId({ contractorId }));
  },
);
