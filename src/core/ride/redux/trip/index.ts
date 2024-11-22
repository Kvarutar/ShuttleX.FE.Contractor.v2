import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NetworkErrorDetailsWithBody } from 'shuttlex-integration';

import { TariffInfo } from '../../../contractor/redux/types';
import {
  acceptOffer,
  fetchArrivedToDropOff,
  fetchArrivedToPickUp,
  fetchArrivedToStopPoint,
  fetchCancelTrip,
  fetchOfferInfo,
  fetchPickedUpAtPickUpPoint,
  fetchPickedUpAtStopPoint,
  fetchWayPointsRoute,
  updatePassengerRating,
} from './thunks';
import {
  OfferAPIResponse,
  OfferInfo,
  OfferWayPointsData,
  OfferWayPointsDataAPIResponse,
  OrderType,
  PassengerInfoAPIResponse,
  TripState,
  TripStatus,
} from './types';

const initialState: TripState = {
  order: null,
  offer: {
    //TODO: Just for test
    offerInfo: {
      id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      pickUpAddress: 'Kharkiv, Sumska street 10A',
      stopPointAddresses: ['Kharkiv, Maydan Nezalejnosti 10B'],
      dropOffAddress: 'Kharkiv, Maydan Nezalejnosti 5B',
      timeToPickUp: '2024-11-19T17:36:28.303023+02:00',
      timeToDropOff: '2024-11-19T17:40:26.640436+02:00',
      timeToAnswerSec: 15,
      tariffId: '0cb16278-bf7c-4a42-b30e-2b1aee25b306',
      distanceKm: 5,
      price: 150,
      pricePerKm: 30,
      currency: 'UAH',
      pickUpRouteId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      dropOffRouteId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    },
    pickUpPoint: {
      routeId: 'string',
      totalDistanceMtr: 0,
      totalDurationSec: 0,
      waypoints: [
        {
          location: {
            latitude: 0,
            longitude: 0,
          },
        },
      ],
      accurateGeometries: [
        {
          polylineStartIndex: 0,
          polylineEndIndex: 0,
          trafficLoad: 'string',
        },
      ],
      geometry: 'string',
      trafficLoad: 'string',
    },
    dropOffPoint: {
      routeId: 'string',
      totalDistanceMtr: 0,
      totalDurationSec: 0,
      waypoints: [
        {
          location: {
            latitude: 0,
            longitude: 0,
          },
        },
      ],
      accurateGeometries: [
        {
          polylineStartIndex: 0,
          polylineEndIndex: 0,
          trafficLoad: 'string',
        },
      ],
      geometry: 'string',
      trafficLoad: 'string',
    },
  },
  secondOrder: null,
  tripStatus: TripStatus.Idle,
  tripPoints: [],
  canceledTripsAmount: 0,
  isCanceledTripsPopupVisible: false,
  error: null,
  //TODO create selector and place where it needed
  isLoading: false,
};

const slice = createSlice({
  name: 'trip',
  initialState,
  reducers: {
    setOrder(
      state,
      action: PayloadAction<{
        tariffs: TariffInfo[];
        orderId: string;
        passengerInfo: PassengerInfoAPIResponse;
        passengerAvatarURL: string;
      }>,
    ) {
      if (state.offer) {
        const {
          pickUpAddress,
          stopPointAddresses,
          timeToPickUp,
          timeToDropOff,
          price,
          pricePerKm,
          tariffId,
          distanceKm,
          pickUpRouteId,
          dropOffRouteId,
        } = state.offer.offerInfo;
        const { orderId, passengerAvatarURL, passengerInfo, tariffs } = action.payload;

        const orderTariff = tariffs.find(tariff => tariff.id === tariffId);

        if (!orderTariff) {
          return;
        }

        const dropOffTime = new Date(timeToDropOff);
        const dropOffTimeInMs = dropOffTime.getTime() - Date.now();
        const dropOffTimeInMin = Math.floor(dropOffTimeInMs / 1000 / 60);

        const order: OrderType = {
          tariffId,
          pickUpAddress,
          price,
          pricePerKm,
          distanceKm,
          waitingTimeInMin: orderTariff.freeWaitingTimeMin,
          pricePerMin: orderTariff.paidWaitingTimeFeePriceMin,
          currencyCode: orderTariff.currencyCode,
          pickUpRouteId,
          dropOffRouteId,
          timeToPickUp: new Date(timeToPickUp).getTime(),
          timeToDropOffInMin: dropOffTimeInMin,
          stopPointAddresses: stopPointAddresses,
          id: orderId,
          passenger: {
            id: passengerInfo.id,
            name: passengerInfo.name,
            lastName: passengerInfo.lastName,
            phone: passengerInfo.phone,
            avatarURL: passengerAvatarURL,
          },
        };
        if (state.order && !state.secondOrder) {
          state.secondOrder = { ...order };
        } else if (!state.order) {
          state.order = order;
          state.tripPoints = [order.pickUpAddress, ...order.stopPointAddresses];
        }
      }
    },
    setTripOffer(state, action: PayloadAction<OfferAPIResponse>) {
      if (state.offer) {
        state.offer.offerInfo = action.payload;
      }
    },
    setTripError(state, action: PayloadAction<NetworkErrorDetailsWithBody<any> | null>) {
      state.error = action.payload;
    },
    setTripIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setWayPointsRoute(
      state,
      action: PayloadAction<{ pickup: OfferWayPointsDataAPIResponse; dropoff: OfferWayPointsDataAPIResponse }>,
    ) {
      if (state.offer) {
        state.offer.pickUpPoint = action.payload.pickup;
        state.offer.dropOffPoint = action.payload.dropoff;
      }
    },
    setPassengerAvatar(state, action: PayloadAction<string>) {
      if (state.order) {
        state.order.passenger.avatarURL = action.payload;
      }
    },
    setTripStatus(state, action: PayloadAction<TripStatus>) {
      state.tripStatus = action.payload;
    },
    rateTrip(state) {
      state.tripStatus = TripStatus.Rating;
    },
    endTrip(state) {
      if (state.secondOrder) {
        state.tripPoints = [state.secondOrder.pickUpAddress, ...state.secondOrder.stopPointAddresses];
        state.order = state.secondOrder;
        state.secondOrder = null;
      } else {
        state.order = initialState.order;
        state.tripPoints = initialState.tripPoints;
      }
      state.tripStatus = TripStatus.Idle;
    },
    setIsCanceledTripsPopupVisible(state, action: PayloadAction<boolean>) {
      state.isCanceledTripsPopupVisible = action.payload;
    },
    addCanceledTrip(state) {
      state.canceledTripsAmount++;
    },
    toNextTripPoint(state) {
      if (state.tripPoints.length) {
        state.tripPoints.shift();
        state.tripStatus = TripStatus.Ride;
      }
    },
    setOffer(state, action: PayloadAction<OfferInfo>) {
      if (state.offer) {
        state.offer.offerInfo = action.payload;
      }
    },
    setWayPointsPickUp(state, action: PayloadAction<OfferWayPointsData>) {
      if (state.offer) {
        state.offer.pickUpPoint = action.payload;
      }
    },
    setWayPointsDropOff(state, action: PayloadAction<OfferWayPointsData>) {
      if (state.offer) {
        state.offer.dropOffPoint = action.payload;
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchOfferInfo.pending, state => {
        slice.caseReducers.setTripIsLoading(state, {
          payload: true,
          type: setTripIsLoading.type,
        });
        slice.caseReducers.setTripError(state, {
          payload: initialState.error,
          type: setTripError.type,
        });
      })
      .addCase(fetchOfferInfo.fulfilled, (state, action) => {
        slice.caseReducers.setTripIsLoading(state, {
          payload: false,
          type: setTripIsLoading.type,
        });
        slice.caseReducers.setTripError(state, {
          payload: initialState.error,
          type: setTripError.type,
        });
        slice.caseReducers.setTripOffer(state, {
          payload: {
            ...action.payload,
            stopPointAddresses: [...action.payload.stopPointAddresses, action.payload.dropOffAddress],
          },
          type: setTripOffer.type,
        });
      })
      .addCase(fetchOfferInfo.rejected, (state, action) => {
        slice.caseReducers.setTripIsLoading(state, {
          payload: false,
          type: setTripIsLoading.type,
        });
        slice.caseReducers.setTripError(state, {
          payload: action.payload as NetworkErrorDetailsWithBody<any>, //TODO: remove this cast after fix with rejectedValue
          type: setTripError.type,
        });
      })
      .addCase(fetchWayPointsRoute.pending, state => {
        slice.caseReducers.setTripIsLoading(state, {
          payload: true,
          type: setTripIsLoading.type,
        });
        slice.caseReducers.setTripError(state, {
          payload: initialState.error,
          type: setTripError.type,
        });
      })
      .addCase(fetchWayPointsRoute.fulfilled, (state, action) => {
        slice.caseReducers.setTripIsLoading(state, {
          payload: false,
          type: setTripIsLoading.type,
        });
        slice.caseReducers.setTripError(state, {
          payload: initialState.error,
          type: setTripError.type,
        });
        slice.caseReducers.setWayPointsRoute(state, {
          payload: { pickup: action.payload.pickup, dropoff: action.payload.dropoff },
          type: setWayPointsRoute.type,
        });
      })
      .addCase(fetchWayPointsRoute.rejected, (state, action) => {
        slice.caseReducers.setTripIsLoading(state, {
          payload: false,
          type: setTripIsLoading.type,
        });
        slice.caseReducers.setTripError(state, {
          payload: action.payload as NetworkErrorDetailsWithBody<any>, //TODO: remove this cast after fix with rejectedValue
          type: setTripError.type,
        });
      })
      .addCase(acceptOffer.pending, state => {
        slice.caseReducers.setTripIsLoading(state, {
          payload: true,
          type: setTripIsLoading.type,
        });
        slice.caseReducers.setTripError(state, {
          payload: initialState.error,
          type: setTripError.type,
        });
      })
      .addCase(acceptOffer.fulfilled, (state, action) => {
        if (action.payload) {
          const { tariffs, orderId, passenger } = action.payload;
          slice.caseReducers.setOrder(state, {
            payload: { tariffs, orderId, passengerInfo: passenger.info, passengerAvatarURL: passenger.avatarURL },
            type: setOrder.type,
          });
          slice.caseReducers.setTripIsLoading(state, {
            payload: false,
            type: setTripIsLoading.type,
          });
          slice.caseReducers.setTripError(state, {
            payload: initialState.error,
            type: setTripError.type,
          });
        }
      })
      .addCase(acceptOffer.rejected, (state, action) => {
        slice.caseReducers.setTripIsLoading(state, {
          payload: false,
          type: setTripIsLoading.type,
        });
        slice.caseReducers.setTripError(state, {
          payload: action.payload as NetworkErrorDetailsWithBody<any>, //TODO: remove this cast after fix with rejectedValue
          type: setTripError.type,
        });
      })
      .addCase(fetchArrivedToPickUp.pending, state => {
        slice.caseReducers.setTripIsLoading(state, {
          payload: true,
          type: setTripIsLoading.type,
        });
        slice.caseReducers.setTripError(state, {
          payload: initialState.error,
          type: setTripError.type,
        });
      })
      .addCase(fetchArrivedToPickUp.fulfilled, state => {
        slice.caseReducers.setTripStatus(state, {
          payload: TripStatus.Arrived,
          type: setTripStatus.type,
        });
        slice.caseReducers.setTripIsLoading(state, {
          payload: false,
          type: setTripIsLoading.type,
        });
        slice.caseReducers.setTripError(state, {
          payload: initialState.error,
          type: setTripError.type,
        });
      })
      .addCase(fetchArrivedToPickUp.rejected, (state, action) => {
        slice.caseReducers.setTripIsLoading(state, {
          payload: false,
          type: setTripIsLoading.type,
        });
        slice.caseReducers.setTripError(state, {
          payload: action.payload as NetworkErrorDetailsWithBody<any>, //TODO: remove this cast after fix with rejectedValue
          type: setTripError.type,
        });
      })
      .addCase(fetchPickedUpAtPickUpPoint.pending, state => {
        slice.caseReducers.setTripIsLoading(state, {
          payload: true,
          type: setTripIsLoading.type,
        });
        slice.caseReducers.setTripError(state, {
          payload: initialState.error,
          type: setTripError.type,
        });
      })
      .addCase(fetchPickedUpAtPickUpPoint.fulfilled, state => {
        slice.caseReducers.toNextTripPoint(state);
        slice.caseReducers.setTripIsLoading(state, {
          payload: false,
          type: setTripIsLoading.type,
        });
        slice.caseReducers.setTripError(state, {
          payload: initialState.error,
          type: setTripError.type,
        });
      })
      .addCase(fetchPickedUpAtPickUpPoint.rejected, (state, action) => {
        slice.caseReducers.setTripIsLoading(state, {
          payload: false,
          type: setTripIsLoading.type,
        });
        slice.caseReducers.setTripError(state, {
          payload: action.payload as NetworkErrorDetailsWithBody<any>, //TODO: remove this cast after fix with rejectedValue
          type: setTripError.type,
        });
      })
      .addCase(updatePassengerRating.pending, state => {
        slice.caseReducers.setTripIsLoading(state, {
          payload: true,
          type: setTripIsLoading.type,
        });
        slice.caseReducers.setTripError(state, {
          payload: initialState.error,
          type: setTripError.type,
        });
      })
      .addCase(updatePassengerRating.fulfilled, state => {
        slice.caseReducers.setTripIsLoading(state, {
          payload: false,
          type: setTripIsLoading.type,
        });
        slice.caseReducers.setTripError(state, {
          payload: initialState.error,
          type: setTripError.type,
        });
      })
      .addCase(updatePassengerRating.rejected, (state, action) => {
        slice.caseReducers.setTripIsLoading(state, {
          payload: false,
          type: setTripIsLoading.type,
        });
        slice.caseReducers.setTripError(state, {
          payload: action.payload as NetworkErrorDetailsWithBody<any>, //TODO: remove this cast after fix with rejectedValue
          type: setTripError.type,
        });
      })
      //TODO: Rewtire when work with stop points
      // Not needed for now
      .addCase(fetchArrivedToStopPoint.fulfilled, state => {
        slice.caseReducers.setTripStatus(state, {
          payload: TripStatus.ArrivedAtStopPoint,
          type: setTripStatus.type,
        });
      })
      //TODO: Rewtire when work with stop points
      // Not needed for now
      .addCase(fetchPickedUpAtStopPoint.fulfilled, state => {
        slice.caseReducers.toNextTripPoint(state);
      })
      .addCase(fetchArrivedToDropOff.pending, state => {
        slice.caseReducers.setTripIsLoading(state, {
          payload: true,
          type: setTripIsLoading.type,
        });
        slice.caseReducers.setTripError(state, {
          payload: initialState.error,
          type: setTripError.type,
        });
      })
      .addCase(fetchArrivedToDropOff.fulfilled, state => {
        slice.caseReducers.rateTrip(state);
        slice.caseReducers.setTripIsLoading(state, {
          payload: false,
          type: setTripIsLoading.type,
        });
        slice.caseReducers.setTripError(state, {
          payload: initialState.error,
          type: setTripError.type,
        });
      })
      .addCase(fetchArrivedToDropOff.rejected, (state, action) => {
        slice.caseReducers.setTripIsLoading(state, {
          payload: false,
          type: setTripIsLoading.type,
        });
        slice.caseReducers.setTripError(state, {
          payload: action.payload as NetworkErrorDetailsWithBody<any>, //TODO: remove this cast after fix with rejectedValue
          type: setTripError.type,
        });
      })
      .addCase(fetchCancelTrip.pending, state => {
        slice.caseReducers.setTripIsLoading(state, {
          payload: true,
          type: setTripIsLoading.type,
        });
        slice.caseReducers.setTripError(state, {
          payload: initialState.error,
          type: setTripError.type,
        });
      })
      .addCase(fetchCancelTrip.fulfilled, state => {
        slice.caseReducers.addCanceledTrip(state);
        slice.caseReducers.setIsCanceledTripsPopupVisible(state, slice.actions.setIsCanceledTripsPopupVisible(true));
        slice.caseReducers.setTripIsLoading(state, {
          payload: false,
          type: setTripIsLoading.type,
        });
        slice.caseReducers.setTripError(state, {
          payload: initialState.error,
          type: setTripError.type,
        });
      })
      .addCase(fetchCancelTrip.rejected, (state, action) => {
        slice.caseReducers.setTripIsLoading(state, {
          payload: false,
          type: setTripIsLoading.type,
        });
        slice.caseReducers.setTripError(state, {
          payload: action.payload as NetworkErrorDetailsWithBody<any>, //TODO: remove this cast after fix with rejectedValue
          type: setTripError.type,
        });
      });
  },
});

export const {
  setOrder,
  setPassengerAvatar,
  setTripOffer,
  setTripStatus,
  rateTrip,
  toNextTripPoint,
  endTrip,
  addCanceledTrip,
  setIsCanceledTripsPopupVisible,
  setWayPointsRoute,
  setTripIsLoading,
  setTripError,
} = slice.actions;

export default slice.reducer;
