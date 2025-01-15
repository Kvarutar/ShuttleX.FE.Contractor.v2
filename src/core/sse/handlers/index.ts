import { EventSourceEvent } from 'react-native-sse';

import { getContractorInfo } from '../../contractor/redux/thunks';
import { store } from '../../redux/store';
import { endTrip, resetCurrentRoutes, resetFutureRoutes, setSecondOrder, setTripStatus } from '../../ride/redux/trip';
import { fetchOfferInfo, getFinalCost } from '../../ride/redux/trip/thunks';
import { TripStatus } from '../../ride/redux/trip/types';
import { SSEAndNotificationsEventType } from '../../utils/notifications/types';
import { SSENewOfferEventData, SSEPassengerRejectedEventData } from './types';

export const newOfferSSEHandler = (
  event: EventSourceEvent<SSEAndNotificationsEventType.NewOffer, SSEAndNotificationsEventType>,
) => {
  if (event.data) {
    const data: SSENewOfferEventData = JSON.parse(event.data);

    store.dispatch(fetchOfferInfo(data.offerId));
  }
};

export const passengerRejectedSSEHandler = async (
  event: EventSourceEvent<SSEAndNotificationsEventType.PassengerRejected, SSEAndNotificationsEventType>,
) => {
  if (event.data) {
    const data: SSEPassengerRejectedEventData = JSON.parse(event.data);

    const { getState, dispatch } = store;
    const { trip } = getState();

    if (data.orderId === trip.order?.id) {
      if (trip.tripStatus === TripStatus.Ride || trip.tripStatus === TripStatus.Ending) {
        await dispatch(getFinalCost({ orderId: data.orderId }));
        dispatch(setTripStatus(TripStatus.Rating));
      }
      //Because this status might be changed in notifications also
      else if (trip.tripStatus !== TripStatus.Rating) {
        dispatch(endTrip());
        dispatch(resetCurrentRoutes());
      }
    } else {
      dispatch(setSecondOrder(null));
      dispatch(resetFutureRoutes());
    }

    dispatch(getContractorInfo());
  }
};
