import { NetworkErrorDetailsWithBody, Nullable, TariffType } from 'shuttlex-integration';

import { AchievementsKeys } from '../../../shared/Achievements/types';

export type TariffFeKeyFromAPI = 'basicx' | 'basicxl' | 'comfortplus' | 'premiumx' | 'premiumxl' | 'teslax';

export type PreferenceType = 'CryptoPayment' | 'CashPayment';

export type ContractorStatus = 'online' | 'offline';

export type VehicleData = {
  id: string;
  brand: string;
  number: string;
};

export type ContractorInfo = {
  id: string;
  name: string;
  email: string;
  phone: string;
  state: ContractorStatus;
  level: number;
  totalRidesCount: number;
  totalLikesCount: number;
  vehicle: VehicleData | null;
};

export type ContractorInfoAPIResponse = {
  id: string;
  name: string;
  email: string;
  phone: string;
  level: number;
  totalRidesCount: number;
  totalLikesCount: number;
  vehicle: VehicleData | null;
  state:
    | 'None'
    | 'RequireVerification'
    | 'UnderReview'
    | 'RequireDocumentUpdate'
    | 'UnavailableForWork'
    | 'WaitingOrder'
    | 'InOrderProcessingWithNextStopPoint'
    | 'InOrderProcessingWithNextDropOff'
    | 'OutOfWork';
};

export type GetContractorAvatarAPIResponse = Blob;

export type UpdateSelectedTariffsAPIRequest = {
  tariffIds: string[];
};

export type TariffAdditionalInfoAPIResponse = {
  id: string;
  name: string;
  feKey: TariffFeKeyFromAPI;
  currencyCode: string;
  freeWaitingTimeMin: number;
  paidWaitingTimeFeePriceMin: number;
  maxSeatsCount: number;
  maxLuggagesCount: number;
};

export type TariffInfoByTariffsAPIResponse = {
  id: string;
  isPrimary: boolean;
  isAvailable: boolean;
  isSelected: boolean;
};

export type TariffInfo = {
  id: string;
  name: TariffType;
  isPrimary: boolean;
  isAvailable: boolean;
  isSelected: boolean;
  feKey: TariffFeKeyFromAPI;
  currencyCode: string;
  freeWaitingTimeMin: number;
  paidWaitingTimeFeePriceMin: number;
  maxSeatsCount: number;
  maxLuggagesCount: number;
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

export type ContractorStateErrorKey = keyof ContractorState['error'];
export type ContractorStateLoadingKey = keyof ContractorState['loading'];

export type ContractorState = {
  tariffs: TariffInfo[];
  preferences: PreferenceInfo[];
  achievements: AchievementsAPIResponse[];
  info: ContractorInfo;
  avatarURL: string;
  zone: Nullable<string>;
  subscriptionStatus: boolean;
  error: {
    contractorInfo: Nullable<NetworkErrorDetailsWithBody<any>>;
    tariffsInfo: Nullable<NetworkErrorDetailsWithBody<any>>;
    general: Nullable<NetworkErrorDetailsWithBody<any>>;
  };
  loading: {
    contractorInfo: boolean;
    tariffsInfo: boolean;
    general: boolean;
  };
};
