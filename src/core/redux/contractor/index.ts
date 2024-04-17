import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TariffType } from 'shuttlex-integration';

import { sendSelectedTariffs, updateContractorStatus } from './thunks';
import { ContractorState, ContractorStatus, Profile } from './types';

const initialState: ContractorState = {
  preferredTariffs: ['BasicX'],
  unavailableTariffs: ['ComfortX'],
  profile: null,
  status: 'offline',
};

const slice = createSlice({
  name: 'contractor',
  initialState,
  reducers: {
    setPreferredTariffs(state, action: PayloadAction<TariffType[]>) {
      state.preferredTariffs = action.payload;
    },
    setUnavailableTariffs(state, action: PayloadAction<TariffType[]>) {
      state.unavailableTariffs = action.payload;
    },
    setProfile(state, action: PayloadAction<Profile>) {
      state.profile = action.payload;
    },
    setContractorState(state, action: PayloadAction<ContractorStatus>) {
      state.status = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(sendSelectedTariffs.fulfilled, (state, action) => {
        slice.caseReducers.setPreferredTariffs(state, {
          payload: action.meta.arg,
          type: setPreferredTariffs.type,
        });
      })
      .addCase(updateContractorStatus.fulfilled, (state, action) => {
        slice.caseReducers.setContractorState(state, {
          payload: action.meta.arg,
          type: setContractorState.type,
        });
      })
      .addCase(updateContractorStatus.rejected, (_, action) => {
        console.log(action.payload);
      });
  },
});

export const { setPreferredTariffs, setUnavailableTariffs, setProfile, setContractorState } = slice.actions;

export default slice.reducer;
