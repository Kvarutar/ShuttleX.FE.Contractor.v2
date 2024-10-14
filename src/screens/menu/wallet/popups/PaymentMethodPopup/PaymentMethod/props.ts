import { PaymentMethodWithoutExpiresAt } from '../../../../../../core/menu/redux/wallet/types';

export type PaymentMethodProps = {
  paymentMethod: PaymentMethodWithoutExpiresAt;
  index: number;
  onSelectMethod: () => void;
};
