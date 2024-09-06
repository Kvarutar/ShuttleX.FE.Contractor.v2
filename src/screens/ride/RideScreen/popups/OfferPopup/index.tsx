import { useEffect, useState } from 'react';
import { Dimensions, Platform, StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Popup, sizes, TimerV1, TimerV1Modes, useThemeV1 } from 'shuttlex-integration';

import Offer from '../../Offer';
import { OfferPopupProps } from './props';

const windowHeight = Dimensions.get('window').height;
const timerAnimationDuration = 300;

const OfferPopup = ({ offer, onOfferAccept, onOfferDecline, onClose }: OfferPopupProps) => {
  const { colors } = useThemeV1();
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    setCurrentTime(new Date().getTime() + 120000);
  }, []);

  const { top } = useSafeAreaInsets();

  const computedStyles = StyleSheet.create({
    timer: {
      top: Platform.OS === 'android' ? sizes.paddingVertical : top,
    },
  });

  return (
    <>
      <Popup bottomWindowStyle={styles.popup}>
        <Offer offer={offer} onOfferAccept={onOfferAccept} onOfferDecline={onOfferDecline} />
      </Popup>
      <Animated.View
        style={[styles.timer, computedStyles.timer]}
        exiting={FadeOut.duration(timerAnimationDuration)}
        entering={FadeIn.duration(timerAnimationDuration)}
      >
        <TimerV1
          initialDate={new Date(currentTime)} //20000 - for test
          onAfterCountdownEnds={onClose}
          startColor={colors.primaryGradientStartColor}
          endColor={colors.primaryColor}
          mode={TimerV1Modes.Normal}
        />
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  popup: {
    maxHeight: windowHeight * 0.7,
  },
  timer: {
    position: 'absolute',
    right: sizes.paddingHorizontal,
  },
});

export default OfferPopup;
