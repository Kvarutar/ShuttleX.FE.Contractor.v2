import { RefObject } from 'react';
import { BottomWindowWithGestureRef } from 'shuttlex-integration';

import { AchievementsAPIResponse } from '../../../../core/contractor/redux/types';

export type StartProps = {
  bottomWindowRef: RefObject<BottomWindowWithGestureRef>;
  preferencesBottomWindowRef: RefObject<BottomWindowWithGestureRef>;
  achievementsBottomWindowRef: RefObject<BottomWindowWithGestureRef>;
};

export type AchievementsCarouselProps = {
  setIsAchievementsPopupVisible: (newState: boolean) => void;
};

export type AchievementsSliderItemProps = {
  item: AchievementsAPIResponse;
  setIsAchievementsPopupVisible: (newState: boolean) => void;
};
