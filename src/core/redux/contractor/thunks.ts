import Config from 'react-native-config';
import { TariffType } from 'shuttlex-integration';

import { createAppAsyncThunk } from '../hooks';
import { ContractorStatus } from './types';

export const sendSelectedTariffs = createAppAsyncThunk<void, TariffType[]>(
  'contractor/sendSelectedTariffs',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await fetch(`${Config.API_URL_HTTPS}/tariff/update-contractor-selected-tariffs`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tariffNames: payload,
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

export const updateContractorStatus = createAppAsyncThunk<void, ContractorStatus>(
  'contractor/updateContractorStatus',
  async (payload, { rejectWithValue }) => {
    const urlPath = payload === 'online' ? 'make-contractor-state-waiting-order' : 'make-contractor-state-out-of-work';

    try {
      const response = await fetch(`${Config.API_URL_HTTPS}/contractor/${urlPath}`, { method: 'POST' });

      if (!response.ok) {
        if (response.status === 400) {
          return rejectWithValue(response.json());
        }
        throw 'Error occured during updating contractor state';
      }
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);
