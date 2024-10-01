import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useSelector } from 'react-redux';
import {
  CrownIcon,
  Like2Icon,
  sizes,
  SteeringWheelIcon,
  SwipeButton,
  SwipeButtonModes,
  Text,
  TextElipsizeMode,
  useTheme,
} from 'shuttlex-integration';

import {
  contractorStatusSelector,
  profileSelector,
  selectedTariffsSelector,
} from '../../../../core/contractor/redux/selectors';
import { updateContractorStatus } from '../../../../core/contractor/redux/thunks';
import { ContractorStatus } from '../../../../core/contractor/redux/types';
import { useAppDispatch } from '../../../../core/redux/hooks';
import AchievementsCarousel from './AchievementsCarousel';
import { HiddenPartProps } from './props';

const animationDuration = 200;

const HiddenPart = ({ isOpened, bottomWindowRef, lineState, setIsAchievementsPopupVisible }: HiddenPartProps) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const profile = useSelector(profileSelector);
  const contractorStatus = useSelector(contractorStatusSelector);
  const selectedTariffs = useSelector(selectedTariffsSelector);

  const contractorStatusIsOffline = contractorStatus === 'offline';

  const computedStyles = StyleSheet.create({
    levelCounter: {
      color: colors.textSecondaryColor,
    },
    levelText: {
      color: colors.textQuadraticColor,
    },
    dot: {
      backgroundColor: colors.iconSecondaryColor,
    },
    carTitleContainer: {
      borderColor: colors.borderColor,
    },
    carIdContainer: {
      backgroundColor: colors.primaryColor,
    },
    bottomInfoWrapper: {
      paddingHorizontal: sizes.paddingHorizontal,
    },
    bottomInfo: {
      backgroundColor: colors.backgroundSecondaryColor,
    },
    bottomInfoTitle: {
      color: colors.textSecondaryColor,
    },
    bottomInfoText: {
      color: colors.textPrimaryColor,
    },
    likesAndRidesCounter: {
      color: colors.textSecondaryColor,
    },
    likesAndRidesText: {
      color: colors.textQuadraticColor,
    },
    steeringWheelIcon: {
      color: colors.textQuadraticColor,
    },
  });

  const swipeHandler = async (mode: ContractorStatus) => {
    await dispatch(updateContractorStatus(mode));
    bottomWindowRef.current?.closeWindow();
  };

  function formatBigNumbers(value: number): string {
    if (value >= 1000) {
      return Math.floor(value / 1000) + 'k';
    }
    return value.toString();
  }

  if (!isOpened || !profile) {
    return;
  }

  return (
    <Animated.View entering={FadeIn.duration(animationDuration)} exiting={FadeOut.duration(animationDuration)}>
      <View style={styles.levelContainer}>
        <CrownIcon />
        <View style={styles.levelTextsContainer}>
          <Text style={[styles.levelCounter, computedStyles.levelCounter]}>{profile.level}</Text>
          <Text style={[styles.levelText, computedStyles.levelText]}>lvl.</Text>
        </View>
      </View>
      <Text style={styles.namesText}>{profile.name + ' ' + profile.surname}</Text>
      <View style={styles.rideDataContainer}>
        <View style={styles.likesContainer}>
          <Like2Icon style={styles.likeIcon} />
          <Text style={computedStyles.likesAndRidesCounter}>{formatBigNumbers(profile.likes)}</Text>
          <Text style={[styles.likesAndRidesText, computedStyles.likesAndRidesText]}>{t('ride_Ride_Order_likes')}</Text>
        </View>
        <View style={styles.ridesContainer}>
          <View style={[styles.dot, computedStyles.dot]} />
          <SteeringWheelIcon color={computedStyles.steeringWheelIcon.color} />
          <Text style={computedStyles.likesAndRidesCounter}>{formatBigNumbers(profile.rides)}</Text>
          <Text style={[styles.likesAndRidesText, computedStyles.likesAndRidesText]}>{t('ride_Ride_Order_rides')}</Text>
        </View>
      </View>
      <View style={styles.carDataContainer}>
        <View style={[styles.carTitleContainer, computedStyles.carTitleContainer]}>
          <Text numberOfLines={1} style={styles.carTitleText}>
            {profile.carData.title}
          </Text>
        </View>
        <View style={[styles.carIdContainer, computedStyles.carIdContainer]}>
          <Text style={styles.carIdText}>{profile.carData.id}</Text>
        </View>
      </View>
      <AchievementsCarousel setIsAchievementsPopupVisible={setIsAchievementsPopupVisible} />
      <View style={[styles.bottomInfoWrapper, computedStyles.bottomInfoWrapper]}>
        <View style={[styles.tripTypeContainer, computedStyles.bottomInfo]}>
          <Text numberOfLines={1} style={[styles.bottomInfoTitle, computedStyles.bottomInfoTitle]}>
            {t('ride_Ride_Order_tripType')}
          </Text>
          <Text elipsizeMode={TextElipsizeMode.Tail} numberOfLines={1} style={styles.bottomInfoText}>
            {selectedTariffs.map(selectedTariff => selectedTariff.name).join(',')}
          </Text>
        </View>
        <View style={[styles.earnedTodayContainer, computedStyles.bottomInfo]}>
          <Text style={[styles.bottomInfoTitle, computedStyles.bottomInfoTitle]}>
            {t('ride_Ride_Order_earnedToday')}
          </Text>
          {/* TODO: Add "Earned today" state when it will be added */}
          <Text style={[styles.bottomInfoText, computedStyles.bottomInfoText]}>{'$0.0'}</Text>
        </View>
      </View>
      {/* //TODO: Add a component which render "remains to work" time  */}
      <View style={styles.swipeButtonContainer}>
        {contractorStatusIsOffline ? (
          <SwipeButton
            mode={SwipeButtonModes.Confirm}
            onSwipeEnd={() => swipeHandler(lineState.toLineState)}
            text={t('ride_Ride_Order_startRideButton')}
          />
        ) : (
          <SwipeButton
            mode={SwipeButtonModes.Decline}
            onSwipeEnd={() => swipeHandler(lineState.toLineState)}
            text={t('ride_Ride_Order_finishRideButton')}
          />
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  levelContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: -8,
  },
  levelTextsContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  levelCounter: {
    fontFamily: 'Inter Medium',
    fontSize: 14,
    lineHeight: 22,
  },
  levelText: {
    fontFamily: 'Inter Medium',
    fontSize: 14,
    lineHeight: 22,
  },
  namesText: {
    fontFamily: 'Inter Medium',
    textAlign: 'center',
    fontSize: 21,
    paddingTop: 8,
    marginBottom: 8,
  },
  rideDataContainer: {
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 4,
    marginBottom: 13,
  },
  likesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  likeIcon: {
    width: 16,
    height: 16,
  },
  ridesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  likesAndRidesText: {
    fontFamily: 'Inter Medium',
    fontSize: 17,
    lineHeight: 22,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 8,
  },
  carDataContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 21,
  },
  carTitleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 21,
    paddingVertical: 9,
    borderWidth: 1,
    borderRadius: 12,
    maxWidth: '50%',
  },
  carTitleText: {
    fontFamily: 'Inter Medium',
    fontSize: 17,
    lineHeight: 22,
  },
  carIdContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 11,
    paddingVertical: 9,
    borderRadius: 12,
  },
  carIdText: {
    fontFamily: 'Inter Medium',
    fontSize: 17,
    lineHeight: 22,
  },
  tripTypeContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  bottomInfoWrapper: {
    gap: 8,
    marginBottom: 16,
  },
  bottomInfoTitle: {
    fontFamily: 'Inter Medium',
    fontSize: 14,
    lineHeight: 22,
  },
  bottomInfoText: {
    maxWidth: '50%',
    fontFamily: 'Inter Medium',
    fontSize: 14,
    lineHeight: 22,
  },
  earnedTodayContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  swipeButtonContainer: {
    paddingHorizontal: sizes.paddingHorizontal,
  },
});

export default HiddenPart;
