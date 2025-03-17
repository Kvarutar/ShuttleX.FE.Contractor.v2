import { StyleSheet, View } from 'react-native';
import { getLocales } from 'react-native-localize';
import { Separator, Text, useTheme } from 'shuttlex-integration';

import { WithdrawalHistory } from './types';

const formatDate = (date: Date): string =>
  new Intl.DateTimeFormat(getLocales()[0].languageTag, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);

const WithdrawalHistoryItem = ({
  withdrawalHistoryItem,
  itemCurrency,
}: {
  withdrawalHistoryItem: WithdrawalHistory;
  itemCurrency: string;
}) => {
  const { colors } = useTheme();

  const computedStyles = StyleSheet.create({
    historyDate: {
      color: colors.textSecondaryColor,
    },
  });

  return (
    <View>
      <View style={styles.historyItemContainer}>
        <Text style={styles.historyQuantity}>
          -{itemCurrency}
          {withdrawalHistoryItem.quantity}
        </Text>
        <Text style={[styles.historyDate, computedStyles.historyDate]}>
          {formatDate(new Date(withdrawalHistoryItem.date))}
        </Text>
      </View>
      <Separator />
    </View>
  );
};

const styles = StyleSheet.create({
  historyItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  historyQuantity: {
    fontFamily: 'Inter Medium',
  },
  historyDate: {
    fontFamily: 'Inter Medium',
    fontSize: 12,
  },
});

export default WithdrawalHistoryItem;
