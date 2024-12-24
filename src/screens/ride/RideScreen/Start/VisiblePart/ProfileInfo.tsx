import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import {
  formatCurrency,
  sizes,
  Skeleton,
  StatsBlock,
  SwipeButton,
  SwipeButtonModes,
  Text,
  TextElipsizeMode,
  useTheme,
} from 'shuttlex-integration';

import {
  contractorInfoErrorSelector,
  contractorInfoSelector,
  contractorStatusSelector,
  contractorZoneSelector,
  isContractorInfoLoadingSelector,
  isTariffsInfoLoadingSelector,
  primaryTariffSelector,
  selectedTariffsSelector,
  tariffsInfoErrorSelector,
} from '../../../../../core/contractor/redux/selectors';
import { updateContractorStatus } from '../../../../../core/contractor/redux/thunks';
import { ContractorStatus } from '../../../../../core/contractor/redux/types';
import { useAppDispatch } from '../../../../../core/redux/hooks';
import { ProfileInfoProps } from './types';

const animationDuration = 200;

//TODO: Add "setIsAchievementsPopupVisible" prop when we need achievements
// Details in Task-266
const ProfileInfo = ({ bottomWindowRef, lineState, setIsAccountIsNotActivePopupVisible }: ProfileInfoProps) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const iosPaddingVertical = insets.bottom === 0 ? sizes.paddingVertical : insets.bottom;

  const contractorInfo = useSelector(contractorInfoSelector);
  const contractorStatus = useSelector(contractorStatusSelector);
  const selectedTariffs = useSelector(selectedTariffsSelector);
  const primaryTariff = useSelector(primaryTariffSelector);
  const contractorZone = useSelector(contractorZoneSelector);

  const isContractorInfoLoading = useSelector(isContractorInfoLoadingSelector);
  const isTariffsInfoLoading = useSelector(isTariffsInfoLoadingSelector);
  const contractorInfoError = useSelector(contractorInfoErrorSelector);
  const tariffsInfoError = useSelector(tariffsInfoErrorSelector);

  const contractorStatusIsOffline = contractorStatus === 'offline';

  const computedStyles = StyleSheet.create({
    container: {
      paddingBottom: iosPaddingVertical,
    },
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

    //TODO: add logic to show this popup
    if (contractorStatusIsOffline) {
      setIsAccountIsNotActivePopupVisible(true);
    }
    bottomWindowRef.current?.closeWindow();
  };

  if (isContractorInfoLoading || isTariffsInfoLoading || contractorInfoError || tariffsInfoError) {
    return (
      <Animated.View
        entering={FadeIn.duration(animationDuration)}
        exiting={FadeOut.duration(animationDuration)}
        style={[styles.container, computedStyles.container]}
      >
        <View>
          <Skeleton skeletonContainerStyle={styles.skeletonNameContainer} />
          <Skeleton skeletonContainerStyle={styles.skeletonRidesAndLikes} />
          <View style={styles.skeletonCarDataContainer}>
            <Skeleton skeletonsAmount={2} skeletonContainerStyle={styles.skeletonCarDataItem} />
          </View>
          <View style={[styles.bottomInfoWrapper, computedStyles.bottomInfoWrapper]}>
            <Skeleton skeletonsAmount={2} skeletonContainerStyle={styles.skeletonBottomBlockContainer} />
          </View>
        </View>
        <View style={styles.swipeButtonContainer}>
          {contractorStatusIsOffline ? (
            <SwipeButton
              mode={SwipeButtonModes.Disabled}
              onSwipeEnd={() => swipeHandler(lineState.toLineState)}
              text={t('ride_Ride_Start_startRideButton')}
            />
          ) : (
            <SwipeButton
              mode={SwipeButtonModes.Disabled}
              onSwipeEnd={() => swipeHandler(lineState.toLineState)}
              text={t('ride_Ride_Start_finishRideButton')}
            />
          )}
        </View>
      </Animated.View>
    );
  }

  if (!contractorInfo.vehicle) {
    return;
  }

  return (
    <Animated.View
      entering={FadeIn.duration(animationDuration)}
      exiting={FadeOut.duration(animationDuration)}
      style={[styles.container, computedStyles.container]}
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
        <Text style={styles.namesText}>{contractorInfo.name}</Text>
        <StatsBlock
          style={styles.rideDataContainer}
          amountLikes={contractorInfo.totalLikesCount}
          amountRides={contractorInfo.totalRidesCount}
        />
        <View style={styles.carDataContainer}>
          <View style={[styles.carTitleContainer, computedStyles.carTitleContainer]}>
            <Text numberOfLines={1} style={styles.carTitleText}>
              {contractorInfo.vehicle.brand} {contractorInfo.vehicle.model}
            </Text>
          </View>
          <View style={[styles.carIdContainer, computedStyles.carIdContainer]}>
            <Text style={styles.carIdText}>{contractorInfo.vehicle.number}</Text>
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
            {primaryTariff && (
              <Text style={[styles.bottomInfoText, computedStyles.bottomInfoText]}>
                {formatCurrency(primaryTariff.currencyCode, contractorInfo.earnedToday)}
              </Text>
            )}
          </View>
        </View>
      </View>
      {/* //TODO: Add a component which render "remains to work" time  */}
      <View style={styles.swipeButtonContainer}>
        {contractorStatusIsOffline ? (
          <SwipeButton
            mode={contractorZone ? SwipeButtonModes.Confirm : SwipeButtonModes.Disabled}
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
  skeletonNameContainer: {
    alignSelf: 'center',
    width: '50%',
    height: 21,
    marginTop: 12,
  },
  skeletonRidesAndLikes: {
    alignSelf: 'center',
    marginTop: 12,
    width: '70%',
    height: 21,
    marginBottom: 13,
  },
  skeletonCarDataContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 21,
    paddingHorizontal: 16,
    height: 36,
  },
  skeletonCarDataItem: {
    flex: 1,
    borderRadius: 12,
  },
  skeletonBottomBlockContainer: {
    height: 54,
    borderRadius: 12,
  },
  container: {
    //TODO: think of clever way(problem is: i can't calculate visible part height in opened state before it's opened. This problem occure because of we don't use hidden part in this component and in opened state height of visible part lesser then 93% of widow height)
    height: '100%',
    justifyContent: 'space-between',
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
    paddingHorizontal: 16,
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
