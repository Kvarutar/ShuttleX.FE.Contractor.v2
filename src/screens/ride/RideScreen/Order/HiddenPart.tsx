import { useTranslation } from 'react-i18next';
import { Linking, Pressable, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { EmergencyServiceIcon, ReportIcon, Text, useTheme } from 'shuttlex-integration';

import { orderSelector } from '../../../../core/ride/redux/trip/selectors';

const HiddenPart = () => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const order = useSelector(orderSelector);

  const computedStyles = StyleSheet.create({
    hiddenTripInfo: {
      backgroundColor: colors.backgroundSecondaryColor,
    },
    hiddenTripInfoTitle: {
      color: colors.textSecondaryColor,
    },
    hiddenSafetyItem: {
      borderColor: colors.borderColor,
    },
  });

  if (order) {
    return (
      <>
        <View style={[styles.hiddenTripInfo, computedStyles.hiddenTripInfo]}>
          <Text style={[styles.hiddenTripInfoTitle, computedStyles.hiddenTripInfoTitle]}>
            {t('ride_Ride_Order_passenger')}
          </Text>
          <Text numberOfLines={1} style={styles.hiddenTripInfoContent}>
            {order.passenger.name + ' ' + order.passenger.lastName}
          </Text>
        </View>
        <View style={[styles.hiddenTripInfo, computedStyles.hiddenTripInfo]}>
          <Text style={[styles.hiddenTripInfoTitle, computedStyles.hiddenTripInfoTitle]}>
            {t('ride_Ride_Order_tripType')}
          </Text>
          <Text style={styles.hiddenTripInfoContent}>{order.tripTariff}</Text>
        </View>
        <View style={styles.hiddenSafety}>
          <Pressable
            style={[styles.hiddenSafetyItem, computedStyles.hiddenSafetyItem]}
            onPress={() => Linking.openURL('tel:112')}
          >
            <EmergencyServiceIcon />
            <Text style={styles.hiddenSafetyItemText}>{t('ride_Ride_Order_contactEmergency')}</Text>
          </Pressable>
          <Pressable style={[styles.hiddenSafetyItem, computedStyles.hiddenSafetyItem]}>
            <ReportIcon />
            <Text style={styles.hiddenSafetyItemText}>{t('ride_Ride_Order_reportIssue')}</Text>
          </Pressable>
        </View>
      </>
    );
  }

  return <></>;
};

const styles = StyleSheet.create({
  hiddenTripInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
  },
  hiddenTripInfoTitle: {
    fontFamily: 'Inter Medium',
    fontSize: 14,
  },
  hiddenTripInfoContent: {
    flexShrink: 1,
    fontFamily: 'Inter Medium',
    fontSize: 14,
  },
  hiddenSafety: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 8,
  },
  hiddenSafetyItem: {
    flex: 1,
    gap: 14,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  hiddenSafetyItemText: {
    fontFamily: 'Inter Medium',
    fontSize: 12,
  },
});

export default HiddenPart;
