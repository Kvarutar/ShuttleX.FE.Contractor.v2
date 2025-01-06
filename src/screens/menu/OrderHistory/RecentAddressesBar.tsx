import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { getLocales } from 'react-native-localize';
import {
  Bar,
  BarModes,
  formatCurrency,
  Separator,
  TariffType,
  Text,
  useTariffsIcons,
  useTheme,
} from 'shuttlex-integration';

import { tariffsNamesByFeKey } from '../../../core/contractor/redux/utils/getTariffNamesByFeKey';
import { RecentAddressBarProps } from './types';

const formatDateTime = (date: Date): string => {
  const formattedDate = date.toLocaleDateString(getLocales()[0].languageTag, {
    day: '2-digit',
    month: 'short',
  });
  const formattedTime = date.toLocaleTimeString(getLocales()[0].languageTag, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const [month, day] = formattedDate.split(' ');

  return `${day} ${month}, ${formattedTime}`;
};

const OrderHistoryBar = ({ order }: RecentAddressBarProps) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const tariffIconsData = useTariffsIcons();

  const isOrderCanceled = order.state === 'CanceledByContractor' || order.state === 'CanceledByPassenger';

  const computedStyles = StyleSheet.create({
    statusText: {
      color: isOrderCanceled ? colors.errorColor : colors.textPrimaryColor,
    },
    statusContainer: {
      backgroundColor: isOrderCanceled ? colors.errorColorWithOpacity : colors.primaryColor,
    },
    dateTimeText: {
      color: colors.textTitleColor,
    },
    orderPlace: {
      color: colors.textPrimaryColor,
    },
    orderAddress: {
      color: colors.textSecondaryColor,
    },
    durationTime: {
      color: colors.textQuadraticColor,
    },
  });

  const getTariffImage = (tariffType: TariffType) => {
    return tariffIconsData[tariffType].icon({ style: styles.image });
  };

  const durationTime = {
    hours: Math.floor(order.durationMin / 60),
    minutes: Math.floor(order.durationMin % 60),
  };

  return (
    <Bar style={styles.container} mode={isOrderCanceled ? BarModes.Disabled : BarModes.Default}>
      <View style={styles.addressContainer}>
        <Text style={[styles.orderPlace, computedStyles.orderPlace]}>{order.pickUpPlace}</Text>
        <Text style={[styles.orderAddress, computedStyles.orderAddress]}>{order.pickUpAddress}</Text>

        <View style={[styles.durationTimeContainer]}>
          <Separator style={styles.separatorHorizontal} />

          <View style={styles.convertedDurationTimeContainer}>
            {durationTime.hours !== 0 && durationTime.hours > 0 && (
              <Text style={[styles.durationTime, computedStyles.durationTime]}>
                {t('menu_OrderHistory_durationTimeHours', { hours: durationTime.hours })}
              </Text>
            )}
            <Text style={[styles.durationTime, computedStyles.durationTime]}>
              {t('menu_OrderHistory_durationTimeMinutes', {
                minutes: durationTime.minutes !== 0 && durationTime.minutes > 0 ? durationTime.minutes : 0,
              })}
            </Text>
          </View>

          <Separator style={styles.separatorHorizontal} />
        </View>

        <Text style={[styles.orderPlace, computedStyles.orderPlace]}>{order.dropOffPlace}</Text>
        <Text style={[styles.orderAddress, computedStyles.orderAddress]}>{order.dropOffAddress}</Text>
      </View>

      <View style={styles.additionalInfoContainer}>
        {order.tariffInfo && getTariffImage(tariffsNamesByFeKey[order.tariffInfo.feKey])}

        <View style={[styles.statusContainer, computedStyles.statusContainer]}>
          <Text style={[styles.statusText, computedStyles.statusText]}>
            {isOrderCanceled ? t('menu_OrderHistory_canceled') : formatCurrency(order.currency, order.price)}
          </Text>
        </View>

        <Text style={[styles.dateTimeText, computedStyles.dateTimeText]}>
          {formatDateTime(new Date(order.createdDate))}
        </Text>
      </View>
    </Bar>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flexDirection: 'row',
  },
  additionalInfoContainer: {
    width: '30%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  image: {
    width: '100%',
    height: undefined,
    aspectRatio: 3.15,
  },
  dateTimeText: {
    fontSize: 12,
    fontFamily: 'Inter Medium',
    lineHeight: 22,
  },
  statusContainer: {
    paddingHorizontal: 10,
    paddingVertical: 1,
    borderRadius: 14,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter Medium',
    lineHeight: 22,
  },
  durationTimeContainer: {
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    gap: 8,
  },
  convertedDurationTimeContainer: {
    flexDirection: 'row',
  },
  durationTime: {
    fontFamily: 'Inter Medium',
    fontSize: 14,
    lineHeight: 16,
  },
  separatorHorizontal: {
    height: 1,
  },
  addressContainer: {
    flex: 1,
  },
  orderAddress: {
    fontFamily: 'Inter Medium',
  },
  orderPlace: {
    fontFamily: 'Inter Medium',
    fontSize: 17,
    lineHeight: 22,
  },
});

export default OrderHistoryBar;
