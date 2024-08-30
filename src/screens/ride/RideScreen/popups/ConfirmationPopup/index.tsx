import { StyleSheet } from 'react-native';
import { Popup, SwipeButton, Text, useThemeV1 } from 'shuttlex-integration';

import { ConfirmationPopupProps } from './props';

const ConfirmationPopup = ({ onClose, onSwipeEnd, swipeMode, popupTitle }: ConfirmationPopupProps) => {
  const { colors } = useThemeV1();

  const computedStyles = StyleSheet.create({
    title: {
      color: colors.textPrimaryColor,
    },
  });

  return (
    <Popup onCloseButtonPress={onClose}>
      <Text style={[computedStyles.title, styles.confirmTitle, styles.title]}>{popupTitle}</Text>
      <SwipeButton mode={swipeMode} onSwipeEnd={onSwipeEnd} />
    </Popup>
  );
};

const styles = StyleSheet.create({
  confirmTitle: {
    marginBottom: 62,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter Medium',
    textAlign: 'center',
  },
});

export default ConfirmationPopup;
