import { ReactNode } from 'react';

export type AchievementsKeys =
  | 'finish_your_first_ride'
  | 'invite_a_friend'
  | 'complete_your_profile'
  | 'finish_your_second_ride';

export type AchievementsIcons = Record<AchievementsKeys, { text: string; icon: ReactNode }>;
