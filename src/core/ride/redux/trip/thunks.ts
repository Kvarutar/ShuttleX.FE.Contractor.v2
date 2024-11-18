import { getNetworkErrorInfo, minToMilSec } from 'shuttlex-integration';

import { createAppAsyncThunk } from '../../../redux/hooks';
import { OfferAPIResponse, OfferDropOffAPIResponse, OfferPickUpAPIResponse } from './types';

export const fetchOfferInfo = createAppAsyncThunk<OfferAPIResponse, string>(
  'trip/fetchOfferInfo',
  async (offerId, { rejectWithValue, offersAxios }) => {
    try {
      const response = await offersAxios.get<OfferAPIResponse>(`/${offerId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(getNetworkErrorInfo(error));
    }
  },
);

export const fetchWayPointsRoute = createAppAsyncThunk<
  { pickup: OfferPickUpAPIResponse; dropoff: OfferDropOffAPIResponse },
  { pickUpRouteId: string; dropOffRouteId: string }
>(
  'trip/fetchWayPointsRoute',
  async ({ pickUpRouteId, dropOffRouteId }, { rejectWithValue, offersAxios, ordersAxios }) => {
    try {
      const [pickupResponse, dropoffResponse] = await Promise.all([
        offersAxios.get<OfferPickUpAPIResponse>(`/routes/${pickUpRouteId}/to-pick-up`),
        ordersAxios.get<OfferDropOffAPIResponse>(`/routes/${dropOffRouteId}/to-drop-off`),
      ]);

      return {
        pickup: pickupResponse.data,
        dropoff: dropoffResponse.data,
      };
    } catch (error) {
      return rejectWithValue(getNetworkErrorInfo(error));
    }
  },
);

export const responseToOffer = createAppAsyncThunk<void, boolean>(
  'trip/responseToOffer',
  async (payload, { rejectWithValue, contractorAxios }) => {
    try {
      await contractorAxios.post('/contractor/make-decision-about-offer', {
        //TODO: receivedOfferId,
        offerId: '5D9C4BD6-A9B5-42C1-AD2B-1ACD369FB426',
        decision: payload,
      });
    } catch (error) {
      return rejectWithValue(getNetworkErrorInfo(error));
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
      return rejectWithValue(getNetworkErrorInfo(error));
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
      return rejectWithValue(getNetworkErrorInfo(error));
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
      return rejectWithValue(getNetworkErrorInfo(error));
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
      return rejectWithValue(getNetworkErrorInfo(error));
    }
  },
);

export const fetchPickedUpAtStopPoint = createAppAsyncThunk<void, void>(
  'trip/fetchPickedUpAtStopPoint',
  async (_, { rejectWithValue, contractorAxios }) => {
    try {
      await contractorAxios.post('/contractor/order/picked-up-passenger-on-stop-point', {
        //TODO: orderId,
        orderId: '5D9C4BD6-A9B5-42C1-AD2B-1ACD369FB426',
      });
    } catch (error) {
      return rejectWithValue(getNetworkErrorInfo(error));
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
