import Config from 'react-native-config';
import { getNetworkErrorInfo } from 'shuttlex-integration';

import { createAppAsyncThunk } from '../../redux/hooks';
import {
  AchievementsAPIResponse,
  ContractorInfo,
  ContractorInfoAPIResponse,
  ContractorStatus,
  PreferenceInfo,
  TariffAdditionalInfoAPIResponse,
  TariffInfo,
  TariffInfoByTariffsAPIResponse,
  UpdateSelectedTariffsAPIRequest,
} from './types';
import { tariffsNamesByFeKey } from './utils/getTariffNamesByFeKey';

//TODO: Add popup when request is rejected
export const getContractorInfo = createAppAsyncThunk<
  { contractorInfo: Omit<ContractorInfo, 'email' | 'phone'>; avatar: string },
  void
>('contractor/getContractorInfo', async (_, { rejectWithValue, contractorAxios }) => {
  try {
    //TODO: Return second value 'contractorAvatarResponse', when rewrite logic for avatar
    const [contractorInfoResponse] = await Promise.all([
      contractorAxios.get<ContractorInfoAPIResponse>('/info'),
      // contractorAxios.get<GetContractorAvatarAPIResponse>('/avatar'),
    ]);

    const contractorInfo: Omit<ContractorInfo, 'email' | 'phone'> = {
      ...contractorInfoResponse.data,
      state: 'offline',
    };

    switch (contractorInfoResponse.data.state) {
      case 'WaitingOrder':
      case 'InOrderProcessingWithNextStopPoint':
      case 'InOrderProcessingWithNextDropOff':
        contractorInfo.state = 'online';
        break;
      default:
        contractorInfo.state = 'offline';
    }

    //TODO: Rewrite with a correct data

    // const avatarBlob: contractorAvatarResponse.data;
    // const src = URL.createObjectURL(blob);

    const src = '';

    return { contractorInfo, avatar: src };
  } catch (error) {
    const { code, body, status } = getNetworkErrorInfo(error);
    return rejectWithValue({
      code,
      body,
      status,
    });
  }
});

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
  async (_, { rejectWithValue, contractorAxios, configAxios }) => {
    try {
      //TODO: Rewrite with the current zoneId
      const zoneId = '5c203285-eba2-41c8-b8f1-0543510480f2';

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
      const { code, body, status } = getNetworkErrorInfo(error);
      return rejectWithValue({
        code,
        body,
        status,
      });
    }
  },
);

//TODO: Refactor return value, set it after waiting success response (without payload return)
export const sendSelectedTariffs = createAppAsyncThunk<
  TariffInfo[],
  { selectedTariffs: TariffInfo[]; contractorId: string }
>('contractor/sendSelectedTariffs', async (payload, { rejectWithValue, contractorAxios }) => {
  const tariffIds = payload.selectedTariffs.map(tariff => tariff.id);
  try {
    await contractorAxios.patch('/update-selected-tariff', {
      tariffIds,
    } as UpdateSelectedTariffsAPIRequest);

    return payload.selectedTariffs;
  } catch (error) {
    const { code, body, status } = getNetworkErrorInfo(error);
    return rejectWithValue({
      code,
      body,
      status,
    });
  }
});

//TODO: There's just example! Rewrite when info about "profile" logic will be known
export const updateProfileData = createAppAsyncThunk<
  ContractorInfo,
  { contractorId: string; updatedData: Partial<ContractorInfo> & { avatar?: string } }
>('contractor/updateProfileData', async (payload, { rejectWithValue }) => {
  try {
    const response = await fetch(`${Config.API_URL_HTTPS}/contractor/update-profile/${payload.contractorId}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...payload.updatedData }),
    });

    if (!response.ok) {
      throw new Error('Error occurred during profile update');
    }

    const updatedProfile = await response.json();
    return updatedProfile;
  } catch (error) {
    return rejectWithValue(error);
  }
});

//TODO: There's just example! Rewrite when info about "preferences" logic is known
export const sendSelectedPreferences = createAppAsyncThunk<
  void,
  { selectedPreferences: PreferenceInfo[]; contractorId: string }
>('contractor/sendSelectedPreferences', async (payload, { rejectWithValue }) => {
  const preferenceNames = payload.selectedPreferences.map(preference => preference.name);
  try {
    const response = await fetch(`${Config.API_URL_HTTPS}/tariff/update-contractor-selected-preferences`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        preferenceNames,
      }),
    });

    if (!response.ok) {
      throw 'Error occured during fetching seleted tariffs';
    }
  } catch (error) {
    return rejectWithValue(error);
  }
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
