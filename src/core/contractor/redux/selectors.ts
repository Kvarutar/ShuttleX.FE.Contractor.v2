import { createSelector } from '@reduxjs/toolkit';

import { AppState } from '../../redux/store';

export const tariffsSelector = (state: AppState) => state.contractor.tariffs;
export const selectedTariffsSelector = createSelector([tariffsSelector], tariffs =>
  tariffs.filter(tariff => tariff.isSelected),
);
export const sortedTariffsSelector = createSelector([tariffsSelector], tariffs =>
  tariffs.slice().sort((a, b) => {
    // primary tariff will be first in slider
    return b.isPrimary === a.isPrimary ? 0 : b.isPrimary ? 1 : -1;
  }),
);
export const availableTariffsSelector = createSelector([tariffsSelector], tariffs =>
  tariffs
    .filter(tariff => tariff.isAvailable)
    .sort((a, b) => {
      // primary tariff will be first in slider
      return b.isPrimary === a.isPrimary ? 0 : b.isPrimary ? 1 : -1;
    }),
);
export const primaryTariffSelector = createSelector([tariffsSelector], tariffs =>
  tariffs?.find(tariff => tariff.isPrimary),
);
export const preferencesSelector = (state: AppState) => state.contractor.preferences;
export const selectedPreferencesSelector = createSelector([preferencesSelector], preferences =>
  preferences.filter(preference => preference.isSelected),
);
export const contractorInfoSelector = (state: AppState) => state.contractor.info;
export const contractorAvatarSelector = (state: AppState) => state.contractor.avatarURL;
export const achievementsSelector = (state: AppState) => state.contractor.achievements;
export const doneAchievementsSelector = createSelector([achievementsSelector], achievements =>
  achievements.filter(achievement => achievement.isDone),
);
export const ordersHistorySelector = (state: AppState) => state.contractor.ordersHistory;

export const contractorZoneSelector = (state: AppState) => state.contractor.zone;
export const contractorInfoStateSelector = (state: AppState) => state.contractor.info.state;
export const contractorStatusSelector = (state: AppState) => state.contractor.info.status;
export const contractorSubscriptionStatusSelector = (state: AppState) => state.contractor.subscriptionStatus;
export const isOrdersHistoryOffsetEmptySelector = (state: AppState) => state.contractor.isOrdersHistoryOffsetEmpty;

//Errors selectors
export const tariffsInfoErrorSelector = (state: AppState) => state.contractor.error.tariffsInfo;
export const contractorInfoErrorSelector = (state: AppState) => state.contractor.error.contractorInfo;
export const contractorGeneralErrorSelector = (state: AppState) => state.contractor.error.general;

//Loadings selectors
export const isTariffsInfoLoadingSelector = (state: AppState) => state.contractor.loading.tariffsInfo;
export const isContractorInfoLoadingSelector = (state: AppState) => state.contractor.loading.contractorInfo;
export const isContractorGeneralLoadingSelector = (state: AppState) => state.contractor.loading.general;
export const isOrdersHistoryLoadingSelector = (state: AppState) => state.contractor.loading.orderHistory;
