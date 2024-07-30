import { TariffType } from 'shuttlex-integration';

export type Profile = {
  name: string;
  surname: string;
  dateOfBirth: number;
  email: string;
  phone: string;
};

export type ContractorStatus = 'online' | 'offline';

export type ContractorState = {
  preferredTariffs: TariffType[];
  unavailableTariffs: TariffType[];
  profile: Profile | null;
  status: ContractorStatus;
  zone: string | null;
  profileImageUri: string | null;
};
