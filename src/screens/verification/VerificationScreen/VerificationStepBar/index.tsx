import { StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import {
  Bar,
  Button,
  ButtonShapes,
  CircleButtonModes,
  LoadingSpinner,
  LoadingSpinnerIconModes,
  RoundCheckIcon2,
  ShortArrowSmallIcon,
  Text,
} from 'shuttlex-integration';

import { VerificationStepBarProps } from './props';

const VerificationStepBar = ({
  isSelected = false,
  text,
  onPress,
  isDisabled,
  barMode,
  textStyle,
  buttonMode = CircleButtonModes.Mode4,
  isLoading = false,
}: VerificationStepBarProps) => {
  const stateIndicator = isLoading ? (
    <LoadingSpinner iconMode={LoadingSpinnerIconModes.Mini} style={styles.loadingSpinner} />
  ) : isSelected ? (
    <RoundCheckIcon2 style={styles.roundButton} />
  ) : (
    <Button
      style={styles.roundButton}
      mode={buttonMode}
      shape={ButtonShapes.Circle}
      onPress={onPress}
      disabled={isDisabled}
    >
      <ShortArrowSmallIcon />
    </Button>
  );

  return (
    <Animated.View entering={FadeIn} exiting={FadeOut}>
      <Bar style={styles.bar} mode={barMode} onPress={onPress} disabled={isDisabled}>
        <Text style={[styles.contentText, textStyle]}>{text}</Text>
        {stateIndicator}
      </Bar>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  bar: {
    height: 64,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  contentText: {
    fontFamily: 'Inter Medium',
  },
  roundButton: {
    height: 32,
    width: 32,
  },
  loadingSpinner: {
    flex: 0,
  },
});

export default VerificationStepBar;
