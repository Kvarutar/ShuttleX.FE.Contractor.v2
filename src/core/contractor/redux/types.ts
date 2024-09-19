import { TariffType } from 'shuttlex-integration';

export type Profile = {
  name: string;
  surname: string;
  dateOfBirth: number;
  email: string;
  phone: string;
};

export type PreferenceType = 'CryptoPayment' | 'CashPayment';

export type ContractorStatus = 'online' | 'offline';

export type TariffInfo = {
  id: string;
  name: TariffType;
  isPrimary: boolean;
  isAvailable: boolean;
  isSelected: boolean;
};

export type PreferenceInfo = {
  id: string;
  name: PreferenceType;
  isAvailable: boolean;
  isSelected: boolean;
};

export type ContractorState = {
  contractorId: string;
  tariffs: TariffInfo[];
  preferences: PreferenceInfo[];
  profile: Profile | null;
  status: ContractorStatus;
  zone: string | null;
  profileImageUri: string | null;
};
