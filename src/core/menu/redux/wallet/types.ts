import { PaymentMethod } from 'shuttlex-integration';

export type WalletState = {
  balance: number;
  payment: {
    selectedMethod: PaymentMethod | null;
    avaliableMethods: PaymentMethod[];
  };
};
