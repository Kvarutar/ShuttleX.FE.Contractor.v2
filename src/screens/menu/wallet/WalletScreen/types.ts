import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { WalletBalanceAPIResponse } from '../../../../core/menu/redux/wallet/types';
import { RootStackParamList } from '../../../../Navigate/props';

export type WalletScreenProps = NativeStackScreenProps<RootStackParamList, 'Wallet'>;

export type WithdrawalHistory = {
  quantity: string;
  date: number;
};

export type СurrentBalanceInfo = {
  balance: WalletBalanceAPIResponse;
  currency: string;
  totalBalance: number;
  withdrawalHistory: WithdrawalHistory[];
  currencySign: string;
};
