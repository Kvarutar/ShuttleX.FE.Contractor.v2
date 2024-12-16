import { AppState } from '../../../redux/store';

export const isAccountSettingsLoadingSelector = (state: AppState) => state.accountSettings.isLoading;
export const accountSettingsErrorSelector = (state: AppState) => state.accountSettings.error;
export const accountSettingsVerifyStatusSelector = (state: AppState) => state.accountSettings.verifyStatus;
