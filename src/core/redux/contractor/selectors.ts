import { AppState } from '../store';

export const preferredTariffsSelector = (state: AppState) => state.contractor.preferredTariffs;
export const unavailableTariffsSelector = (state: AppState) => state.contractor.unavailableTariffs;
export const profileSelector = (state: AppState) => state.contractor.profile;
export const contractorStatusSelector = (state: AppState) => state.contractor.status;
