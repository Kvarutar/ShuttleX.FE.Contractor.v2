import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NetworkErrorDetailsWithBody, Nullable } from 'shuttlex-integration';

import {
  getAchievements,
  getContractorInfo,
  getFullTariffsInfo,
  getOrdersHistory,
  getOrUpdateZone,
  getPreferences,
  getSubscriptionStatus,
  sendSelectedPreferences,
  sendSelectedTariffs,
  updateContractorStatus,
} from './thunks';
import {
  AchievementsAPIResponse,
  type ContractorInfo,
  ContractorState,
  ContractorStateErrorKey,
  ContractorStateLoadingKey,
  ContractorStatus,
  GetOrUpdateZoneAPIResponse,
  PreferenceInfo,
  TariffInfoFromAPI,
  VehicleData,
} from './types';

const initialState: ContractorState = {
  //TODO: Remove contractorId and Profile value when logic for receiving it will be added
  tariffs: [],
  preferences: [],
  achievements: [],
  ordersHistory: [],
  isOrdersHistoryOffsetEmpty: false,
  info: {
    id: '',
    name: '',
    email: '',
    phone: '',
    state: 'OutOfWork',
    status: 'offline',
    level: 0,
    totalRidesCount: 0,
    totalLikesCount: 0,
    earnedToday: 0,
    previousOrderEarned: 0,
    vehicle: null,
  },
  avatarURL: '',
  zone: null,
  subscriptionStatus: false,
  error: {
    general: null, // for all for non-parallel errors
    contractorInfo: null,
    tariffsInfo: null,
    orderHistory: null,
  },
  loading: {
    general: false, // for all for non-parallel loadings
    contractorInfo: false,
    tariffsInfo: false,
    orderHistory: false,
  },
  ui: {
    isLoadingStubVisible: true,
    activeBottomWindowYCoordinate: null,
  },
};

const slice = createSlice({
  name: 'contractor',
  initialState,
  reducers: {
    setContractorId(state, action: PayloadAction<string>) {
      state.info.id = action.payload;
    },
    setIsLoadingStubVisible(state, action: PayloadAction<boolean>) {
      state.ui.isLoadingStubVisible = action.payload;
    },
    setActiveBottomWindowYCoordinate(
      state,
      action: PayloadAction<ContractorState['ui']['activeBottomWindowYCoordinate']>,
    ) {
      state.ui.activeBottomWindowYCoordinate = action.payload;
    },
    setTariffs(state, action: PayloadAction<TariffInfoFromAPI[]>) {
      state.tariffs = action.payload;
    },
    setError(
      state,
      action: PayloadAction<{
        errorKey: ContractorStateErrorKey;
        value: Nullable<NetworkErrorDetailsWithBody<any>>;
      }>,
    ) {
      state.error[action.payload.errorKey] = action.payload.value;
    },
    setLoading(state, action: PayloadAction<{ loadingKey: ContractorStateLoadingKey; value: boolean }>) {
      state.loading[action.payload.loadingKey] = action.payload.value;
    },
    setContractorStatus(state, action: PayloadAction<ContractorStatus>) {
      if (state.info) {
        state.info.status = action.payload;
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
    setContractorInfo(state, action: PayloadAction<ContractorInfo>) {
      state.info = action.payload;
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

    setContractorZone(state, action: PayloadAction<GetOrUpdateZoneAPIResponse>) {
      state.zone = action.payload;
    },
    setSubscriptionStatus(state, action: PayloadAction<boolean>) {
      state.subscriptionStatus = action.payload;
    },

    clearOrdersHistory(state) {
      state.ordersHistory = initialState.ordersHistory;
      state.isOrdersHistoryOffsetEmpty = initialState.isOrdersHistoryOffsetEmpty;
    },

    clearContractorState(state) {
      //Add some states if need
      state.zone = initialState.zone;
      state.tariffs = initialState.tariffs;
      state.avatarURL = initialState.avatarURL;
      state.info = initialState.info;
      state.achievements = initialState.achievements;
      state.preferences = initialState.preferences;
    },
  },

  extraReducers: builder => {
    builder
      .addCase(getOrUpdateZone.fulfilled, (state, action) => {
        if (action.payload) {
          slice.caseReducers.setContractorZone(state, {
            payload: action.payload,
            type: setContractorZone.type,
          });
        }
      })
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
        slice.caseReducers.setContractorStatus(state, {
          payload: action.meta.arg,
          type: setContractorStatus.type,
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
      })

      .addCase(getOrdersHistory.pending, state => {
        slice.caseReducers.setLoading(state, {
          payload: { loadingKey: 'orderHistory', value: true },
          type: setLoading.type,
        });
        slice.caseReducers.setError(state, {
          payload: { errorKey: 'orderHistory', value: null },
          type: setError.type,
        });
      })
      .addCase(getOrdersHistory.fulfilled, (state, action) => {
        if (action.payload.length) {
          state.ordersHistory.push(...action.payload);
        } else {
          state.isOrdersHistoryOffsetEmpty = true;
        }

        slice.caseReducers.setLoading(state, {
          payload: { loadingKey: 'orderHistory', value: false },
          type: setLoading.type,
        });
        slice.caseReducers.setError(state, {
          payload: { errorKey: 'orderHistory', value: null },
          type: setError.type,
        });
      })
      .addCase(getOrdersHistory.rejected, (state, action) => {
        slice.caseReducers.setLoading(state, {
          payload: { loadingKey: 'orderHistory', value: false },
          type: setLoading.type,
        });
        slice.caseReducers.setError(state, {
          payload: { errorKey: 'orderHistory', value: action.payload as NetworkErrorDetailsWithBody<any> },
          type: setError.type,
        });
      });
  },
});

export const {
  clearContractorState,
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
  setContractorStatus,
  setContractorZone,
  updateContractorInfo,
  setSubscriptionStatus,
  setIsLoadingStubVisible,
  clearOrdersHistory,
  setActiveBottomWindowYCoordinate,
} = slice.actions;

export default slice.reducer;
