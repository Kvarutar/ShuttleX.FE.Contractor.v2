import { PaymentMethod } from 'shuttlex-integration/lib/typescript/src/utils/payment/types';

import { WithdrawalHistory } from '../../../../screens/menu/wallet/WalletScreen/props';

//TODO: Change this type when we now how it seems on back-end
export type WalletBalanceAPIResponse = {
  monday: number;
  tuesday: number;
  wednesday: number;
  thursday: number;
  friday: number;
  saturday: number;
  sunday: number;
};

export type PaymentMethodWithoutExpiresAt = Omit<PaymentMethod, 'expiresAt'>;

export type WalletState = {
  balance: WalletBalanceAPIResponse;
  payment: {
    selectedMethod: PaymentMethodWithoutExpiresAt | null;
    avaliableMethods: PaymentMethodWithoutExpiresAt[];
    withdrawalHistory: WithdrawalHistory[];
  };
  tokensAmount: number;
  tripsAmount: number;
};
