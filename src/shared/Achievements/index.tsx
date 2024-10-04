import { useTranslation } from 'react-i18next';

import CompleteYourProfile from './svg/CompleteYourProfile';
import FinishYourFirstRide from './svg/FinishYourFirstRide';
import InviteAFriend from './svg/InviteAFriend';
import { AchievementsIcons, AchievementsKeys } from './types';

export const useAchievement = (key: AchievementsKeys) => {
  const { t } = useTranslation();

  const icons: AchievementsIcons = {
    finish_your_first_ride: {
      text: t('Achievements_FinishYourFirstRide'),
      icon: <FinishYourFirstRide />,
    },
    finish_your_second_ride: {
      text: t('Achievements_FinishYourSecondRide'),
      icon: <FinishYourFirstRide />,
    },
    invite_a_friend: {
      text: t('Achievements_InviteAFriend'),
      icon: <InviteAFriend />,
    },
    complete_your_profile: {
      text: t('Achievements_CompleteYourProfile'),
      icon: <CompleteYourProfile />,
    },
  };

  return icons[key];
};
