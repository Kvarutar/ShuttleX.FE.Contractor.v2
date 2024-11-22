import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NetworkErrorDetailsWithBody, Nullable } from 'shuttlex-integration';

import {
  getAchievements,
  getContractorInfo,
  getFullTariffsInfo,
  getPreferences,
  getSubscriptionStatus,
  sendSelectedPreferences,
  sendSelectedTariffs,
  updateContractorStatus,
} from './thunks';
import { type ContractorInfo, ContractorStateErrorKey, ContractorStateLoadingKey, VehicleData } from './types';
import { AchievementsAPIResponse, ContractorState, ContractorStatus, PreferenceInfo, TariffInfo } from './types';

const initialState: ContractorState = {
  //TODO: Remove contractorId and Profile value when logic for receiving it will be added
  tariffs: [],
  preferences: [],
  achievements: [],
  info: {
    id: '',
    name: '',
    email: '',
    phone: '',
    state: 'offline',
    level: 0,
    totalRidesCount: 0,
    totalLikesCount: 0,
    vehicle: null,
  },
  avatarURL: '',
  zone: null,
  subscriptionStatus: false,
  error: {
    general: null, // for all for non-parallel errors
    contractorInfo: null,
    tariffsInfo: null,
  },
  loading: {
    general: false, // for all for non-parallel loadings
    contractorInfo: false,
    tariffsInfo: false,
  },
};

const slice = createSlice({
  name: 'contractor',
  initialState,
  reducers: {
    setContractorId(state, action: PayloadAction<string>) {
      state.info.id = action.payload;
    },
    setTariffs(state, action: PayloadAction<TariffInfo[]>) {
      state.tariffs = action.payload;
    },
    setError(
      state,
      action: PayloadAction<{ errorKey: ContractorStateErrorKey; value: Nullable<NetworkErrorDetailsWithBody<any>> }>,
    ) {
      state.error[action.payload.errorKey] = action.payload.value;
    },
    setLoading(state, action: PayloadAction<{ loadingKey: ContractorStateLoadingKey; value: boolean }>) {
      state.loading[action.payload.loadingKey] = action.payload.value;
    },
    setContractorState(state, action: PayloadAction<ContractorStatus>) {
      if (state.info) {
        state.info.state = action.payload;
      }
    },
    setPreferences(state, action: PayloadAction<PreferenceInfo[]>) {
      state.preferences = action.payload;
    },
    setAchievements(state, action: PayloadAction<AchievementsAPIResponse[]>) {
      state.achievements = action.payload;
    },
    setVehicleData(state, action: PayloadAction<VehicleData>) {
      if (state.info) {
        state.info.vehicle = action.payload;
      }
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
    setContractorInfo(state, action: PayloadAction<Omit<ContractorInfo, 'email' | 'phone'>>) {
      state.info = {
        ...action.payload,
        phone: state.info.phone,
        email: state.info.email,
      };
    },
    setContractorAvatar(state, action: PayloadAction<string>) {
      state.avatarURL = action.payload;
    },
    updateContractorInfo(state, action: PayloadAction<Partial<ContractorInfo>>) {
      if (state.info) {
        state.info = {
          ...state.info,
          ...action.payload,
        };
      }
    },

    setContractorZone(state, action: PayloadAction<string>) {
      state.zone = action.payload;
    },
    setSubscriptionStatus(state, action: PayloadAction<boolean>) {
      state.subscriptionStatus = action.payload;
    },
  },

  extraReducers: builder => {
    builder
      .addCase(getContractorInfo.pending, state => {
        slice.caseReducers.setLoading(state, {
          payload: { loadingKey: 'contractorInfo', value: true },
          type: setLoading.type,
        });
        slice.caseReducers.setError(state, {
          payload: { errorKey: 'contractorInfo', value: initialState.error.tariffsInfo },
          type: setError.type,
        });
      })
      .addCase(getContractorInfo.fulfilled, (state, action) => {
        slice.caseReducers.setContractorInfo(state, {
          payload: action.payload.contractorInfo,
          type: setContractorInfo.type,
        });
        slice.caseReducers.setContractorAvatar(state, {
          payload: action.payload.avatarURL,
          type: setContractorAvatar.type,
        });
        slice.caseReducers.setLoading(state, {
          payload: { loadingKey: 'contractorInfo', value: false },
          type: setLoading.type,
        });
        slice.caseReducers.setError(state, {
          payload: { errorKey: 'contractorInfo', value: initialState.error.tariffsInfo },
          type: setError.type,
        });
      })
      .addCase(getContractorInfo.rejected, (state, action) => {
        slice.caseReducers.setLoading(state, {
          payload: { loadingKey: 'contractorInfo', value: false },
          type: setLoading.type,
        });
        slice.caseReducers.setError(state, {
          payload: { errorKey: 'contractorInfo', value: action.payload as NetworkErrorDetailsWithBody<any> }, //TODO: remove this cast after fix with rejectedValue
          type: setError.type,
        });
      })
      .addCase(getFullTariffsInfo.pending, state => {
        slice.caseReducers.setLoading(state, {
          payload: { loadingKey: 'tariffsInfo', value: true },
          type: setLoading.type,
        });
        slice.caseReducers.setError(state, {
          payload: { errorKey: 'tariffsInfo', value: initialState.error.tariffsInfo },
          type: setError.type,
        });
      })
      .addCase(getFullTariffsInfo.fulfilled, (state, action) => {
        slice.caseReducers.setTariffs(state, {
          payload: action.payload,
          type: setTariffs.type,
        });
        slice.caseReducers.setLoading(state, {
          payload: { loadingKey: 'tariffsInfo', value: false },
          type: setLoading.type,
        });
        slice.caseReducers.setError(state, {
          payload: { errorKey: 'tariffsInfo', value: initialState.error.tariffsInfo },
          type: setError.type,
        });
      })
      .addCase(getFullTariffsInfo.rejected, (state, action) => {
        slice.caseReducers.setLoading(state, {
          payload: { loadingKey: 'tariffsInfo', value: false },
          type: setLoading.type,
        });
        slice.caseReducers.setError(state, {
          payload: { errorKey: 'tariffsInfo', value: action.payload as NetworkErrorDetailsWithBody<any> }, //TODO: remove this cast after fix with rejectedValue
          type: setError.type,
        });
      })
      .addCase(updateContractorStatus.pending, state => {
        slice.caseReducers.setLoading(state, {
          payload: { loadingKey: 'general', value: true },
          type: setLoading.type,
        });
        slice.caseReducers.setError(state, {
          payload: { errorKey: 'general', value: initialState.error.general },
          type: setError.type,
        });
      })
      .addCase(updateContractorStatus.fulfilled, (state, action) => {
        slice.caseReducers.setContractorState(state, {
          payload: action.meta.arg,
          type: setContractorState.type,
        });
        slice.caseReducers.setLoading(state, {
          payload: { loadingKey: 'general', value: false },
          type: setLoading.type,
        });
        slice.caseReducers.setError(state, {
          payload: { errorKey: 'general', value: initialState.error.general },
          type: setError.type,
        });
      })
      .addCase(updateContractorStatus.rejected, (state, action) => {
        slice.caseReducers.setLoading(state, {
          payload: { loadingKey: 'general', value: false },
          type: setLoading.type,
        });
        slice.caseReducers.setError(state, {
          payload: { errorKey: 'general', value: action.payload as NetworkErrorDetailsWithBody<any> }, //TODO: remove this cast after fix with rejectedValue
          type: setError.type,
        });
      })
      .addCase(sendSelectedTariffs.pending, state => {
        slice.caseReducers.setLoading(state, {
          payload: { loadingKey: 'general', value: true },
          type: setLoading.type,
        });
        slice.caseReducers.setError(state, {
          payload: { errorKey: 'general', value: initialState.error.general },
          type: setError.type,
        });
      })
      .addCase(sendSelectedTariffs.fulfilled, (state, action) => {
        const updatedTariffs = state.tariffs.map(tariff => {
          const matchingTariff = action.payload.find(selectedTariff => selectedTariff.id === tariff.id);

          return {
            ...tariff,
            isSelected: matchingTariff ? matchingTariff.isSelected : false,
          };
        });

        state.tariffs = updatedTariffs;
      })
      .addCase(sendSelectedTariffs.rejected, (state, action) => {
        slice.caseReducers.setLoading(state, {
          payload: { loadingKey: 'general', value: false },
          type: setLoading.type,
        });
        slice.caseReducers.setError(state, {
          payload: { errorKey: 'general', value: action.payload as NetworkErrorDetailsWithBody<any> }, //TODO: remove this cast after fix with rejectedValue
          type: setError.type,
        });
      })
      //TODO: Use this case when work with preferences
      // Not needed for now
      .addCase(sendSelectedPreferences.fulfilled, (state, action) => {
        slice.caseReducers.setPreferences(state, {
          payload: action.meta.arg.selectedPreferences,
          type: setPreferences.type,
        });
      })
      //TODO: Use this case when work with preferences
      // Not needed for now
      .addCase(getPreferences.fulfilled, (state, action) => {
        slice.caseReducers.setPreferences(state, {
          payload: action.payload,
          type: setPreferences.type,
        });
      })
      //TODO: Use this case when work with achievements
      // Not needed for now
      .addCase(getAchievements.fulfilled, (state, action) => {
        slice.caseReducers.setAchievements(state, {
          payload: action.payload,
          type: setAchievements.type,
        });
      })
      .addCase(getSubscriptionStatus.fulfilled, (state, action) => {
        slice.caseReducers.setSubscriptionStatus(state, {
          payload: action.payload,
          type: setSubscriptionStatus.type,
        });
      });
  },
});

export const {
  setContractorId,
  setTariffs,
  setLoading,
  setError,
  setPreferences,
  setAchievements,
  revertPreferenceFieldById,
  setContractorInfo,
  setContractorAvatar,
  setVehicleData,
  setContractorState,
  setContractorZone,
  updateContractorInfo,
  setSubscriptionStatus,
} = slice.actions;

export default slice.reducer;
