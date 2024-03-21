import { AppState } from '../../../redux/store';

export const walletBalanceSelector = (state: AppState) => state.wallet.balance;
export const selectedPaymentMethodSelector = (state: AppState) => state.wallet.payment.selectedMethod;
export const avaliablePaymentMethodsListSelector = (state: AppState) => state.wallet.payment.avaliableMethods;
