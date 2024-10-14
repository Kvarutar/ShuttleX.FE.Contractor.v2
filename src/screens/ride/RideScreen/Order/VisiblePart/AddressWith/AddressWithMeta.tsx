import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import {
  defaultShadow,
  ExternalMapIcon,
  PointIcon,
  Text,
  Timer,
  TimerColorModes,
  TimerSizesModes,
  TrafficIndicator,
  TrafficLevel,
  useTheme,
} from 'shuttlex-integration';

import { AddressWithMetaProps } from './props';

const AddressWithMeta = ({ tripPoints, timeForTimer }: AddressWithMetaProps) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const computedStyles = StyleSheet.create({
    dropOffText: {
      color: colors.textSecondaryColor,
    },
    openOnGoogleMapButton: {
      borderColor: colors.borderColor,
    },
    openOnText: {
      color: colors.textSecondaryColor,
    },
    googleMapText: {
      color: colors.textPrimaryColor,
    },
    pointOuterColor: {
      color: colors.errorColor,
    },
    pointInnerColor: {
      color: colors.backgroundPrimaryColor,
    },
  });

  //TODO: For test, delete after connect with back
  const [currentDistance, setCurrentDistance] = useState(0);
  const totalDistance = 100;
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDistance(prevDistance => {
        const newDistance = prevDistance + 10;
        return Math.min(newDistance, totalDistance);
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <View>
      <View style={styles.timerWrapper}>
        <Shadow {...defaultShadow(colors.strongShadowColor)} style={styles.shadowStyle}>
          <Timer time={timeForTimer} sizeMode={TimerSizesModes.S} colorMode={TimerColorModes.Mode3} />
        </Shadow>
      </View>
      <View style={styles.metaInfoContainer}>
        <PointIcon
          outerColor={computedStyles.pointOuterColor.color}
          innerColor={computedStyles.pointInnerColor.color}
        />
        <View style={styles.dropOffTextsContainer}>
          <Text style={[styles.dropOffText, computedStyles.dropOffText]}>{t('ride_Ride_Order_dropOff')}</Text>
          <Text style={styles.address}>{tripPoints[0].address}</Text>
        </View>
      </View>
      {/*TODO: delete mock data*/}
      <TrafficIndicator
        containerStyle={styles.trafficIndicatorContainer}
        currentPercent={`${currentDistance}%`}
        segments={[
          { percent: '15%', level: TrafficLevel.Low },
          { percent: '15%', level: TrafficLevel.Average },
          { percent: '30%', level: TrafficLevel.High },
          { percent: '40%', level: TrafficLevel.Low },
        ]}
        startTime={43200}
        endTime={45000}
      />
      <Pressable style={[styles.openOnGoogleMapButton, computedStyles.openOnGoogleMapButton]}>
        <ExternalMapIcon />
        <View style={styles.googleMapTextContainer}>
          <Text style={[styles.openOnText, computedStyles.openOnText]}>{t('ride_Ride_Order_openOnText')}</Text>
          <Text style={[styles.googleMapText, computedStyles.googleMapText]}>{t('ride_Ride_Order_googleMapText')}</Text>
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  //TODO: Check image sizes on smaller and bigger devices
  timerWrapper: {
    position: 'absolute',
    top: -64,
    alignSelf: 'center',
  },
  shadowStyle: {
    borderRadius: 100,
  },
  metaInfoContainer: {
    flexDirection: 'row',
    paddingTop: 48,
    gap: 12,
  },
  dropOffTextsContainer: {
    flex: 1,
    gap: 4,
  },
  dropOffText: {
    fontFamily: 'Inter Medium',
  },
  address: {
    fontFamily: 'Inter Medium',
    fontSize: 21,
    marginBottom: 20,
  },
  openOnGoogleMapButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    marginBottom: 8,
  },
  googleMapTextContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  openOnText: {
    fontFamily: 'Inter Medium',
    fontSize: 14,
  },
  googleMapText: {
    fontFamily: 'Inter Medium',
    fontSize: 14,
  },
  trafficIndicatorContainer: {
    marginBottom: 14,
  },
});

export default AddressWithMeta;
