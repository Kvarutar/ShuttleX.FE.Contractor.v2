import { TariffType } from 'shuttlex-integration';

import { TariffFeKeyFromAPI } from '../types';

export const tariffsNamesByFeKey: Record<TariffFeKeyFromAPI, TariffType> = {
  basicx: 'Basic',
  basicxl: 'BasicXL',
  comfortplus: 'ComfortPlus',
  electric: 'Electric',
  premiumx: 'Business',
  premiumxl: 'Business',
};
