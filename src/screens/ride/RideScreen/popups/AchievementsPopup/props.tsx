import { RefObject } from 'react';
import { BottomWindowWithGestureRef } from 'shuttlex-integration';

export type AchievementsPopupProps = {
  setIsAchievementsPopupVisible: (newState: boolean) => void;
  achievementsBottomWindowRef: RefObject<BottomWindowWithGestureRef>;
};

export type HiddenPartProps = {
  bottomWindowRef: RefObject<BottomWindowWithGestureRef>;
};
