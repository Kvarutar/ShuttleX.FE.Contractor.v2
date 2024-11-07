import { AppState } from '../../../redux/store';

export const isVerificationDoneSelector = (state: AppState) => state.accountSettings.isVerificationDone;
export const selectLockoutChangesTimestamp = (state: AppState) => state.accountSettings.lockoutChangesTimestamp;
export const selectLockoutChangesAttempts = (state: AppState) => state.accountSettings.lockoutChangesAttempts;
export const selectIsBlocked = (state: AppState) => state.accountSettings.isBlocked;
