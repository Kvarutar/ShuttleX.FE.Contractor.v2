import { StyleProp, TextStyle } from 'react-native';

export type OfferProps = {
  address: string;
  pointName: string;
  isDropOff: boolean;
  style: StyleProp<TextStyle>;
  setItemHeight?: (height: number) => void;
  index?: number;
  setIsShowMorePoints?: (isShowMorePoints: boolean) => void;
  numberOfAdditionalPoints?: number;
};
