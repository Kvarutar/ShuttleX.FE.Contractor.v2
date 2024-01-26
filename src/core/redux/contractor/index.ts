import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TariffType } from 'shuttlex-integration';

import { ContractorState } from './types';

const initialState: ContractorState = {
  preferredTariffs: ['BasicX'],
  unavailableTariffs: ['ComfortX'],
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
  },
});

export const { setPreferredTariffs, setUnavailableTariffs } = slice.actions;

export default slice.reducer;
