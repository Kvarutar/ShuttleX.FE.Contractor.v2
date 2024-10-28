import { AchievementsAPIResponse } from '../../../../core/contractor/redux/types';

export type AchievementsCarouselProps = {
  setIsAchievementsPopupVisible: (newState: boolean) => void;
};

export type AchievementsSliderItemProps = {
  item: AchievementsAPIResponse;
  setIsAchievementsPopupVisible: (newState: boolean) => void;
};
