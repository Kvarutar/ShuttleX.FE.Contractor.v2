import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import {
  Bar,
  getPaymentIcon,
  RoundCheckIcon3,
  sizes,
  SliderWithCustomGesture,
  SwipeButtonModes,
  Text,
  useTheme,
} from 'shuttlex-integration';

import { selectedPaymentMethodSelector } from '../../../../../../core/menu/redux/wallet/selectors';
import { removePaymentMethod } from '../../../../../../core/menu/redux/wallet/thunks';
import { useAppDispatch } from '../../../../../../core/redux/hooks';
import { PaymentMethodProps } from './props';

const PaymentMethodContent = ({ paymentMethod, onSelectMethod }: PaymentMethodProps) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const dispatch = useAppDispatch();

  const selectedPaymentMethod = useSelector(selectedPaymentMethodSelector);

  const isSelected =
    selectedPaymentMethod &&
    paymentMethod.details === selectedPaymentMethod.details &&
    paymentMethod.method === selectedPaymentMethod.method;

  const computedStyles = StyleSheet.create({
    methodWrapper: {
      borderStyle: isSelected ? 'solid' : 'dashed',
      borderColor: colors.borderColor,
      backgroundColor: colors.backgroundPrimaryColor,
    },
    detailsStars: {
      color: colors.textQuadraticColor,
    },
  });

  const onSwipeEnd = () => {
    dispatch(removePaymentMethod({ methodForRemoving: paymentMethod, contractorId: '' }));
  };

  return (
    <SliderWithCustomGesture
      key={paymentMethod.method + paymentMethod.details}
      rightToLeftSwipe
      onSwipeEnd={onSwipeEnd}
      text={t('menu_PaymentMethodPopup_delete')}
      mode={SwipeButtonModes.Finish}
      containerStyle={styles.sliderContainerStyle}
      textStyle={styles.sliderTextStyle}
      sliderElement={
        <Bar onPress={!isSelected ? onSelectMethod : undefined}>
          <View style={[styles.methodWrapper, computedStyles.methodWrapper]}>
            <View style={styles.methodContainer}>
              {getPaymentIcon(paymentMethod.method)}
              <View style={styles.detailsWrapper}>
                <Text style={[styles.detailsStars, computedStyles.detailsStars]}>****</Text>
                <Text style={styles.details}>{paymentMethod.details}</Text>
              </View>
            </View>
            {isSelected && <RoundCheckIcon3 style={styles.roundCheckIconStyle} />}
          </View>
        </Bar>
      }
    />
  );
};

const styles = StyleSheet.create({
  sliderContainerStyle: {
    padding: 0,
  },
  sliderTextStyle: {
    alignSelf: 'flex-end',
    paddingRight: 20,
  },
  methodWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 25,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderRadius: 12,
  },
  methodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  detailsWrapper: {
    paddingTop: 4,
    flexDirection: 'row',
    gap: 4,
  },
  detailsStars: {
    paddingTop: 4,
    fontFamily: 'Inter Medium',
    fontSize: 17,
    lineHeight: 22,
    textAlignVertical: 'center',
  },
  details: {
    fontFamily: 'Inter Medium',
    fontSize: 17,
    lineHeight: 22,
  },
  roundCheckIconStyle: {
    width: sizes.iconSize,
    height: sizes.iconSize,
  },
});

export default PaymentMethodContent;
