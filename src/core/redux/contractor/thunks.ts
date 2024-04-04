import Config from 'react-native-config';
import { TariffType } from 'shuttlex-integration';

import { createAppAsyncThunk } from '../hooks';

export const sendSelectedTariffs = createAppAsyncThunk<TariffType[], TariffType[]>(
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
          //TODO: contractorId,
          tariffNames: payload,
        }),
      });

      if (!response.ok) {
        throw 'Error occured during fetching seleted tariffs';
      }

      return payload;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);
