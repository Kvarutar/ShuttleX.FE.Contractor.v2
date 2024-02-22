import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import {
  Button,
  ButtonModes,
  ClockIcon,
  DropOffIcon,
  ExternalMapIcon,
  LocationIcon,
  Text,
  useTheme,
} from 'shuttlex-integration';

const buttonFadeAnimationDuration = 200;

const AddressWithMeta = ({ tripPoints }: { tripPoints: string[] }) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const computedStyles = StyleSheet.create({
    orderMetaText: {
      color: colors.textSecondaryColor,
    },
  });

  return (
    <View style={styles.passangerInfoWrapper}>
      <View style={styles.visibleTextWrapper}>
        <View style={styles.visibleHeader}>
          <DropOffIcon />
          <Text numberOfLines={1} style={styles.address}>
            {tripPoints[0]}
          </Text>
        </View>
        <View style={styles.visibleContent}>
          <View style={styles.visibleContentItem}>
            <ClockIcon />
            <Text style={computedStyles.orderMetaText}>{t('ride_Ride_Order_minutes', { count: 25 })}</Text>
          </View>
          <View style={styles.visibleContentItem}>
            <LocationIcon />
            <Text style={computedStyles.orderMetaText}>{t('ride_Ride_Order_kilometers', { count: 20.4 })}</Text>
          </View>
        </View>
      </View>
      <Animated.View
        entering={FadeIn.duration(buttonFadeAnimationDuration)}
        exiting={FadeOut.duration(buttonFadeAnimationDuration)}
      >
        <Button mode={ButtonModes.Mode3} buttonStyle={styles.visibleButton}>
          <ExternalMapIcon />
        </Button>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  passangerInfoWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  visibleTextWrapper: {
    flexShrink: 1,
  },
  visibleHeader: {
    flexDirection: 'row',
  },
  address: {
    fontFamily: 'Inter Medium',
    flexShrink: 1,
  },
  visibleContent: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
  },
  visibleContentItem: {
    flexDirection: 'row',
    gap: 4,
  },
  visibleButton: {
    height: 52,
    width: 52,
  },
});

export default AddressWithMeta;
