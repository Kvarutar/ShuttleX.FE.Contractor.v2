import { useEffect } from 'react';
import { Keyboard, LayoutChangeEvent, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector, PanGesture } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDecay,
} from 'react-native-reanimated';
import { useTheme } from 'shuttlex-integration';

import { SliderAmountProps } from './types';

const markProperties = {
  width: 1,
  gap: 8,
  amount: 101,
};

const offsets = {
  min: 0,
  max: -900,
};

const SliderAmount = ({ balanceTotal, minWithdrawSum, inputAmount, setInputAmount }: SliderAmountProps) => {
  const maxSum = Math.round(balanceTotal / 100) * 100;

  const { colors } = useTheme();
  const offset = useSharedValue<number>(0);
  const width = useSharedValue<number>(0);

  const onLayout = (event: LayoutChangeEvent) => {
    width.value = event.nativeEvent.layout.width * 4;
  };

  const setInputAmountFromAnimation = (value: number) => {
    if (!Keyboard.isVisible()) {
      setInputAmount(value);
    }
  };

  const dismissKeyboard = () => Keyboard.dismiss();

  useEffect(() => {
    if (Keyboard.isVisible()) {
      const percentage = (inputAmount - minWithdrawSum) / (balanceTotal - minWithdrawSum);
      const newOffset = offsets.min + percentage * (offsets.max - offsets.min);

      if (inputAmount >= minWithdrawSum && inputAmount <= balanceTotal) {
        offset.value = newOffset;
      } else {
        if (inputAmount > balanceTotal) {
          offset.value = offsets.max;
        }
        if (inputAmount < minWithdrawSum) {
          offset.value = offsets.min;
        }
      }
    }
  }, [offset, inputAmount, balanceTotal, minWithdrawSum]);

  useDerivedValue(() => {
    const offsetValue = offset.value;
    if (offsetValue <= offsets.min && offsetValue > offsets.max + 10) {
      const calculatedAmount =
        minWithdrawSum + (maxSum - minWithdrawSum) * ((offsetValue - offsets.min) / (offsets.max - offsets.min));
      let roundedCalculatedAmount = Math.round(calculatedAmount / 10) * 10;

      if (maxSum > 1000) {
        roundedCalculatedAmount = Math.round(calculatedAmount / 100) * 100;
      }

      runOnJS(setInputAmountFromAnimation)(Math.abs(roundedCalculatedAmount));
    } else {
      if (offsetValue > offsets.min) {
        runOnJS(setInputAmountFromAnimation)(minWithdrawSum);
      }
      if (offsetValue <= offsets.max) {
        runOnJS(setInputAmountFromAnimation)(balanceTotal);
      }
    }
  }, []);

  const pan: PanGesture = Gesture.Pan()
    .onStart(() => {
      runOnJS(dismissKeyboard)();
    })
    .onChange(event => {
      offset.value += event.changeX;
    })
    .onFinalize(event => {
      const roundedVelocity = Math.round(event.velocityX / 100) * 100;
      offset.value = withDecay({
        velocity: roundedVelocity,
        rubberBandEffect: true,
        rubberBandFactor: 1,
        clamp: [-((markProperties.width + markProperties.gap) * (markProperties.amount - 1)), 0],
        velocityFactor: 0.9,
      });
    });

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value }],
  }));

  const computedStyles = StyleSheet.create({
    animatedBlocksContainer: {
      gap: markProperties.gap,
    },
    activeMark: {
      backgroundColor: colors.iconPrimaryColor,
    },
  });

  return (
    <GestureDetector gesture={pan}>
      <View onLayout={onLayout} style={styles.blocksContainer}>
        <View style={[styles.activeMark, computedStyles.activeMark]} />
        <Animated.View style={[styles.animatedBlocksContainer, computedStyles.animatedBlocksContainer, animatedStyles]}>
          {Array.from({ length: markProperties.amount }).map((_, idx) => (
            <Mark key={idx} isBigMark={idx % 10 === 0} />
          ))}
        </Animated.View>
      </View>
    </GestureDetector>
  );
};

const Mark = ({ isBigMark }: { isBigMark: boolean }) => {
  const { colors } = useTheme();

  const computedStyles = StyleSheet.create({
    inactiveBlock: {
      height: isBigMark ? 20 : 10,
      backgroundColor: colors.iconPrimaryColor,
      opacity: 0.3,
      width: markProperties.width,
    },
  });

  return <View style={computedStyles.inactiveBlock} />;
};

const styles = StyleSheet.create({
  blocksContainer: {
    justifyContent: 'center',
    paddingLeft: '50%',
    paddingVertical: 44,
  },
  animatedBlocksContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeMark: {
    position: 'absolute',
    alignSelf: 'center',
    width: 2,
    height: 30,
    zIndex: 2,
  },
});

export default SliderAmount;
