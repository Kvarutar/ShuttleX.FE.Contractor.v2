import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { BlueCheck1, getPaymentIcon, Text, useTheme } from 'shuttlex-integration';

import { PaymentMethodProps } from './props';

const PaymentMethodContent = ({
  paymentMethod,
  selectedPaymentMethod,
  index,
  onSelectMethod,
  paymentMethods,
}: PaymentMethodProps) => {
  const { colors } = useTheme();

  const computedStyles = StyleSheet.create({
    separator: {
      borderColor: colors.strokeColor,
    },
  });

  const isSelected =
    selectedPaymentMethod &&
    paymentMethod.details === selectedPaymentMethod.details &&
    paymentMethod.method === selectedPaymentMethod.method;

  return (
    <Pressable key={index} onPress={!isSelected ? onSelectMethod : () => {}}>
      <View style={styles.methodWrapper}>
        <View style={styles.methodContainer}>
          {getPaymentIcon(paymentMethod.method)}
          <Text style={styles.details}>**** {paymentMethod.details}</Text>
        </View>
        {isSelected && <BlueCheck1 />}
      </View>
      {index !== paymentMethods.length - 1 && (
        <View style={styles.horizontalSeparatorWrapper}>
          <View style={[styles.horizontalSeparator, computedStyles.separator]} />
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  methodWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  methodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  details: {
    fontFamily: 'Inter Medium',
    fontSize: 18,
  },
  horizontalSeparatorWrapper: {
    overflow: 'hidden',
  },
  horizontalSeparator: {
    flex: 1,
    borderStyle: 'dashed',
    borderWidth: 1,
    marginTop: -1,
  },
});

export default PaymentMethodContent;
