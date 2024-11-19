import { CountryPhoneMaskDto } from 'shuttlex-integration';

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
  Passport: undefined;
  DriversLicense: undefined;
  VehicleInsurance: undefined;
  VehicleRegistration: undefined;
  Docs: undefined;
  Wallet: undefined;
  AddPayment: undefined;
  Withdraw: { selectedTotalBalance: number; currencySign: string; withdrawType: WithdrawType };
  PhoneSelect: { initialFlag: CountryPhoneMaskDto; onFlagSelect: (flag: CountryPhoneMaskDto) => void };
  Terms: undefined;
  Verification: undefined;
  LockOut: undefined;
  AccountSettings: undefined;
  AccountVerificateCode: { mode: 'phone' | 'email'; newValue: string };
};
