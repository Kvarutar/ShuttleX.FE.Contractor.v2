import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useSelector } from 'react-redux';
import {
  sizes,
  StatsBlock,
  SwipeButton,
  SwipeButtonModes,
  Text,
  TextElipsizeMode,
  useTheme,
} from 'shuttlex-integration';

import {
  carDataSelector,
  contractorStatusSelector,
  profileSelector,
  selectedTariffsSelector,
} from '../../../../../core/contractor/redux/selectors';
import { updateContractorStatus } from '../../../../../core/contractor/redux/thunks';
import { ContractorStatus } from '../../../../../core/contractor/redux/types';
import { useAppDispatch } from '../../../../../core/redux/hooks';
import { statisticsContractorSelector } from '../../../../../core/statistics/redux/selectors';
import { ProfileInfoProps } from './types';

const animationDuration = 200;

//TODO: Add "setIsAchievementsPopupVisible" prop when we need achievements
// Details in Task-266
const ProfileInfo = ({ bottomWindowRef, lineState }: ProfileInfoProps) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const profile = useSelector(profileSelector);
  const contractorStatistics = useSelector(statisticsContractorSelector);
  const carData = useSelector(carDataSelector);
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
    steeringWheelIcon: {
      color: colors.textQuadraticColor,
    },
  });

  const swipeHandler = async (mode: ContractorStatus) => {
    await dispatch(updateContractorStatus(mode));
    bottomWindowRef.current?.closeWindow();
  };

  if (!profile || !contractorStatistics || !carData) {
    return;
  }

  return (
    <Animated.View
      entering={FadeIn.duration(animationDuration)}
      exiting={FadeOut.duration(animationDuration)}
      style={styles.container}
    >
      <View>
        {/* TODO: Add this block when we need a rider level */}
        {/* Removed from render part in Task-266 */}
        {/* Details in Task-266 */}
        {/* <View style={styles.levelContainer}>
        <CrownIcon />
        <View style={styles.levelTextsContainer}>
          <Text style={[styles.levelCounter, computedStyles.levelCounter]}>{contractorStatistics.level}</Text>
          <Text style={[styles.levelText, computedStyles.levelText]}>lvl.</Text>
        </View>
      </View> */}
        <Text style={styles.namesText}>{profile.fullName}</Text>
        <StatsBlock
          style={styles.rideDataContainer}
          amountLikes={contractorStatistics.likes}
          amountRides={contractorStatistics.rides}
        />
        <View style={styles.carDataContainer}>
          <View style={[styles.carTitleContainer, computedStyles.carTitleContainer]}>
            <Text numberOfLines={1} style={styles.carTitleText}>
              {carData.title}
            </Text>
          </View>
          <View style={[styles.carIdContainer, computedStyles.carIdContainer]}>
            <Text style={styles.carIdText}>{carData.id}</Text>
          </View>
        </View>
        {/* TODO: Add this block when we need achievements */}
        {/* Removed from render part in Task-266 */}
        {/* Details in Task-266 */}
        {/* <AchievementsCarousel setIsAchievementsPopupVisible={setIsAchievementsPopupVisible} /> */}
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
      </View>
      {/* //TODO: Add a component which render "remains to work" time  */}
      <View style={styles.swipeButtonContainer}>
        {contractorStatusIsOffline ? (
          <SwipeButton
            mode={SwipeButtonModes.Confirm}
            onSwipeEnd={() => swipeHandler(lineState.toLineState)}
            text={t('ride_Ride_Start_startRideButton')}
          />
        ) : (
          <SwipeButton
            mode={SwipeButtonModes.Decline}
            onSwipeEnd={() => swipeHandler(lineState.toLineState)}
            text={t('ride_Ride_Start_finishRideButton')}
          />
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    //TODO: think of clever way(problem is: i can't calculate visible part height in opened state before it's opened. This problem occure because of we don't use hidden part in this component and in opened state height of visible part lesser then 93% of widow height)
    height: '100%',
    justifyContent: 'space-between',
    paddingBottom: sizes.paddingVertical,
  },
  // Don't remove unused styles. There're some styles for unused component for now
  levelContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: -20,
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
    paddingTop: 12,
  },
  rideDataContainer: {
    justifyContent: 'center',
    paddingTop: 2,
    marginBottom: 13,
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

export default ProfileInfo;
