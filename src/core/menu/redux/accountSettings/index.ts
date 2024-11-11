import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { VerificationState } from './types';

const initialState: VerificationState = {
  isVerificationDone: false,
  isBlocked: false,
  lockoutChangesTimestamp: 0,
  lockoutChangesAttempts: 0,
};

const slice = createSlice({
  name: 'accountSettings',
  initialState,
  reducers: {
    setIsVerificationDone(state, action) {
      state.isVerificationDone = action.payload;
    },
    resetVerification(state) {
      state.isVerificationDone = false;
    },
    setIsBlocked(state, action) {
      state.isBlocked = action.payload;
    },
    resetIsBlocked(state) {
      state.isVerificationDone = false;
    },
    incremenChangestAttempts: state => {
      state.lockoutChangesAttempts += 1;
    },
    setLockoutChangesTimestamp(state, action: PayloadAction<number>) {
      state.lockoutChangesTimestamp = action.payload;
    },
    resetLockoutChanges: state => {
      state.lockoutChangesTimestamp = 0;
      state.lockoutChangesAttempts = 0;
    },
  },
});

export const {
  setIsVerificationDone,
  resetVerification,
  incremenChangestAttempts,
  setLockoutChangesTimestamp,
  resetLockoutChanges,
  setIsBlocked,
  resetIsBlocked,
} = slice.actions;
export default slice.reducer;
