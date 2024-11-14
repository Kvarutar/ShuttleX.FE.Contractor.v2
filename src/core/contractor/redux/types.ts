import { TariffType } from 'shuttlex-integration';

import { AchievementsKeys } from '../../../shared/Achievements/types';

export type PreferenceType = 'CryptoPayment' | 'CashPayment';

export type ContractorStatus = 'online' | 'offline';

export type Profile = {
  fullName: string;
  email: string;
  phone: string;
  imageUri: string;
};

export type TariffInfo = {
  id: string;
  name: TariffType;
  isPrimary: boolean;
  isAvailable: boolean;
  isSelected: boolean;
  seatsAmount: number;
  baggageAmount: number;
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

export type CarDataAPIResponse = {
  id: string;
  title: string;
};

export type ContractorState = {
  contractorId: string;
  tariffs: TariffInfo[];
  preferences: PreferenceInfo[];
  achievements: AchievementsAPIResponse[];
  profile: Profile | null;
  carData: CarDataAPIResponse | null;
  status: ContractorStatus;
  zone: string | null;
  subscriptionStatus: boolean;
};
