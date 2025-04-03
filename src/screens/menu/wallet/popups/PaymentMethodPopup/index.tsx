import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import {
  BottomWindowWithGesture,
  BottomWindowWithGestureRef,
  Button,
  ScrollViewWithCustomScroll,
  WINDOW_HEIGHT,
} from 'shuttlex-integration';

import {
  avaliablePaymentMethodsListSelector,
  selectedPaymentMethodSelector,
} from '../../../../../core/menu/redux/wallet/selectors';
import { sendSelectedPaymentMethod } from '../../../../../core/menu/redux/wallet/thunks';
import { PaymentMethodWithoutExpiresAt } from '../../../../../core/menu/redux/wallet/types';
import { useAppDispatch } from '../../../../../core/redux/hooks';
import PaymentMethodContent from './PaymentMethod';
import { PaymentMethodPopupProps } from './props';

const PaymentMethodPopup = ({ setIsPaymentsVariantsVisible, onOpenAddCardPopup }: PaymentMethodPopupProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const bottomWindowRef = useRef<BottomWindowWithGestureRef>(null);

  const avaliablePaymentMethods = useSelector(avaliablePaymentMethodsListSelector);
  const selectedPaymentMethod = useSelector(selectedPaymentMethodSelector);

  useEffect(() => {
    bottomWindowRef.current?.openWindow();
  }, []);

  const onSelectMethod = async (method: PaymentMethodWithoutExpiresAt) => {
    await dispatch(sendSelectedPaymentMethod({ method }));
    bottomWindowRef.current?.closeWindow();
    setIsPaymentsVariantsVisible(false);
  };

  let paymentMethodsContent: JSX.Element = <></>;

  if (avaliablePaymentMethods.length > 0 && selectedPaymentMethod) {
    paymentMethodsContent = (
      <>
        {avaliablePaymentMethods.map((method, index) => (
          <PaymentMethodContent
            key={index}
            index={index}
            paymentMethod={method}
            onSelectMethod={() => onSelectMethod(method)}
          />
        ))}
      </>
    );
  }

  const computedStyles = StyleSheet.create({
    hiddenPartContentWrapper: {
      height: WINDOW_HEIGHT * 0.46,
    },
  });

  return (
    <BottomWindowWithGesture
      ref={bottomWindowRef}
      setIsOpened={setIsPaymentsVariantsVisible}
      withShade
      withHiddenPartScroll
      hiddenPart={
        <View style={[styles.hiddenPartContentWrapper, computedStyles.hiddenPartContentWrapper]}>
          <ScrollViewWithCustomScroll
            contentContainerStyle={styles.paymentMethodsContentWrapper}
            withScroll={avaliablePaymentMethods.length > 0}
          >
            {paymentMethodsContent}
          </ScrollViewWithCustomScroll>
          <Button
            text={t('menu_PaymentMethodPopup_withdrawButton')}
            onPress={onOpenAddCardPopup}
            containerStyle={styles.buttonContainerStyle}
          />
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  hiddenPartContentWrapper: {
    paddingTop: 12,
    justifyContent: 'space-between',
  },
  paymentMethodsContentWrapper: {
    gap: 8,
  },
  buttonContainerStyle: {
    paddingTop: 12,
  },
});

export default PaymentMethodPopup;
