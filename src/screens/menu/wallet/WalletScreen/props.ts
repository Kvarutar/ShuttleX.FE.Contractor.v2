import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList } from '../../../../Navigate/props';

export type WalletScreenProps = NativeStackScreenProps<RootStackParamList, 'Wallet'>;

export type WithdrawalHistory = {
  quantity: string;
  date: number;
};
