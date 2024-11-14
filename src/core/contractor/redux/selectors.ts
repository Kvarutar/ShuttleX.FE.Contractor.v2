import { createSelector } from '@reduxjs/toolkit';

import { AppState } from '../../redux/store';

export const contractorIdSelector = (state: AppState) => state.contractor.contractorId;
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
  tariffs.find(tariff => tariff.isPrimary),
);
export const preferencesSelector = (state: AppState) => state.contractor.preferences;
export const selectedPreferencesSelector = createSelector([preferencesSelector], preferences =>
  preferences.filter(preference => preference.isSelected),
);
export const profileSelector = (state: AppState) => state.contractor.profile;
export const carDataSelector = (state: AppState) => state.contractor.carData;
export const achievementsSelector = (state: AppState) => state.contractor.achievements;
export const doneAchievementsSelector = createSelector([achievementsSelector], achievements =>
  achievements.filter(achievement => achievement.isDone),
);

export const contractorZoneSelector = (state: AppState) => state.contractor.zone;
export const contractorStatusSelector = (state: AppState) => state.contractor.status;
export const contractorSubscriptionStatusSelector = (state: AppState) => state.contractor.subscriptionStatus;
