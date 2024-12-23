import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import {
  ExternalMapIcon,
  openRouteOnGoogleMaps,
  PointIcon,
  sizes,
  Text,
  TrafficIndicator,
  TrafficIndicatorProps,
  TrafficLevel,
  useTheme,
} from 'shuttlex-integration';

import {
  mapRidePercentFromPolylinesSelector,
  mapRouteTrafficSelector,
} from '../../../../../../core/ride/redux/map/selectors';
import { TrafficLoadFromAPI } from '../../../../../../core/ride/redux/trip/types';
import { AddressWithMetaProps } from './props';

const trafficLoadFromAPIToTrafficLevel: Record<TrafficLoadFromAPI, TrafficLevel> = {
  Low: TrafficLevel.Low,
  Average: TrafficLevel.Average,
  High: TrafficLevel.High,
};

const AddressWithMeta = ({ tripPointsAddresses, googleMapButtonPoints, startTime, endTime }: AddressWithMetaProps) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const ridePercentFromPolylines = useSelector(mapRidePercentFromPolylinesSelector);
  const routeTraffic = useSelector(mapRouteTrafficSelector);

  const trafficSegments: TrafficIndicatorProps['segments'] = [];
  if (routeTraffic !== null) {
    const lastRouteIndex = routeTraffic[routeTraffic.length - 1].polylineEndIndex;
    routeTraffic.forEach(elem => {
      trafficSegments.push({
        level: trafficLoadFromAPIToTrafficLevel[elem.trafficLoad],
        percent: `${(1 - (elem.polylineEndIndex - elem.polylineStartIndex) / lastRouteIndex) * 100}%`,
      });
    });
  }

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

  return (
    <View>
      <View style={styles.metaInfoContainer}>
        <PointIcon
          outerColor={computedStyles.pointOuterColor.color}
          innerColor={computedStyles.pointInnerColor.color}
        />
        <View style={styles.dropOffTextsContainer}>
          <Text style={[styles.dropOffText, computedStyles.dropOffText]}>{t('ride_Ride_Order_dropOff')}</Text>
          <Text style={styles.address}>{tripPointsAddresses[0]}</Text>
        </View>
      </View>
      {trafficSegments.length !== 0 && (
        <TrafficIndicator
          containerStyle={styles.trafficIndicatorContainer}
          currentPercent={ridePercentFromPolylines}
          segments={trafficSegments}
          startDate={startTime !== null ? new Date(startTime) : undefined}
          endDate={new Date(endTime)}
        />
      )}
      {googleMapButtonPoints && (
        <Pressable
          style={[styles.openOnGoogleMapButton, computedStyles.openOnGoogleMapButton]}
          onPress={() => openRouteOnGoogleMaps(googleMapButtonPoints.startPoint, googleMapButtonPoints.endPoint)}
        >
          <ExternalMapIcon />
          <View style={styles.googleMapTextContainer}>
            <Text style={[styles.openOnText, computedStyles.openOnText]}>{t('ride_Ride_Order_openOnText')}</Text>
            <Text style={[styles.googleMapText, computedStyles.googleMapText]}>
              {t('ride_Ride_Order_googleMapText')}
            </Text>
          </View>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  metaInfoContainer: {
    flexDirection: 'row',
    paddingTop: 16,
    paddingBottom: sizes.paddingVertical,
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
