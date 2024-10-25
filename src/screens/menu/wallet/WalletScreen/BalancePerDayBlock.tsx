import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useTheme } from 'shuttlex-integration';

const animationDuration = 3000;

const windowHeight = Dimensions.get('window').height;

const isSmallDevice = windowHeight < 800;

const maxStatisticBlockHeight = isSmallDevice ? windowHeight * 0.17 : windowHeight * 0.2;
const minStatisticBlockHeight = 12;
const zeroStatisticBlockHeight = 10;

const BalancePerDayBlock = ({ sumPerDay, maxSum }: { sumPerDay: number; maxSum: number }) => {
  const { colors } = useTheme();
  const animatedHeight = useSharedValue(0);

  const blockHeight =
    sumPerDay === 0
      ? zeroStatisticBlockHeight
      : Math.max((sumPerDay / maxSum) * maxStatisticBlockHeight, minStatisticBlockHeight);

  // For Updating animation every focusing by navigation
  useFocusEffect(
    useCallback(() => {
      animatedHeight.value = withSpring(blockHeight, { duration: animationDuration });
      return () => (animatedHeight.value = 0);
    }, [blockHeight, animatedHeight]),
  );

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: sumPerDay === 0 ? zeroStatisticBlockHeight : animatedHeight.value,
    };
  });

  const computedStyles = StyleSheet.create({
    container: {
      backgroundColor: colors.iconPrimaryColor,
      opacity: sumPerDay === 0 ? 0.2 : 1,
    },
  });

  return <Animated.View style={[styles.container, computedStyles.container, animatedStyle]} />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 10,
  },
});

export default BalancePerDayBlock;
