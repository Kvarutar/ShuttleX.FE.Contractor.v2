import { getAxiosErrorInfo } from 'shuttlex-integration';

import shuttlexContractorInstance from '../../../client';
import { createAppAsyncThunk } from '../../../redux/hooks';

export const responseToOffer = createAppAsyncThunk<void, boolean>(
  'trip/responseToOffer',
  async (payload, { rejectWithValue }) => {
    try {
      await shuttlexContractorInstance.post('/contractor/make-decision-about-offer', {
        //TODO: receivedOfferId,
        offerId: '5D9C4BD6-A9B5-42C1-AD2B-1ACD369FB426',
        decision: payload,
      });
    } catch (error) {
      const { code, message } = getAxiosErrorInfo(error);
      return rejectWithValue({
        code,
        message,
      });
    }
  },
);

export const fetchArrivedToPickUp = createAppAsyncThunk<void, void>(
  'trip/fetchArrivedToPickUp',
  async (_, { rejectWithValue }) => {
    try {
      await shuttlexContractorInstance.post('/contractor/order/arrived-to-pick-up', {
        //TODO: orderId,
        orderId: '5D9C4BD6-A9B5-42C1-AD2B-1ACD369FB426',
      });
    } catch (error) {
      const { code, message } = getAxiosErrorInfo(error);
      return rejectWithValue({
        code,
        message,
      });
    }
  },
);

export const fetchArrivedToStopPoint = createAppAsyncThunk<void, void>(
  'trip/fetchArrivedToStopPoint',
  async (_, { rejectWithValue }) => {
    try {
      await shuttlexContractorInstance.post('/contractor/order/arrived-to-stop-point', {
        //TODO: orderId,
        orderId: '5D9C4BD6-A9B5-42C1-AD2B-1ACD369FB426',
      });
    } catch (error) {
      const { code, message } = getAxiosErrorInfo(error);
      return rejectWithValue({
        code,
        message,
      });
    }
  },
);

export const fetchArrivedToDropOff = createAppAsyncThunk<void, void>(
  'trip/fetchArrivedToDropOff',
  async (_, { rejectWithValue }) => {
    try {
      await shuttlexContractorInstance.post('/contractor/order/arrived-to-drop-off', {
        //TODO: orderId,
        orderId: '5D9C4BD6-A9B5-42C1-AD2B-1ACD369FB426',
      });
    } catch (error) {
      const { code, message } = getAxiosErrorInfo(error);
      return rejectWithValue({
        code,
        message,
      });
    }
  },
);

export const fetchPickedUpAtPickUpPoint = createAppAsyncThunk<void, void>(
  'trip/fetchPickedUpAtPickUpPoint',
  async (_, { rejectWithValue }) => {
    try {
      await shuttlexContractorInstance.post('/contractor/order/picked-up-passenger-on-pick-up-point', {
        //TODO: orderId,
        orderId: '5D9C4BD6-A9B5-42C1-AD2B-1ACD369FB426',
      });
    } catch (error) {
      const { code, message } = getAxiosErrorInfo(error);
      return rejectWithValue({
        code,
        message,
      });
    }
  },
);

export const fetchPickedUpAtStopPoint = createAppAsyncThunk<void, void>(
  'trip/fetchPickedUpAtStopPoint',
  async (_, { rejectWithValue }) => {
    try {
      await shuttlexContractorInstance.post('/contractor/order/picked-up-passenger-on-stop-point', {
        //TODO: orderId,
        orderId: '5D9C4BD6-A9B5-42C1-AD2B-1ACD369FB426',
      });
    } catch (error) {
      const { code, message } = getAxiosErrorInfo(error);
      return rejectWithValue({
        code,
        message,
      });
    }
  },
);
