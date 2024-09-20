import { StyleProp, TextStyle } from 'react-native';

import { OfferType } from '../../../../core/ride/redux/trip/types';

export type OfferProps = {
  offer: OfferType;
  onOfferAccept: () => void;
  onOfferDecline: () => void;
  onClose: () => void;
};

export type OfferItemProps = {
  address: string;
  pointName: string;
  isDropOff: boolean;
  isStopPoint?: boolean;
  style: StyleProp<TextStyle>;
  setIsShowMorePoints?: (isShowMorePoints: boolean) => void;
  numberOfAdditionalPoints?: number;
};
