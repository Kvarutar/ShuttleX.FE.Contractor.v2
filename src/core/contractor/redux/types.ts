import { TariffType } from 'shuttlex-integration';

import { AchievementsKeys } from '../../../shared/Achievements/types';

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

export type AchievementsAPIResponse = {
  key: AchievementsKeys;
  isDone: boolean;
  pointsAmount: number;
};

export type ContractorState = {
  contractorId: string;
  tariffs: TariffInfo[];
  preferences: PreferenceInfo[];
  achievements: AchievementsAPIResponse[];
  profile: Profile | null;
  status: ContractorStatus;
  zone: string | null;
  profileImageUri: string | null;
};
