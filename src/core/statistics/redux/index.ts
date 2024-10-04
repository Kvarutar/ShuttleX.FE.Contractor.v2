import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { getContractorStatistics } from './thunks';
import { ContractorStatisticsAPIResponse, StatisticsState } from './types';

const initialState: StatisticsState = {
  contractor: null,
};

const slice = createSlice({
  name: 'statistics',
  initialState,
  reducers: {
    setContractorStatistics(state, action: PayloadAction<ContractorStatisticsAPIResponse>) {
      state.contractor = action.payload;
    },
  },

  extraReducers: builder => {
    builder.addCase(getContractorStatistics.fulfilled, (state, action) => {
      slice.caseReducers.setContractorStatistics(state, {
        payload: action.payload,
        type: setContractorStatistics.type,
      });
    });
  },
});

export const { setContractorStatistics } = slice.actions;

export default slice.reducer;
