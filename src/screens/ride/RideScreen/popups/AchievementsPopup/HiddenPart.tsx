import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import {
  Button,
  CircleAnimatedProgress,
  FlatListWithCustomScroll,
  RoundCheckIcon3,
  SquareButtonModes,
  Text,
  useTheme,
} from 'shuttlex-integration';

import { achievementsSelector, doneAchievementsSelector } from '../../../../../core/contractor/redux/selectors';
import { AchievementsAPIResponse } from '../../../../../core/contractor/redux/types';
import { useAchievement } from '../../../../../shared/Achievements';
import { HiddenPartProps } from './props';

const constants = {
  itemHeight: 80,
  itemsGap: 8,
  visibleAchievementsCount: 3,
};

const HiddenPart = ({ bottomWindowRef }: HiddenPartProps) => {
  const { t } = useTranslation();
  const { colors } = useTheme();

  const achievements = useSelector(achievementsSelector);
  const doneAchievements = useSelector(doneAchievementsSelector);

  const allAchievementsDone = achievements.every(achievement => achievement.isDone);
  const percentDone = achievements.length > 0 ? Math.floor((doneAchievements.length / achievements.length) * 100) : 0;
  const totalPoints = achievements.reduce((sum, achievement) => {
    return sum + achievement.pointsAmount;
  }, 0);

  //TODO: Add logic sending data to back-end
  const handlePickUpKryptobara = async () => {
    bottomWindowRef.current?.closeWindow();
  };

  const computedStyles = StyleSheet.create({
    buttonText: {
      color: allAchievementsDone ? colors.textPrimaryColor : colors.textSecondaryColor,
    },
    rewards: {
      color: colors.textQuadraticColor,
    },
    completed: {
      color: colors.textQuadraticColor,
    },
    percent: {
      color: colors.textPrimaryColor,
    },
    achievementsContainer: {
      gap: constants.itemsGap,
    },
    flatListContainer: {
      height: (constants.itemHeight + constants.itemsGap) * constants.visibleAchievementsCount,
    },
  });

  return (
    <View style={styles.hiddenPartContentContainer}>
      <CircleAnimatedProgress completionPercentage={percentDone}>
        <View style={styles.circleTextsContainer}>
          <Text style={[styles.rewards, computedStyles.rewards]}>{t('ride_Ride_AchievementsPopup_rewards')}</Text>
          <Text style={[styles.percent, computedStyles.percent]}>{percentDone}%</Text>
          <Text style={[styles.completed, computedStyles.completed]}>{t('ride_Ride_AchievementsPopup_completed')}</Text>
        </View>
      </CircleAnimatedProgress>
      <View style={computedStyles.flatListContainer}>
        <FlatListWithCustomScroll
          withScroll
          contentContainerStyle={computedStyles.achievementsContainer}
          items={achievements}
          renderItem={({ item }) => <Achievement item={item} />}
        />
      </View>
      <Button
        disabled={!allAchievementsDone}
        text={t('ride_Ride_AchievementsPopup_pickUpKryptobara', { count: totalPoints })}
        textStyle={computedStyles.buttonText}
        mode={allAchievementsDone ? SquareButtonModes.Mode1 : SquareButtonModes.Mode5}
        onPress={handlePickUpKryptobara}
      />
    </View>
  );
};

const Achievement = ({ item }: { item: AchievementsAPIResponse }) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const achievement = useAchievement(item.key);

  const computedStyles = StyleSheet.create({
    itemContainer: {
      backgroundColor: colors.backgroundSecondaryColor,
      height: constants.itemHeight,
    },
    itemIconContainer: {
      backgroundColor: colors.backgroundPrimaryColor,
    },
    itemChargedPoints: {
      color: colors.textSecondaryColor,
    },
  });

  return (
    <View style={[styles.itemContainer, computedStyles.itemContainer]}>
      <View style={[styles.itemIconContainer, computedStyles.itemIconContainer]}>{achievement.icon}</View>
      <View style={styles.itemInfoContainer}>
        <Text style={styles.itemTitle}>{achievement.text}</Text>
        <Text style={[styles.itemChargedPoints, computedStyles.itemChargedPoints]}>
          {t('ride_Ride_AchievementsPopup_chargedPoints', { count: item.pointsAmount })}
        </Text>
      </View>
      {item.isDone && (
        <View style={styles.checkIconContainer}>
          <RoundCheckIcon3 />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  hiddenPartContentContainer: {
    gap: 24,
  },
  circleTextsContainer: {
    gap: 8,
    alignItems: 'center',
  },
  rewards: {
    fontFamily: 'Inter Medium',
  },
  percent: {
    fontSize: 32,
  },
  completed: {
    fontFamily: 'Inter Medium',
  },
  itemContainer: {
    flexDirection: 'row',
    padding: 15,
    borderRadius: 16,
    gap: 14,
  },
  itemIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
    width: 50,
    height: 50,
  },
  itemInfoContainer: {
    gap: 8,
  },
  itemTitle: {
    fontFamily: 'Inter Bold',
    fontSize: 17,
  },
  itemChargedPoints: {
    fontFamily: 'Inter Medium',
    fontSize: 14,
  },
  checkIconContainer: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
});

export default HiddenPart;
