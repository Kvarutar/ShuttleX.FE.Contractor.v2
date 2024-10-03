import { CountryPhoneMaskDto } from 'shuttlex-integration';

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
  Wallet: undefined;
  AddPayment: undefined;
  Withdraw: undefined;
  PhoneSelect: { initialFlag: CountryPhoneMaskDto; onFlagSelect: (flag: CountryPhoneMaskDto) => void };
  Terms: undefined;
  Verification: undefined;
  LockOut: undefined;
};
