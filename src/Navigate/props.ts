import { countryDtosProps } from 'shuttlex-integration/lib/typescript/src/core/countries/props';

export type RootStackParamList = {
  Splash: undefined;
  Auth: { state: 'SignIn' };
  Ride: undefined;
  SignInPhoneCode: undefined;
  SignInEmailCode: undefined;
  Notifications: undefined;
  Rating: undefined;
  Zone: undefined;
  Docs: undefined;
  BackgroundCheck: undefined;
  ProfilePhoto: undefined;
  DriversLicense: undefined;
  VehicleInsurance: undefined;
  VehicleRegistration: undefined;
  VehicleInspection: undefined;
  Wallet: undefined;
  AddPayment: undefined;
  Withdraw: undefined;
  PhoneSelect: { initialFlag: countryDtosProps; onFlagSelect: (flag: countryDtosProps) => void };
  Terms: undefined;
  Verification: undefined;
  LockOut: undefined;
};
