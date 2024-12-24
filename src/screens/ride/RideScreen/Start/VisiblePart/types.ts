import { RefObject } from 'react';
import { BottomWindowWithGestureRef, SquareButtonModes, SwipeButtonModes } from 'shuttlex-integration';

import { ContractorStatus } from '../../../../../core/contractor/redux/types';

export type ProfileInfoProps = {
  bottomWindowRef: RefObject<BottomWindowWithGestureRef>;
  lineState: lineStateTypes;
  setIsAchievementsPopupVisible: (newState: boolean) => void;
  setIsAccountIsNotActivePopupVisible: (isVisible: boolean) => void;
};

export type StatusProps = {
  bottomWindowRef: RefObject<BottomWindowWithGestureRef>;
  setIsPreferencesPopupVisible: (isPreferencesPopupVisible: boolean) => void;
  lineState: lineStateTypes;
};

export type VisiblePartProps = {
  isOpened: boolean;
  bottomWindowRef: RefObject<BottomWindowWithGestureRef>;
  setIsPreferencesPopupVisible: (isPreferencesPopupVisible: boolean) => void;
  setIsAchievementsPopupVisible: (newState: boolean) => void;
  lineState: lineStateTypes;
  setIsAccountIsNotActivePopupVisible: (isVisible: boolean) => void;
};

export type lineStateTypes = {
  popupTitle: string;
  toLineState: ContractorStatus;
  bottomTitle: string;
  buttonText: string;
  buttonMode: SquareButtonModes;
  swipeMode: SwipeButtonModes;
};
