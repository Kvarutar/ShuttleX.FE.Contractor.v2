import { AccountSettingsVerificationMethod, CountryPhoneMaskDto } from 'shuttlex-integration';

import { DocsFeKeyFromAPI } from '../core/auth/redux/docs/types';
import { WithdrawType } from '../core/menu/redux/wallet/types';

export type RootStackParamList = {
  Splash: undefined;
  Auth: { state: 'SignIn' | 'SignUp' };
  Ride: undefined;
  SignInCode: { verificationType: 'phone' | 'email'; data: string };
  Notifications: undefined;
  Rating: undefined;
  Zone: undefined;
  BackgroundCheck: undefined;
  ProfilePhoto: undefined;
  Docs: undefined;
  Wallet: undefined;
  AddPayment: undefined;
  Withdraw: { selectedTotalBalance: number; currencySign: string; withdrawType: WithdrawType };
  PhoneSelect: { initialFlag: CountryPhoneMaskDto; onFlagSelect: (flag: CountryPhoneMaskDto) => void };
  Terms: undefined;
  Verification: undefined;
  VerifyPhoneCode: undefined;
  LockOut: undefined;
  AccountSettings: undefined;
  AccountVerificateCode: { mode: 'phone' | 'email'; newValue?: string; method?: AccountSettingsVerificationMethod };
  DocMedia: { feKey: DocsFeKeyFromAPI; templateId: string };
  PaymentDoc: undefined;
  OrderHistory: undefined;
  Subscription: undefined;
};
