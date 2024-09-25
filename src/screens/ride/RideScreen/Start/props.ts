import { RefObject } from 'react';
import { BottomWindowWithGestureRef, SquareButtonModes, SwipeButtonModes } from 'shuttlex-integration';

import { AchievementsAPIResponse, ContractorStatus } from '../../../../core/contractor/redux/types';

export type HiddenPartProps = {
  isOpened: boolean;
  bottomWindowRef: RefObject<BottomWindowWithGestureRef>;
  lineState: lineStateTypes;
  setIsAchievementsPopupVisible: (newState: boolean) => void;
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

export type AchievementsCarouselProps = {
  setIsAchievementsPopupVisible: (newState: boolean) => void;
};

export type AchievementsSliderItemProps = {
  item: AchievementsAPIResponse;
  setIsAchievementsPopupVisible: (newState: boolean) => void;
};
