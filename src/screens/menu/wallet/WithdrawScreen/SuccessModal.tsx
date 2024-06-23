import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useSelector } from 'react-redux';
import { Blur, Button, sizes, SuccessIcon, Text, useTheme } from 'shuttlex-integration';

import { selectedPaymentMethodSelector } from '../../../../core/menu/redux/wallet/selectors';

const animationDuration = 200;

const SuccessModal = ({ amount, onContinue }: { amount: number; onContinue: () => void }) => {
  const selectedPaymentMethod = useSelector(selectedPaymentMethodSelector);
  const { colors } = useTheme();
  const { t } = useTranslation();

  const computedStyles = StyleSheet.create({
    wrapper: {
      backgroundColor: colors.backgroundPrimaryColor,
    },
  });

  return (
    <>
      <Blur />
      <Animated.View
        entering={FadeIn.duration(animationDuration)}
        exiting={FadeOut.duration(animationDuration)}
        style={[styles.container, StyleSheet.absoluteFill]}
      >
        <View style={[styles.wrapper, computedStyles.wrapper]}>
          <SuccessIcon style={styles.icon} />
          <Text style={styles.content}>
            {t('menu_Withdraw_SuccessPopup_content1')} <Text style={styles.bold}>${amount}&nbsp;</Text>
            {t('menu_Withdraw_SuccessPopup_content2')}&nbsp;
            <Text style={styles.bold}>{selectedPaymentMethod?.details}</Text>
          </Text>
          <Button text={t('menu_Withdraw_SuccessPopup_continueButton')} onPress={onContinue} />
        </View>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: sizes.paddingHorizontal,
  },
  wrapper: {
    borderRadius: 22,
    paddingHorizontal: sizes.paddingHorizontal,
    paddingVertical: sizes.paddingVertical,
    gap: 30,
  },
  icon: {
    alignSelf: 'center',
  },
  content: {
    textAlign: 'center',
    lineHeight: 24,
  },
  bold: {
    fontFamily: 'Inter Medium',
  },
});

export default SuccessModal;
