import Config from 'react-native-config';

import { createAppAsyncThunk } from '../../redux/hooks';
import { AchievementsAPIResponse, ContractorStatus, PreferenceInfo, TariffInfo } from './types';

export const sendSelectedTariffs = createAppAsyncThunk<void, { selectedTariffs: TariffInfo[]; contractorId: string }>(
  'contractor/sendSelectedTariffs',
  async (payload, { rejectWithValue }) => {
    const tariffNames = payload.selectedTariffs.map(tariff => tariff.name);
    try {
      const response = await fetch(`${Config.API_URL_HTTPS}/tariff/update-contractor-selected-tariffs`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tariffNames,
        }),
      });

      if (!response.ok) {
        throw 'Error occured during fetching seleted tariffs';
      }
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

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

export const updateContractorStatus = createAppAsyncThunk<ContractorStatus, ContractorStatus>(
  'contractor/updateContractorStatus',
  async (payload, { rejectWithValue }) => {
    // const urlPath = payload === 'online' ? 'make-contractor-state-waiting-order' : 'make-contractor-state-out-of-work';

    try {
      //TODO: Add networking
      // const response = await fetch(`${Config.API_URL_HTTPS}/contractor/${urlPath}`, { method: 'POST' });

      // if (!response.ok) {
      //   if (response.status === 400) {
      //     return rejectWithValue(response.json());
      //   }
      //   throw 'Error occured during updating contractor state';
      // }
      if (payload === 'online') {
        return 'offline';
      }
      return 'online';
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

//TODO: There's just example! Rewrite when info about "preferences" logic is known
export const getTariffs = createAppAsyncThunk<TariffInfo[], { contractorId: string }>('trip/getTariffs', async () => {
  // try {
  //   return await shuttlexContractorInstance.get(`/tariffs/contractor/${payload.contractorId}`, {});
  // } catch (error) {
  //   const { code, message } = getAxiosErrorInfo(error);
  //   return rejectWithValue({
  //     code,
  //     message,
  //   });
  // }
  const tariffsFromBack: TariffInfo[] = [
    {
      id: '3fa85f64-5717-4562-b3fc-2c963f66afa1', // Random value
      name: 'BasicXL',
      isAvailable: true,
      isPrimary: false,
      isSelected: false,
      seatsAmount: 4,
      baggageAmount: 3,
    },
    {
      id: '3fa85f64-5717-4562-b3fc-2c963f66afa6', // Random value
      name: 'Basic',
      isAvailable: true,
      isPrimary: true,
      isSelected: true,
      seatsAmount: 3,
      baggageAmount: 2,
    },
    {
      id: '3fa85f64-5717-4562-b3fc-2c963f66afa2', // Random value
      name: 'ComfortPlus',
      isAvailable: false,
      isPrimary: false,
      isSelected: false,
      seatsAmount: 3,
      baggageAmount: 2,
    },
    {
      id: '3fa85f64-5717-4562-b3fc-2c963f66afa3', // Random value
      name: 'Business',
      isAvailable: false,
      isPrimary: false,
      isSelected: false,
      seatsAmount: 3,
      baggageAmount: 2,
    },
    {
      id: '3fa85f64-5717-4562-b3fc-2c963f66afa4', // Random value
      name: 'Eco',
      isAvailable: false,
      isPrimary: false,
      isSelected: false,
      seatsAmount: 4,
      baggageAmount: 3,
    },
  ];
  return tariffsFromBack;
});

//TODO: There's just example! Rewrite when info about "preferences" logic will be known
export const getPreferences = createAppAsyncThunk<PreferenceInfo[], { contractorId: string }>(
  'trip/getPreferences',
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
  'trip/getAchievements',
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
        key: 'finish_your_first_ride',
        isDone: false,
        pointsAmount: 325,
      },
    ];
    return achievementsFromBack;
  },
);
