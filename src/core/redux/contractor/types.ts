import { TariffType } from 'shuttlex-integration';

export type ContractorState = {
  preferredTariffs: TariffType[];
  unavailableTariffs: TariffType[];
};
