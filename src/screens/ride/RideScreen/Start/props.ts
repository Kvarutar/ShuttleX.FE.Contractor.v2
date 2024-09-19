import { RefObject } from 'react';
import { BottomWindowWithGestureRef, SquareButtonModes, SwipeButtonModes } from 'shuttlex-integration';

import { ContractorStatus } from '../../../../core/contractor/redux/types';

export type HiddenPartProps = {
  isOpened: boolean;
  bottomWindowRef: RefObject<BottomWindowWithGestureRef>;
  lineState: lineStateTypes;
};

export type VisiblePartProps = {
  isOpened: boolean;
  bottomWindowRef: RefObject<BottomWindowWithGestureRef>;
  setIsPreferencesPopupVisible: (isPreferencesPopupVisible: boolean) => void;
  lineState: lineStateTypes;
};

export type RiderData = {
  likes: number;
  rides: number;
  car: {
    number: string;
    title: string;
    color: string;
  };
};

export type lineStateTypes = {
  popupTitle: string;
  toLineState: ContractorStatus;
  bottomTitle: string;
  buttonText: string;
  buttonMode: SquareButtonModes;
  swipeMode: SwipeButtonModes;
};
