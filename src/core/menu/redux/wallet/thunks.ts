import { createAsyncThunk } from '@reduxjs/toolkit';
import { Card } from 'shuttlex-integration';

import { AppState } from '../../../redux/store';
import { WithdrawalHistory } from './../../../../screens/menu/wallet/WalletScreen/props';
import { PaymentMethodWithoutExpiresAt, WalletBalanceAPIResponse } from './types';

//TODO: There's just example! Rewrite when info about it logic will be known
export const getWalletBalance = createAsyncThunk<WalletBalanceAPIResponse, { contractorId: string }>(
  'wallet/getWalletBalance',
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
    const walletBalanceFromBack: WalletBalanceAPIResponse = {
      monday: 2200.14,
      tuesday: 300.2,
      wednesday: 500.12,
      thursday: 120,
      friday: 90,
      saturday: 0,
      sunday: 0,
    };
    return walletBalanceFromBack;
  },
);

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
export const getWithdrawalHistory = createAsyncThunk<WithdrawalHistory[], { contractorId: string }>(
  'wallet/getWithdrawalHistory',
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
    const withdrawalHistoryFromBack: WithdrawalHistory[] = [
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
    return withdrawalHistoryFromBack;
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
  const filteredState: PaymentMethodWithoutExpiresAt[] = state.wallet.payment.avaliableMethods.filter(
    availableMethod =>
      !(availableMethod.details === methodForRemoving.details && availableMethod.method === methodForRemoving.method),
  );

  return filteredState;
});

//TODO: There's just example! Rewrite when info about it logic will be known
export const getWalletStatistic = createAsyncThunk<void, { contractorId: string }>(
  'wallet/getWalletStatistic',
  async ({ contractorId }, { dispatch }) => {
    await dispatch(getWalletBalance({ contractorId }));
    await dispatch(getTokensAmount({ contractorId }));
    await dispatch(getTripsAmount({ contractorId }));
    await dispatch(getAvailablePaymentMethods({ contractorId }));
    await dispatch(getWithdrawalHistory({ contractorId }));
  },
);
