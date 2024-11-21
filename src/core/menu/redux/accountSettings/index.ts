import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NetworkErrorDetailsWithBody } from 'shuttlex-integration';

import { changeAccountContactData, verifyChangeAccountDataCode } from './thunks';
import { VerificationState } from './types';

const initialState: VerificationState = {
  isVerificationDone: false,
  isLoading: false,
  error: null,
};

const slice = createSlice({
  name: 'accountSettings',
  initialState,
  reducers: {
    setIsAccountSettingsVerificationDone(state, action) {
      state.isVerificationDone = action.payload;
    },
    setAccountSettingsIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setAccountSettingsError(state, action: PayloadAction<NetworkErrorDetailsWithBody<any> | null>) {
      state.error = action.payload;
    },
    resetAccountSettingsVerification(state) {
      state.isVerificationDone = false;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(changeAccountContactData.pending, state => {
        slice.caseReducers.setAccountSettingsIsLoading(state, {
          payload: true,
          type: setAccountSettingsIsLoading.type,
        });
        slice.caseReducers.setAccountSettingsError(state, {
          payload: initialState.error,
          type: setAccountSettingsError.type,
        });
      })
      .addCase(changeAccountContactData.fulfilled, state => {
        slice.caseReducers.setAccountSettingsIsLoading(state, {
          payload: false,
          type: setAccountSettingsIsLoading.type,
        });
        slice.caseReducers.setAccountSettingsError(state, {
          payload: initialState.error,
          type: setAccountSettingsError.type,
        });
      })
      .addCase(changeAccountContactData.rejected, (state, action) => {
        slice.caseReducers.setAccountSettingsIsLoading(state, {
          payload: false,
          type: setAccountSettingsIsLoading.type,
        });
        slice.caseReducers.setAccountSettingsError(state, {
          payload: action.payload as NetworkErrorDetailsWithBody<any>, //TODO: remove this cast after fix with rejectedValue
          type: setAccountSettingsError.type,
        });
        console.error(changeAccountContactData.typePrefix, action.payload);
      })
      .addCase(verifyChangeAccountDataCode.pending, state => {
        slice.caseReducers.setAccountSettingsIsLoading(state, {
          payload: true,
          type: setAccountSettingsIsLoading.type,
        });
        slice.caseReducers.setAccountSettingsError(state, {
          payload: initialState.error,
          type: setAccountSettingsError.type,
        });
      })
      .addCase(verifyChangeAccountDataCode.fulfilled, state => {
        slice.caseReducers.setAccountSettingsIsLoading(state, {
          payload: false,
          type: setAccountSettingsIsLoading.type,
        });
        slice.caseReducers.setAccountSettingsError(state, {
          payload: initialState.error,
          type: setAccountSettingsError.type,
        });
      })
      .addCase(verifyChangeAccountDataCode.rejected, (state, action) => {
        slice.caseReducers.setAccountSettingsIsLoading(state, {
          payload: false,
          type: setAccountSettingsIsLoading.type,
        });
        slice.caseReducers.setAccountSettingsError(state, {
          payload: action.payload as NetworkErrorDetailsWithBody<any>, //TODO: remove this cast after fix with rejectedValue
          type: setAccountSettingsError.type,
        });
      });
  },
});

export const {
  setIsAccountSettingsVerificationDone,
  resetAccountSettingsVerification,
  setAccountSettingsIsLoading,
  setAccountSettingsError,
} = slice.actions;
export default slice.reducer;
