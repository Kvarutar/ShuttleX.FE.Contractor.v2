import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList } from '../../Navigate/props';

export enum RideStatus {
  Idle = 'idle',
  Arriving = 'arriving',
  ArrivingAtStopPoint = 'arrivingAtStopPoint',
  Arrived = 'arrived',
  ArrivedAtStopPoint = 'arrivedAtStopPoint',
  Ride = 'ride',
  Ending = 'ending',
}

export type passengerInfoType = {
  name: string;
  lastName: string;
  phone: string;
};

export type offerType = {
  startPosition: string;
  targetPointsPosition: string[];
  passengerId: string;
  passenger: passengerInfoType;
};

export type RideScreenProps = NativeStackScreenProps<RootStackParamList, 'Ride'>;
