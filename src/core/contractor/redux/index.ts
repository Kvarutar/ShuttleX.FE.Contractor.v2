import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  getAchievements,
  getPreferences,
  getTariffs,
  sendSelectedPreferences,
  sendSelectedTariffs,
  updateContractorStatus,
} from './thunks';
import {
  AchievementsAPIResponse,
  ContractorState,
  ContractorStatus,
  PreferenceInfo,
  Profile,
  TariffInfo,
} from './types';

const initialState: ContractorState = {
  //TODO: Remove contractorId value when logic for receiving it will be added
  contractorId: '3fa85f64-5717-4562-b3fc-2c963f66afa6', // Random value
  tariffs: [],
  preferences: [],
  achievements: [],
  profile: null,
  zone: null,
  profileImageUri: null,
  status: 'offline',
};

const slice = createSlice({
  name: 'contractor',
  initialState,
  reducers: {
    setContractorId(state, action: PayloadAction<string>) {
      state.contractorId = action.payload;
    },
    setTariffs(state, action: PayloadAction<TariffInfo[]>) {
      state.tariffs = action.payload;
    },
    revertTariffFieldById(
      state,
      action: PayloadAction<{ tariffId: string; field: keyof Omit<TariffInfo, 'id' | 'name'> }>,
    ) {
      const { tariffId, field } = action.payload;
      state.tariffs = state.tariffs.map(trf => (trf.id === tariffId ? { ...trf, [field]: !trf[field] } : trf));
    },
    setContractorState(state, action: PayloadAction<ContractorStatus>) {
      state.status = action.payload;
    },
    setPreferences(state, action: PayloadAction<PreferenceInfo[]>) {
      state.preferences = action.payload;
    },
    setAchievements(state, action: PayloadAction<AchievementsAPIResponse[]>) {
      state.achievements = action.payload;
    },
    revertPreferenceFieldById(
      state,
      action: PayloadAction<{ preferenceId: string; field: keyof Omit<PreferenceInfo, 'id' | 'name'> }>,
    ) {
      const { preferenceId, field } = action.payload;
      state.preferences = state.preferences.map(preference =>
        preference.id === preferenceId ? { ...preference, [field]: !preference[field] } : preference,
      );
    },
    setProfile(state, action: PayloadAction<Profile>) {
      state.profile = action.payload;
    },
    setContractorZone(state, action: PayloadAction<string>) {
      state.zone = action.payload;
    },
    setProfileImage(state, action: PayloadAction<string>) {
      state.profileImageUri = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(sendSelectedTariffs.fulfilled, (state, action) => {
        slice.caseReducers.setTariffs(state, {
          payload: action.meta.arg.selectedTariffs,
          type: setTariffs.type,
        });
      })
      .addCase(sendSelectedPreferences.fulfilled, (state, action) => {
        slice.caseReducers.setPreferences(state, {
          payload: action.meta.arg.selectedPreferences,
          type: setPreferences.type,
        });
      })
      .addCase(updateContractorStatus.fulfilled, (state, action) => {
        slice.caseReducers.setContractorState(state, {
          payload: action.meta.arg,
          type: setContractorState.type,
        });
      })
      .addCase(getTariffs.fulfilled, (state, action) => {
        slice.caseReducers.setTariffs(state, {
          payload: action.payload,
          type: setTariffs.type,
        });
      })
      .addCase(getPreferences.fulfilled, (state, action) => {
        slice.caseReducers.setPreferences(state, {
          payload: action.payload,
          type: setPreferences.type,
        });
      })
      .addCase(getAchievements.fulfilled, (state, action) => {
        slice.caseReducers.setAchievements(state, {
          payload: action.payload,
          type: setAchievements.type,
        });
      })
      .addCase(updateContractorStatus.rejected, (_, action) => {
        console.log(action.payload);
      });
  },
});

export const {
  setContractorId,
  setTariffs,
  revertTariffFieldById,
  setPreferences,
  setAchievements,
  revertPreferenceFieldById,
  setProfile,
  setContractorState,
  setContractorZone,
  setProfileImage,
} = slice.actions;

export default slice.reducer;
