import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList } from '../../../Navigate/props';

export type RideScreenProps = NativeStackScreenProps<RootStackParamList, 'Ride'>;

export enum DocResponseStatus {
  None = 'None',
  UnderReview = 'UnderReview',
  RequireUpdate = 'RequireUpdate',
  Expired = 'Expired',
  Approved = 'Approved',
}
