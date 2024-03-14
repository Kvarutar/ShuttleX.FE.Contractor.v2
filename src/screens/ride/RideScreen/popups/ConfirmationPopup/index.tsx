import React from 'react';
import { StyleSheet } from 'react-native';
import { Popup, SwipeButton, Text, useTheme } from 'shuttlex-integration';

import { ConfirmationPopupProps } from './props';

const ConfirmationPopup = ({ onClose, onSwipeEnd, swipeMode, popupTitle }: ConfirmationPopupProps) => {
  const { colors } = useTheme();

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
