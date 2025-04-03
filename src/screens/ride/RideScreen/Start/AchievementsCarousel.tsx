import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { useSelector } from 'react-redux';
import { RoundCheckIcon3, sizes, Text, useTheme, WINDOW_WIDTH } from 'shuttlex-integration';

import { achievementsSelector } from '../../../../core/contractor/redux/selectors';
import { useAchievement } from '../../../../shared/Achievements';
import { AchievementsCarouselProps, AchievementsSliderItemProps } from './types';

const carouselAnimationDurations = {
  scroll: 500,
  opacity: 200,
};

const AchievementsCarousel = ({ setIsAchievementsPopupVisible }: AchievementsCarouselProps) => {
  const achievements = useSelector(achievementsSelector);

  const computedStyles = StyleSheet.create({
    carousel: {
      width: WINDOW_WIDTH,
      marginBottom: 8,
      marginLeft: sizes.paddingHorizontal,
    },
  });

  if (achievements.length === 0) {
    return;
  }

  if (achievements.length > 1) {
    return (
      <View>
        <Carousel
          loop
          width={230} // width of SliderItem
          height={130} // height of SliderItem
          style={computedStyles.carousel}
          data={achievements}
          scrollAnimationDuration={carouselAnimationDurations.scroll}
          renderItem={({ item }) => (
            <SliderItem item={item} setIsAchievementsPopupVisible={setIsAchievementsPopupVisible} />
          )}
        />
      </View>
    );
  }

  return <SliderItem item={achievements[0]} setIsAchievementsPopupVisible={setIsAchievementsPopupVisible} />;
};

const SliderItem = ({ item, setIsAchievementsPopupVisible }: AchievementsSliderItemProps) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const achievement = useAchievement(item.key);

  const computedStyles = StyleSheet.create({
    title: {
      color: colors.textPrimaryColor,
    },
    carouselItemWrapper: {
      borderColor: colors.borderColor,
    },
    chargedPoints: {
      color: colors.textSecondaryColor,
    },
    pointsAmountContainer: {
      backgroundColor: colors.primaryColor,
    },
  });

  return (
    <Pressable
      style={[styles.carouselItemWrapper, computedStyles.carouselItemWrapper]}
      onPress={() => setIsAchievementsPopupVisible(true)}
    >
      <View style={styles.headerContainer}>
        {achievement.icon}
        {item.isDone && <RoundCheckIcon3 />}
      </View>
      <Text numberOfLines={1} style={[styles.title, computedStyles.title]}>
        {achievement.text}
      </Text>
      <View style={styles.chargedPointsContainer}>
        <Text style={[styles.chargedPoints, computedStyles.chargedPoints]}>
          {t('ride_Ride_AchievementsCarousel_charged')}
        </Text>
        <View style={[styles.pointsAmountContainer, computedStyles.pointsAmountContainer]}>
          <Text style={[styles.pointsAmount]}>
            {t('ride_Ride_AchievementsCarousel_points', { pointsAmount: item.pointsAmount })}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  carouselItemWrapper: {
    flex: 1,
    paddingLeft: 16,
    paddingRight: 8,
    paddingBottom: 10,
    paddingTop: 8,
    marginRight: 6,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderRadius: 12,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 36,
    marginBottom: 'auto',
  },
  title: {
    fontFamily: 'Inter Bold',
    fontSize: 17,
    marginBottom: 4,
  },
  chargedPointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chargedPoints: {
    fontFamily: 'Inter Medium',
    fontSize: 14,
  },
  pointsAmountContainer: {
    padding: 4,
    borderRadius: 8,
  },
  pointsAmount: {
    fontFamily: 'Inter Medium',
    fontSize: 14,
  },
});

export default AchievementsCarousel;
