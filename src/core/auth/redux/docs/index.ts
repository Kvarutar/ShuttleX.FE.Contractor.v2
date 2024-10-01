import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RequirementDocs, RequirementDocsType } from './types';

const initialState: Record<RequirementDocsType, RequirementDocs> = {
  backgroundCheck: null,
  profilePhoto: null,
  passport: null,
  driversLicense: null,
  vehicleInspection: null,
  vehicleInsurance: null,
  vehicleRegistration: null,
};

const slice = createSlice({
  name: 'docs',
  initialState,
  reducers: {
    updateRequirementDocuments(state, action: PayloadAction<{ body: RequirementDocs; type: RequirementDocsType }>) {
      state[action.payload.type] = action.payload.body;
    },
  },
});

export const { updateRequirementDocuments } = slice.actions;

export default slice.reducer;
