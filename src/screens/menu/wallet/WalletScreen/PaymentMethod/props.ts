import { PaymentMethod } from 'shuttlex-integration';

export type PaymentMethodProps = {
  paymentMethod: PaymentMethod;
  selectedPaymentMethod: PaymentMethod;
  index: number;
  onSelectMethod: () => void;
  paymentMethods: PaymentMethod[];
};
