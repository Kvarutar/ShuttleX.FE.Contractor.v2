import React from 'react';
import { BottomWindowWithGesture } from 'shuttlex-integration';

import HiddenPart from './HiddenPart';
import { OrderProps } from './props';
import VisiblePart from './VisiblePart';

const Order = ({ offer, rideStatus, setRideStatus, endRide }: OrderProps) => {
  return (
    <BottomWindowWithGesture
      visiblePart={
        <VisiblePart offer={offer} rideStatus={rideStatus} setRideStatus={setRideStatus} endRide={endRide} />
      }
      hiddenPart={<HiddenPart offer={offer} rideStatus={rideStatus} />}
    />
  );
};

export default Order;
