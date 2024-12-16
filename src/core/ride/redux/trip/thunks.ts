import { convertBlobToImgUri, getNetworkErrorInfo } from 'shuttlex-integration';

import { tariffsSelector } from '../../../contractor/redux/selectors';
import { createAppAsyncThunk } from '../../../redux/hooks';
import { geolocationCoordinatesSelector } from '../geolocation/selectors';
import { getOfferNetworkErrorInfo } from './errors';
import {
  AcceptOfferAPIResponse,
  AcceptOrDeclineOfferPayload,
  ArrivedToDropOffAPIRequest,
  ArrivedToDropOffPayload,
  ArrivedToPickUpAPIRequest,
  ArrivedToPickUpPayload,
  FetchCancelTripPayload,
  GetCurrentOrderAPIResponse,
  GetCurrentOrderThunkResult,
  GetFutureOrderAPIResponse,
  GetFutureOrderThunkResult,
  GetPassengerTripInfoPayload,
  GetPassengerTripInfoThunkResult,
  OfferAPIResponse,
  OfferDropOffAPIResponse,
  OfferPickUpAPIResponse,
  PassengerAvatarAPIResponse,
  PassengerInfoAPIResponse,
  PickedUpAtPickUpPointPayload,
  UpdatePassengerRatingAPIRequest,
  UpdatePassengerRatingPayload,
} from './types';

export const getCurrentOrder = createAppAsyncThunk<GetCurrentOrderThunkResult, void>(
  'trip/getCurrentOrder',
  async (_, { rejectWithValue, ordersAxios, dispatch }) => {
    try {
      const response = await ordersAxios.get<GetCurrentOrderAPIResponse>('/current');

      if (response.data) {
        const tripDetails = await dispatch(getPassengerTripInfo({ orderId: response.data.id })).unwrap();
        return {
          order: response.data,
          ...tripDetails,
        };
      }

      return null;
    } catch (error) {
      return rejectWithValue(getNetworkErrorInfo(error));
    }
  },
);

export const getFutureOrder = createAppAsyncThunk<GetFutureOrderThunkResult, void>(
  'trip/getFutureOrder',
  async (_, { rejectWithValue, ordersAxios, dispatch }) => {
    try {
      const response = await ordersAxios.get<GetFutureOrderAPIResponse>('/future');

      if (response.data) {
        const tripDetails = await dispatch(getPassengerTripInfo({ orderId: response.data.id })).unwrap();
        return {
          order: response.data,
          ...tripDetails,
        };
      }

      return null;
    } catch (error) {
      return rejectWithValue(getNetworkErrorInfo(error));
    }
  },
);

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

export const acceptOffer = createAppAsyncThunk<void, AcceptOrDeclineOfferPayload>(
  'trip/acceptOffer',
  async (payload, { rejectWithValue, offersAxios, dispatch }) => {
    try {
      await offersAxios.post<AcceptOfferAPIResponse>(`${payload.offerId}/accept`);

      await dispatch(getCurrentOrder());
    } catch (error) {
      return rejectWithValue(getOfferNetworkErrorInfo(error));
    }
  },
);

export const getPassengerTripInfo = createAppAsyncThunk<GetPassengerTripInfoThunkResult, GetPassengerTripInfoPayload>(
  'trip/getPassengerTripInfo',
  async (payload, { rejectWithValue, ordersAxios, getState }) => {
    try {
      const [passengerInfoResponse, passengerAvatarResponse] = await Promise.allSettled([
        ordersAxios.get<PassengerInfoAPIResponse>(`/${payload.orderId}/passenger/info`),
        ordersAxios.get<PassengerAvatarAPIResponse>(`/${payload.orderId}/passenger/avatar`, {
          responseType: 'blob',
        }),
      ]);

      let passengerInfo: PassengerInfoAPIResponse;
      let avatarURL = null;

      if (passengerInfoResponse.status === 'fulfilled') {
        passengerInfo = passengerInfoResponse.value.data;
      } else {
        return rejectWithValue(getOfferNetworkErrorInfo(passengerInfoResponse.reason));
      }
      if (passengerAvatarResponse.status === 'fulfilled') {
        avatarURL = await convertBlobToImgUri(passengerAvatarResponse.value.data);
      }

      return {
        orderId: payload.orderId,
        passenger: {
          info: passengerInfo,
          avatarURL,
        },
        tariffs: tariffsSelector(getState()),
      };
    } catch (error) {
      return rejectWithValue(getOfferNetworkErrorInfo(error));
    }
  },
);

export const declineOffer = createAppAsyncThunk<void, AcceptOrDeclineOfferPayload>(
  'trip/declineOffer',
  async (payload, { rejectWithValue, offersAxios }) => {
    try {
      await offersAxios.post(`/${payload.offerId}/decline`);
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

export const fetchArrivedToPickUp = createAppAsyncThunk<void, ArrivedToPickUpPayload>(
  'trip/fetchArrivedToPickUp',
  async (payload, { rejectWithValue, ordersAxios, getState }) => {
    try {
      const bodyPart: ArrivedToPickUpAPIRequest = geolocationCoordinatesSelector(getState()) ?? {
        latitude: 0,
        longitude: 0,
      };

      await ordersAxios.post(`/${payload.orderId}/arrived-to-pick-up`, bodyPart);
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

export const fetchPickedUpAtPickUpPoint = createAppAsyncThunk<void, PickedUpAtPickUpPointPayload>(
  'trip/fetchPickedUpAtPickUpPoint',
  async (payload, { rejectWithValue, ordersAxios }) => {
    try {
      await ordersAxios.post(`/${payload.orderId}/picked-up`);
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

export const fetchArrivedToDropOff = createAppAsyncThunk<void, ArrivedToDropOffPayload>(
  'trip/fetchArrivedToDropOff',
  async (payload, { rejectWithValue, ordersAxios, getState }) => {
    try {
      const bodyPart: ArrivedToDropOffAPIRequest = geolocationCoordinatesSelector(getState()) ?? {
        latitude: 0,
        longitude: 0,
      };

      await ordersAxios.post(`/${payload.orderId}/arrived-to-drop-off`, bodyPart);
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

export const updatePassengerRating = createAppAsyncThunk<void, UpdatePassengerRatingPayload>(
  'trip/updatePassengerRating',
  async (payload, { rejectWithValue, ordersAxios }) => {
    try {
      await ordersAxios.patch(`/${payload.orderId}/update-passenger-rating`, {
        rate: payload.rate,
      } as UpdatePassengerRatingAPIRequest);
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

export const fetchCancelTrip = createAppAsyncThunk<void, FetchCancelTripPayload>(
  'trip/fetchCancelTrip',
  async (payload, { rejectWithValue, ordersAxios }) => {
    try {
      await ordersAxios.post(`/${payload.orderId}/cancel`);
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

// This request is not needed for now
// Just example
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

// This request is not needed for now
// Just example
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
