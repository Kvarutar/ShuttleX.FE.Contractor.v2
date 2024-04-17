import { TariffType } from 'shuttlex-integration';

export type Profile = {
  imageUri: string;
  name: string;
  surname: string;
};

export type ContractorStatus = 'online' | 'offline';

export type ContractorState = {
  preferredTariffs: TariffType[];
  unavailableTariffs: TariffType[];
  profile: Profile | null;
  status: ContractorStatus;
};
