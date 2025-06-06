import { useTranslation } from 'react-i18next';
import { Linking, Pressable, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { EmergencyServiceIcon, ReportIcon, SwipeButton, SwipeButtonModes, Text, useTheme } from 'shuttlex-integration';

import { tariffsSelector } from '../../../../core/contractor/redux/selectors';
import { useAppDispatch } from '../../../../core/redux/hooks';
import { endTrip } from '../../../../core/ride/redux/trip';
import { orderSelector } from '../../../../core/ride/redux/trip/selectors';
import { fetchCancelTrip } from '../../../../core/ride/redux/trip/thunks';

const HiddenPart = () => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const order = useSelector(orderSelector);
  const tariffs = useSelector(tariffsSelector);
  const tripTariff = tariffs.find(tariff => tariff.id === order?.tariffId)?.name;

  const onCancelTrip = async () => {
    if (order) {
      await dispatch(fetchCancelTrip({ orderId: order.id }));
      dispatch(endTrip());
    }
  };

  const computedStyles = StyleSheet.create({
    hiddenTripInfo: {
      backgroundColor: colors.backgroundSecondaryColor,
    },
    hiddenTripInfoTitle: {
      color: colors.textSecondaryColor,
    },
    hiddenTripInfoContent: {
      color: colors.textPrimaryColor,
    },
    hiddenSafetyItem: {
      borderColor: colors.borderColor,
    },
    hiddenSafetyItemText: {
      color: colors.textSecondaryColor,
    },
  });

  if (order) {
    return (
      <View style={styles.hiddenContainer}>
        <View style={[styles.hiddenTripInfo, computedStyles.hiddenTripInfo]}>
          <Text style={[styles.hiddenTripInfoTitle, computedStyles.hiddenTripInfoTitle]}>
            {t('ride_Ride_Order_passenger')}
          </Text>
          <Text numberOfLines={1} style={[styles.hiddenTripInfoContent, computedStyles.hiddenTripInfoContent]}>
            {order.passenger.name}
          </Text>
        </View>
        <View style={[styles.hiddenTripInfo, computedStyles.hiddenTripInfo]}>
          <Text style={[styles.hiddenTripInfoTitle, computedStyles.hiddenTripInfoTitle]}>
            {t('ride_Ride_Order_tripType')}
          </Text>
          <Text style={[styles.hiddenTripInfoContent, computedStyles.hiddenTripInfoContent]}>{tripTariff}</Text>
        </View>
        <View style={styles.hiddenSafety}>
          <Pressable
            style={[styles.hiddenSafetyItem, computedStyles.hiddenSafetyItem]}
            onPress={() => Linking.openURL('tel:112')}
          >
            <EmergencyServiceIcon />
            <Text style={[styles.hiddenSafetyItemText, computedStyles.hiddenSafetyItemText]}>
              {t('ride_Ride_Order_contactEmergency')}
            </Text>
          </Pressable>
          <Pressable style={[styles.hiddenSafetyItem, computedStyles.hiddenSafetyItem]}>
            <ReportIcon />
            <Text style={[styles.hiddenSafetyItemText, computedStyles.hiddenSafetyItemText]}>
              {t('ride_Ride_Order_reportIssue')}
            </Text>
          </Pressable>
        </View>
        <SwipeButton
          mode={SwipeButtonModes.Decline}
          onSwipeEnd={onCancelTrip}
          text={t('ride_Ride_Order_cancelRideButton')}
        />
      </View>
    );
  }

  return <></>;
};

const styles = StyleSheet.create({
  hiddenContainer: {
    gap: 8,
  },
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
    lineHeight: 22,
  },
  hiddenTripInfoContent: {
    flexShrink: 1,
    fontFamily: 'Inter Medium',
    fontSize: 14,
    lineHeight: 22,
  },
  hiddenSafety: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 32,
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
    fontSize: 14,
    lineHeight: 22,
  },
});

export default HiddenPart;
