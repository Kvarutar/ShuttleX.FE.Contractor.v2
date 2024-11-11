import { getNetworkErrorInfo, minToMilSec } from 'shuttlex-integration';

import { createAppAsyncThunk } from '../../../redux/hooks';

export const responseToOffer = createAppAsyncThunk<void, boolean>(
  'trip/responseToOffer',
  async (payload, { rejectWithValue, shuttlexContractorAxios }) => {
    try {
      await shuttlexContractorAxios.post('/contractor/make-decision-about-offer', {
        //TODO: receivedOfferId,
        offerId: '5D9C4BD6-A9B5-42C1-AD2B-1ACD369FB426',
        decision: payload,
      });
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

export const fetchArrivedToPickUp = createAppAsyncThunk<void, void>(
  'trip/fetchArrivedToPickUp',
  async (_, { rejectWithValue }) => {
    try {
      //TODO: Add networking,
      // await shuttlexContractorInstance.post('/contractor/order/arrived-to-pick-up', {
      //   orderId: '5D9C4BD6-A9B5-42C1-AD2B-1ACD369FB426',
      // });
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

export const fetchArrivedToStopPoint = createAppAsyncThunk<void, void>(
  'trip/fetchArrivedToStopPoint',
  async (_, { rejectWithValue }) => {
    try {
      //TODO: Add networking,
      // await shuttlexContractorInstance.post('/contractor/order/arrived-to-stop-point', {
      //   orderId: '5D9C4BD6-A9B5-42C1-AD2B-1ACD369FB426',
      // });
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

export const fetchArrivedToDropOff = createAppAsyncThunk<void, void>(
  'trip/fetchArrivedToDropOff',
  async (_, { rejectWithValue }) => {
    try {
      //TODO: Add networking,
      // await shuttlexContractorInstance.post('/contractor/order/arrived-to-drop-off', {
      //   orderId: '5D9C4BD6-A9B5-42C1-AD2B-1ACD369FB426',
      // });
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

export const fetchPickedUpAtPickUpPoint = createAppAsyncThunk<{ fulltime: number }, void>(
  'trip/fetchPickedUpAtPickUpPoint',
  async (_, { rejectWithValue }) => {
    try {
      //TODO: Add networking,
      // await shuttlexContractorInstance.post('/contractor/order/picked-up-passenger-on-pick-up-point', {
      //   orderId: '5D9C4BD6-A9B5-42C1-AD2B-1ACD369FB426',
      // });

      // Returning for rendering a correct time for trip
      return {
        fulltime: Date.now() + minToMilSec(25),
      };
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

export const fetchPickedUpAtStopPoint = createAppAsyncThunk<void, void>(
  'trip/fetchPickedUpAtStopPoint',
  async (_, { rejectWithValue, shuttlexContractorAxios }) => {
    try {
      await shuttlexContractorAxios.post('/contractor/order/picked-up-passenger-on-stop-point', {
        //TODO: orderId,
        orderId: '5D9C4BD6-A9B5-42C1-AD2B-1ACD369FB426',
      });
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

export const getCanceledTripsAmount = createAppAsyncThunk<number, { contractiorId: string }>(
  'trip/getCanceledTripsAmount',
  async (_, { getState }) => {
    //TODO: Add networking
    // await shuttlexContractorInstance.post('/contractor/order/picked-up-passenger-on-stop-point', {
    //   //TODO: orderId,
    //   orderId: '5D9C4BD6-A9B5-42C1-AD2B-1ACD369FB426',
    // });

    //TODO: Remove this logic and add a logic for receiving a current state from back-end
    const tripState = getState().trip;

    return tripState.canceledTripsAmount;
  },
);

export const fetchCancelTrip = createAppAsyncThunk<boolean, void>('trip/fetchCancelTrip', async () => {
  //TODO: Add networking
  // await shuttlexContractorInstance.post('/contractor/order/picked-up-passenger-on-stop-point', {
  //   //TODO: orderId,
  //   orderId: '5D9C4BD6-A9B5-42C1-AD2B-1ACD369FB426',
  // });
  return true;
});
