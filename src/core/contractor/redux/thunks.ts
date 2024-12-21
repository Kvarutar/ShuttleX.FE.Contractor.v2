import { convertBlobToImgUri, getNetworkErrorInfo, Nullable } from 'shuttlex-integration';

import { createAppAsyncThunk } from '../../redux/hooks';
import { contractorZoneSelector, primaryTariffSelector } from './selectors';
import {
  AchievementsAPIResponse,
  ContractorInfo,
  ContractorInfoAPIResponse,
  ContractorStatus,
  GetContractorAvatarAPIResponse,
  GetOrUpdateZoneAPIResponse,
  PreferenceInfo,
  TariffAdditionalInfoAPIResponse,
  TariffInfo,
  TariffInfoByTariffsAPIResponse,
  UpdateProfileLanguageAPIRequest,
  UpdateSelectedTariffsAPIRequest,
  Zone,
} from './types';
import { tariffsNamesByFeKey } from './utils/getTariffNamesByFeKey';

export const getOrUpdateZone = createAppAsyncThunk<Nullable<Zone>, void>(
  'contractor/getOrUpdateZone',
  async (_, { rejectWithValue, profileAxios, getState }) => {
    const state = getState();
    let urlPart = '/zone/up-to-date';

    const defaultLocation = state.geolocation.coordinates;
    if (defaultLocation) {
      urlPart = `${urlPart}?Latitude=${defaultLocation.latitude}&Longitude=${defaultLocation.longitude}`;
    }
    try {
      const response = await profileAxios.post<GetOrUpdateZoneAPIResponse[]>(urlPart);

      const zone =
        response.data.find(el => el.locationType === 'City') ?? response.data.find(el => el.locationType === 'Country');

      return zone ?? null;
    } catch (error) {
      return rejectWithValue(getNetworkErrorInfo(error));
    }
  },
);

//TODO: Add popup when request is rejected
export const getContractorInfo = createAppAsyncThunk<{ contractorInfo: ContractorInfo; avatarURL: string }, void>(
  'contractor/getContractorInfo',
  async (_, { rejectWithValue, contractorAxios }) => {
    try {
      const [contractorInfoResponse, contractorAvatarResponse] = await Promise.allSettled([
        contractorAxios.get<ContractorInfoAPIResponse>('/info'),
        contractorAxios.get<GetContractorAvatarAPIResponse>('/avatar', { responseType: 'blob' }),
      ]);

      let contractorInfo: ContractorInfo;
      let avatarURL = '';

      if (contractorInfoResponse.status === 'fulfilled') {
        contractorInfo = {
          ...contractorInfoResponse.value.data,
          status: 'offline',
        };

        switch (contractorInfoResponse.value.data.state) {
          case 'WaitingOrder':
          case 'InOrderProcessingWithNextPickUp':
          case 'InOrderProcessingWithNextStopPoint':
          case 'InOrderProcessingWithNextDropOff':
            contractorInfo.status = 'online';
            break;
          default:
            contractorInfo.status = 'offline';
        }
      } else {
        return rejectWithValue(getNetworkErrorInfo(contractorInfoResponse.reason));
      }

      if (contractorAvatarResponse.status === 'fulfilled') {
        avatarURL = await convertBlobToImgUri(contractorAvatarResponse.value.data);
      }

      return { contractorInfo, avatarURL };
    } catch (error) {
      return rejectWithValue(getNetworkErrorInfo(error));
    }
  },
);

//TODO: Refactor return value, set it after waiting success response (without payload return)
export const updateContractorStatus = createAppAsyncThunk<ContractorStatus, ContractorStatus>(
  'contractor/updateContractorStatus',
  async (payload, { rejectWithValue, contractorAxios }) => {
    try {
      const endpoint = payload === 'offline' ? '/set-offline' : '/set-online';
      await contractorAxios.post(endpoint);

      if (payload === 'online') {
        return 'offline';
      }
      return 'online';
    } catch (error) {
      const { code, body, status } = getNetworkErrorInfo(error);
      return rejectWithValue({
        code,
        body,
        status,
      });
    }
  },
);

export const getFullTariffsInfo = createAppAsyncThunk<TariffInfo[], void>(
  'contractor/getFullTariffsInfo',
  async (_, { rejectWithValue, contractorAxios, configAxios, getState }) => {
    try {
      const zone = contractorZoneSelector(getState());
      const zoneId = zone?.id;

      const [primaryTariffsInfoResponse, additionalTariffsInfoResponse] = await Promise.all([
        contractorAxios.get<TariffInfoByTariffsAPIResponse[]>('/tariffs'),
        configAxios.get<TariffAdditionalInfoAPIResponse[]>(`/zones/${zoneId}/tariffs`),
      ]);

      const primaryTariffsInfo = primaryTariffsInfoResponse.data;
      const additionalTariffsInfo = additionalTariffsInfoResponse.data;

      const updatedTariffs: TariffInfo[] = [];

      primaryTariffsInfo.forEach(primaryTariff => {
        const matchingTariff = additionalTariffsInfo.find(additionalTariff => additionalTariff.id === primaryTariff.id);

        if (matchingTariff) {
          updatedTariffs.push({
            ...primaryTariff,
            name: tariffsNamesByFeKey[matchingTariff.feKey],
            feKey: matchingTariff.feKey,
            currencyCode: matchingTariff.currencyCode,
            freeWaitingTimeMin: matchingTariff.freeWaitingTimeMin,
            paidWaitingTimeFeePriceMin: matchingTariff.paidWaitingTimeFeePriceMin,
            maxSeatsCount: matchingTariff.maxSeatsCount,
            maxLuggagesCount: matchingTariff.maxLuggagesCount,
          });
        }
      });
      return updatedTariffs;
    } catch (error) {
      return rejectWithValue(getNetworkErrorInfo(error));
    }
  },
);

//TODO: Refactor return value, set it after waiting success response (without payload return)
export const sendSelectedTariffs = createAppAsyncThunk<
  TariffInfo[],
  { selectedTariffs: TariffInfo[]; contractorId: string }
>('contractor/sendSelectedTariffs', async (payload, { rejectWithValue, contractorAxios, getState }) => {
  const tariffIds = payload.selectedTariffs.map(tariff => tariff.id);
  try {
    const primaryTariff = primaryTariffSelector(getState());

    // If we have issue on back and primary tariff isn't selected
    if (tariffIds.length === 0 && primaryTariff) {
      tariffIds.push(primaryTariff.id);
    }

    await contractorAxios.patch('/update-selected-tariff', {
      tariffIds,
    } as UpdateSelectedTariffsAPIRequest);

    return payload.selectedTariffs;
  } catch (error) {
    return rejectWithValue(getNetworkErrorInfo(error));
  }
});

export const updateProfileLanguage = createAppAsyncThunk<void, string>(
  'contractor/updateProfileLanguage',
  async (payload, { rejectWithValue, profileAxios }) => {
    try {
      profileAxios.post<void>('/profile/languages', {
        type: 0,
        value: payload,
      } as UpdateProfileLanguageAPIRequest);
    } catch (error) {
      return rejectWithValue(getNetworkErrorInfo(error));
    }
  },
);

//TODO: There's just example! Rewrite when info about "preferences" logic is known
export const sendSelectedPreferences = createAppAsyncThunk<
  void,
  { selectedPreferences: PreferenceInfo[]; contractorId: string }
>('contractor/sendSelectedPreferences', async () => {
  //const preferenceNames = payload.selectedPreferences.map(preference => preference.name);
  // try {
  //   const response = await fetch(`${Config.API_URL_HTTPS}/tariff/update-contractor-selected-preferences`, {
  //     method: 'POST',
  //     headers: {
  //       Accept: 'application/json',
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({
  //       preferenceNames,
  //     }),
  //   });
  //   if (!response.ok) {
  //     throw 'Error occured during fetching seleted tariffs';
  //   }
  // } catch (error) {
  //   return rejectWithValue(error);
  // }
});

//TODO: There's just example! Rewrite when info about "preferences" logic will be known
export const getPreferences = createAppAsyncThunk<PreferenceInfo[], { contractorId: string }>(
  'contractor/getPreferences',
  async () => {
    // try {
    //   return await shuttlexContractorInstance.get(`/preferences/contractor/${payload.contractorId}`, {});
    // } catch (error) {
    //   const { code, message } = getAxiosErrorInfo(error);
    //   return rejectWithValue({
    //     code,
    //     message,
    //   });
    // }
    return [
      {
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa1', // Random value
        name: 'CryptoPayment',
        isAvailable: true,
        isSelected: false,
      },
      {
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa2', // Random value
        name: 'CashPayment',
        isAvailable: false,
        isSelected: false,
      },
    ];
  },
);

//TODO: There's just example! Rewrite when info about "achievements" logic will be known
export const getAchievements = createAppAsyncThunk<AchievementsAPIResponse[], { contractorId: string }>(
  'contractor/getAchievements',
  async () => {
    //TODO: Add networking
    // try {
    //   return await shuttlexContractorInstance.get(`/achievements/contractor/${payload.contractorId}`, {});
    // } catch (error) {
    //   const { code, message } = getAxiosErrorInfo(error);
    //   return rejectWithValue({
    //     code,
    //     message,
    //   });
    // }
    const achievementsFromBack: AchievementsAPIResponse[] = [
      {
        key: 'complete_your_profile',
        isDone: true,
        pointsAmount: 125,
      },
      {
        key: 'invite_a_friend',
        isDone: false,
        pointsAmount: 225,
      },
      {
        key: 'finish_your_first_ride',
        isDone: false,
        pointsAmount: 325,
      },
      {
        key: 'finish_your_second_ride',
        isDone: false,
        pointsAmount: 325,
      },
    ];
    return achievementsFromBack;
  },
);

//TODO: There's just example! Rewrite when info about "subscription status" logic will be known
export const getSubscriptionStatus = createAppAsyncThunk<boolean, { contractorId: string }>(
  'contractor/getSubscriptionStatus',
  async () => {
    //TODO: Add networking
    // try {
    //   return await shuttlexContractorInstance.get(`/contractor/subscriptionStatus/${payload.contractorId}`, {});
    // } catch (error) {
    //   const { code, message } = getAxiosErrorInfo(error);
    //   return rejectWithValue({
    //     code,
    //     message,
    //   });
    // }
    return false;
  },
);
