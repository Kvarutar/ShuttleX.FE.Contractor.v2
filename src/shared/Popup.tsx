import React from 'react';
import { StyleSheet, View } from 'react-native';
import { BottomWindow, RoundButton, sizes } from 'shuttlex-integration';

import CloseIcon from '../assets/icons/CloseIcon';

const Popup = ({
  setIsPopupVisible,
  children,
}: {
  setIsPopupVisible: (isPopup: boolean) => void;
  children: React.ReactNode;
}) => (
  <View style={styles.bottom}>
    <RoundButton style={styles.close} onPress={() => setIsPopupVisible(false)}>
      <CloseIcon />
    </RoundButton>
    <BottomWindow>{children}</BottomWindow>
  </View>
);

const styles = StyleSheet.create({
  bottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  close: {
    alignSelf: 'flex-end',
    marginBottom: 26,
    marginRight: sizes.paddingHorizontal,
  },
});

export default Popup;
