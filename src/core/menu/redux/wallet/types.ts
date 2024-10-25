import { PaymentMethod } from 'shuttlex-integration/lib/typescript/src/utils/payment/types';

import { WithdrawalHistory } from '../../../../screens/menu/wallet/WalletScreen/types';

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

export type CurrencySigns = {
  symbol: string | null;
  sign: string | null;
};

export type WithdrawType = 'cash' | 'crypto';

export type EmailOrBinanceId = string | null;

export type WalletState = {
  balances: {
    cash: {
      balance: WalletBalanceAPIResponse;
      currency: CurrencySigns;
    };
    crypto: {
      balance: WalletBalanceAPIResponse;
      currency: CurrencySigns;
    };
  };
  payment: {
    cash: {
      selectedMethod: PaymentMethodWithoutExpiresAt | null;
      avaliableMethods: PaymentMethodWithoutExpiresAt[];
      withdrawalHistory: WithdrawalHistory[];
    };
    crypto: {
      emailOrID: EmailOrBinanceId;
      withdrawalHistory: WithdrawalHistory[];
    };
  };
  tokensAmount: number;
  tripsAmount: number;
};
