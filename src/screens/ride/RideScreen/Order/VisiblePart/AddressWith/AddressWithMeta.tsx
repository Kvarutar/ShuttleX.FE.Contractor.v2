import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';
import {
  ExternalMapIcon,
  PointIcon,
  Text,
  Timer,
  TimerColorModes,
  TimerSizesModes,
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

  return (
    <View style={styles.visibleTextWrapper}>
      <Timer
        style={{
          timerWrapper: styles.timerWrapper,
        }}
        time={timeForTimer}
        sizeMode={TimerSizesModes.S}
        colorMode={TimerColorModes.Mode3}
      />
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
      <Pressable style={[styles.openOnGoogleMapButton, computedStyles.openOnGoogleMapButton]}>
        <ExternalMapIcon />
        <View style={styles.googleMapTextContainer}>
          <Text style={computedStyles.openOnText}>{t('ride_Ride_Order_openOnText')}</Text>
          <Text style={computedStyles.googleMapText}>{t('ride_Ride_Order_googleMapText')}</Text>
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  timerWrapper: {
    position: 'absolute',
    top: -78,
    alignSelf: 'center',
  },
  metaInfoContainer: {
    flexDirection: 'row',
    paddingTop: 24,
    gap: 18,
  },
  dropOffTextsContainer: {
    flex: 1,
    gap: 8,
  },
  dropOffText: {
    fontFamily: 'Inter Medium',
  },
  visibleTextWrapper: {
    flexShrink: 1,
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
});

export default AddressWithMeta;
