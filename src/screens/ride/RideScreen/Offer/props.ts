import { StyleProp, TextStyle } from 'react-native';

import { OfferInfo } from '../../../../core/ride/redux/trip/types';

export type OfferProps = {
  offer: OfferInfo;
  onOfferAccept: () => void;
  onOfferDecline: () => void;
  onClose: () => void;
  onCloseAllBottomWindows: () => void;
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
