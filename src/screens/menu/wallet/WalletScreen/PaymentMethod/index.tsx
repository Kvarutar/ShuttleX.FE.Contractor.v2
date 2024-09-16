import { Pressable, StyleSheet, View } from 'react-native';
import { getPaymentIcon, RoundCheckIcon2, Separator, Text } from 'shuttlex-integration';

import { PaymentMethodProps } from './props';

const PaymentMethodContent = ({
  paymentMethod,
  selectedPaymentMethod,
  index,
  onSelectMethod,
  paymentMethods,
}: PaymentMethodProps) => {
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
        {isSelected && <RoundCheckIcon2 />}
      </View>
      {index !== paymentMethods.length - 1 && <Separator />}
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
});

export default PaymentMethodContent;
