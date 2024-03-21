import React from 'react';
import { StyleSheet, View } from 'react-native';
import { getLocales } from 'react-native-localize';
import { Text, useTheme } from 'shuttlex-integration';

import { WithdrawalHistory } from './props';

const formatDate = (date: Date): string =>
  new Intl.DateTimeFormat(getLocales()[0].languageTag, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);

const WithdrawalHistoryItem = ({ withdrawalHistoryItem }: { withdrawalHistoryItem: WithdrawalHistory }) => {
  const { colors } = useTheme();

  const computedStyles = StyleSheet.create({
    separator: {
      borderColor: colors.strokeColor,
    },
    historyDate: {
      color: colors.textSecondaryColor,
    },
  });

  return (
    <View>
      <View style={styles.historyItemContainer}>
        <Text style={styles.historyQuantity}>-${withdrawalHistoryItem.quantity}</Text>
        <Text style={[styles.historyDate, computedStyles.historyDate]}>
          {formatDate(new Date(withdrawalHistoryItem.date))}
        </Text>
      </View>
      <View style={styles.horizontalSeparatorWrapper}>
        <View style={[styles.horizontalSeparator, computedStyles.separator]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  historyItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 22,
  },
  historyQuantity: {
    fontFamily: 'Inter Medium',
  },
  historyDate: {
    fontFamily: 'Inter Medium',
    fontSize: 12,
  },
  horizontalSeparatorWrapper: {
    overflow: 'hidden',
  },
  horizontalSeparator: {
    flex: 1,
    borderStyle: 'dashed',
    borderWidth: 1,
    marginTop: -0.5,
  },
});

export default WithdrawalHistoryItem;
