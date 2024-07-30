import { AppState } from '../../redux/store';

export const preferredTariffsSelector = (state: AppState) => state.contractor.preferredTariffs;
export const unavailableTariffsSelector = (state: AppState) => state.contractor.unavailableTariffs;
export const profileSelector = (state: AppState) => state.contractor.profile;
export const extendedProfileSelector = (state: AppState) => ({
  ...state.contractor.profile,
  profileImageUri: state.contractor.profileImageUri,
});
export const contractorZoneSelector = (state: AppState) => state.contractor.zone;
export const contractorStatusSelector = (state: AppState) => state.contractor.status;
