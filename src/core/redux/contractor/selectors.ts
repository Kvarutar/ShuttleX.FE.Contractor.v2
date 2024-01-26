import { AppState } from '../store';

export const preferredTariffsSelector = (state: AppState) => state.contractor.preferredTariffs;
export const unavailableTariffsSelector = (state: AppState) => state.contractor.unavailableTariffs;
