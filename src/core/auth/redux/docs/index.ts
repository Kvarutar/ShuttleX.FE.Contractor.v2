import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { DocsState } from './types';

const initialState: DocsState = {
  profilePhoto: null,
  passport: [],
  driversLicense: [],
  vehicleInsurance: [],
  vehicleRegistration: [],
};

const slice = createSlice({
  name: 'docs',
  initialState,
  reducers: {
    updateRequirementDocuments(state, action: PayloadAction<Partial<DocsState>>) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
});

export const { updateRequirementDocuments } = slice.actions;

export default slice.reducer;
