import Config from 'react-native-config';

import { createAppAsyncThunk } from '../../../redux/hooks';

export const responseToOffer = createAppAsyncThunk<void, boolean>(
  'trip/responseToOffer',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await fetch(`${Config.API_URL_HTTPS}/contractor/make-decision-about-offer`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          //TODO: receivedOfferId,
          decision: payload,
        }),
      });
      if (!response.ok) {
        throw new Error('Error occured during fetching response to offer');
      }
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);
