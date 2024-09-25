import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useSelector } from 'react-redux';
import {
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
  selectedPreferencesSelector,
  selectedTariffsSelector,
} from '../../../../core/contractor/redux/selectors';
import { updateContractorStatus } from '../../../../core/contractor/redux/thunks';
import { ContractorStatus } from '../../../../core/contractor/redux/types';
import { useAppDispatch } from '../../../../core/redux/hooks';
import AchievementsCarousel from './AchievementsCarousel';
import { HiddenPartProps, RiderData } from './props';

const animationDuration = 200;

const HiddenPart = ({ isOpened, bottomWindowRef, lineState, setIsAchievementsPopupVisible }: HiddenPartProps) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const profile = useSelector(profileSelector);
  const contractorStatus = useSelector(contractorStatusSelector);
  const selectedTariffs = useSelector(selectedTariffsSelector);
  const selectedPreferences = useSelector(selectedPreferencesSelector);

  const contractorStatusIsOffline = contractorStatus === 'offline';

  //TODO: Remove it after will be added a logic receiving data from back-end
  const [riderData] = useState<RiderData>({
    likes: 10000,
    rides: 45,
    car: {
      number: 'BGH 284',
      title: 'Toyota Land Cruser',
      color: 'black',
    },
  });

  const computedStyles = StyleSheet.create({
    dot: {
      backgroundColor: colors.iconSecondaryColor,
    },
    carTitleContainer: {
      borderColor: colors.borderColor,
    },
    carIdContainer: {
      backgroundColor: colors.primaryColor,
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
    likesAndRidesText: {
      color: colors.textSecondaryColor,
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

  if (!isOpened) {
    return;
  }

  return (
    <Animated.View entering={FadeIn.duration(animationDuration)} exiting={FadeOut.duration(animationDuration)}>
      {profile && <Text style={styles.namesText}>{profile.name + ' ' + profile.surname}</Text>}
      <View style={styles.rideDataContainer}>
        <View style={styles.likesContainer}>
          <Like2Icon style={styles.likeIcon} />
          <Text style={[styles.likesAndRidesText, computedStyles.likesAndRidesText]}>
            {formatBigNumbers(riderData.likes) + ' ' + t('ride_Ride_Order_likes')}
          </Text>
        </View>
        <View style={styles.ridesContainer}>
          <View style={[styles.dot, computedStyles.dot]} />
          <SteeringWheelIcon />
          <Text style={[styles.likesAndRidesText, computedStyles.likesAndRidesText]}>
            {formatBigNumbers(riderData.rides) + ' ' + t('ride_Ride_Order_rides')}
          </Text>
        </View>
      </View>
      <View style={styles.carDataContainer}>
        <View style={[styles.carTitleContainer, computedStyles.carTitleContainer]}>
          <Text numberOfLines={1} style={styles.carTitleText}>
            {riderData.car.title}
          </Text>
        </View>
        <View style={[styles.carIdContainer, computedStyles.carIdContainer]}>
          <Text style={styles.carIdText}>{riderData.car.number}</Text>
        </View>
      </View>
      <AchievementsCarousel setIsAchievementsPopupVisible={setIsAchievementsPopupVisible} />
      <View style={styles.bottomInfoWrapper}>
        <View style={[styles.tripTypeContainer, computedStyles.bottomInfo]}>
          <Text numberOfLines={1} style={[styles.bottomInfoTitle, computedStyles.bottomInfoTitle]}>
            {t('ride_Ride_Order_tripType')}
          </Text>
          <Text elipsizeMode={TextElipsizeMode.Tail} numberOfLines={1} style={styles.bottomInfoText}>
            {selectedTariffs.map(selectedTariff => selectedTariff.name).join(',')}
          </Text>
        </View>
        <View style={[styles.includedAdditionContainer, computedStyles.bottomInfo]}>
          <Text style={[styles.bottomInfoTitle, computedStyles.bottomInfoTitle]}>
            {t('ride_Ride_Order_includedAdditions')}
          </Text>
          <Text style={[styles.bottomInfoText, computedStyles.bottomInfoText]}>{selectedPreferences.length}</Text>
        </View>
        <View />
        {contractorStatus === 'online' && (
          <View style={[styles.earnedTodayContainer, computedStyles.bottomInfo]}>
            <Text style={[styles.bottomInfoTitle, computedStyles.bottomInfoTitle]}>
              {t('ride_Ride_Order_earnedToday')}
            </Text>
            {/* TODO: Add "Earned today" state when it will be added */}
            <Text style={[styles.bottomInfoText, computedStyles.bottomInfoText]}>{'$0.0'}</Text>
          </View>
        )}
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
  namesText: {
    fontFamily: 'Inter Medium',
    textAlign: 'center',
    fontSize: 21,
  },
  rideDataContainer: {
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 32,
    marginBottom: 24,
  },
  likesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 8,
  },
  carDataContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
  },
  carTitleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 12,
    maxWidth: '50%',
  },
  carTitleText: {
    fontFamily: 'Inter Medium',
    fontSize: 17,
  },
  carIdContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  carIdText: {
    fontFamily: 'Inter Medium',
    fontSize: 17,
  },
  tripTypeContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  bottomInfoWrapper: {
    gap: 8,
    marginBottom: 32,
    paddingHorizontal: sizes.paddingHorizontal,
  },
  bottomInfoTitle: {
    fontFamily: 'Inter Medium',
    fontSize: 14,
  },
  bottomInfoText: {
    fontFamily: 'Inter Medium',
    maxWidth: '50%',
    fontSize: 14,
  },
  includedAdditionContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
  },
  earnedTodayContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
  },
  swipeButtonContainer: {
    paddingHorizontal: sizes.paddingHorizontal,
  },
});

export default HiddenPart;
