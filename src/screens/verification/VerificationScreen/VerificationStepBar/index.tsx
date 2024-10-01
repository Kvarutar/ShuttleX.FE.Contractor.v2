import { StyleSheet } from 'react-native';
import {
  Bar,
  Button,
  ButtonShapes,
  CircleButtonModes,
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
}: VerificationStepBarProps) => {
  return (
    <Bar style={styles.bar} mode={barMode} onPress={onPress} disabled={isDisabled}>
      <Text style={[styles.contentText, textStyle]}>{text}</Text>
      {isSelected ? (
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
      )}
    </Bar>
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
});

export default VerificationStepBar;
