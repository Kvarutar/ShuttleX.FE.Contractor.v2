import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TariffType } from 'shuttlex-integration';

import { sendSelectedTariffs } from './thunks';
import { ContractorState, Profile } from './types';

const initialState: ContractorState = {
  preferredTariffs: ['BasicX'],
  unavailableTariffs: ['ComfortX'],
  profile: null,
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
  },
  extraReducers: builder => {
    builder.addCase(sendSelectedTariffs.fulfilled, (state, action) => {
      slice.caseReducers.setPreferredTariffs(state, {
        payload: action.payload,
        type: setPreferredTariffs.type,
      });
    });
  },
});

export const { setPreferredTariffs, setUnavailableTariffs, setProfile } = slice.actions;

export default slice.reducer;
