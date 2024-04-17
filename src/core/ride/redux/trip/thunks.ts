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
          offerId: '5D9C4BD6-A9B5-42C1-AD2B-1ACD369FB426',
          decision: payload,
        }),
      });
      if (!response.ok) {
        throw 'Error occured during resolving offer';
      }
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const fetchArrivedToPickUp = createAppAsyncThunk<void, void>(
  'trip/fetchArrivedToPickUp',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${Config.API_URL_HTTPS}/order/arrived-to-pick-up`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          //TODO: orderId,
          orderId: '5D9C4BD6-A9B5-42C1-AD2B-1ACD369FB426',
        }),
      });
      if (!response.ok) {
        throw 'Error occured during fetching arriving to pick up point';
      }
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const fetchArrivedToStopPoint = createAppAsyncThunk<void, void>(
  'trip/fetchArrivedToStopPoint',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${Config.API_URL_HTTPS}/order/arrived-to-stop-point`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          //TODO: orderId,
          orderId: '5D9C4BD6-A9B5-42C1-AD2B-1ACD369FB426',
        }),
      });
      if (!response.ok) {
        throw 'Error occured during fetching arriving to stop point';
      }
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const fetchArrivedToDropOff = createAppAsyncThunk<void, void>(
  'trip/fetchArrivedToDropOff',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${Config.API_URL_HTTPS}/order/arrived-to-drop-off`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          //TODO: orderId,
          orderId: '5D9C4BD6-A9B5-42C1-AD2B-1ACD369FB426',
        }),
      });
      if (!response.ok) {
        throw 'Error occured during fetching arriving to drop off point';
      }
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const fetchPickedUpAtPickUpPoint = createAppAsyncThunk<void, void>(
  'trip/fetchPickedUpAtPickUpPoint',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${Config.API_URL_HTTPS}/order/picked-up-passenger-on-pick-up-point`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          //TODO: orderId,
          orderId: '5D9C4BD6-A9B5-42C1-AD2B-1ACD369FB426',
        }),
      });
      if (!response.ok) {
        throw 'Error occured during fetching picking up at pick up point';
      }
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const fetchPickedUpAtStopPoint = createAppAsyncThunk<void, void>(
  'trip/fetchPickedUpAtStopPoint',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${Config.API_URL_HTTPS}/order/picked-up-passenger-on-stop-point`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          //TODO: orderId,
          orderId: '5D9C4BD6-A9B5-42C1-AD2B-1ACD369FB426',
        }),
      });
      if (!response.ok) {
        throw 'Error occured during fetching picking up at stop point';
      }
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);
