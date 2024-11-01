import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList } from '../../../../Navigate/props';

export type WithdrawScreenProps = NativeStackScreenProps<RootStackParamList, 'Withdraw'>;

export type SliderAmountProps = {
  balanceTotal: number;
  inputAmount: number;
  setInputAmount: (newState: number) => void;
  minWithdrawSum: number;
  numDigits: number;
  roundStep: number;
};
