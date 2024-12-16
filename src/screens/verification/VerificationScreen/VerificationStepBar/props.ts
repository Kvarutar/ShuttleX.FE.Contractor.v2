import { type StyleProp, type TextStyle } from 'react-native';
import { CircleButtonModes } from 'shuttlex-integration';
import { BarModes } from 'shuttlex-integration/src/shared/atoms/Bar/types';

export type VerificationStepBarProps = {
  text: string;
  isSelected?: boolean;
  onPress: () => void;
  isDisabled?: boolean;
  barMode?: BarModes;
  buttonMode?: CircleButtonModes;
  textStyle?: StyleProp<TextStyle>;
  isLoading?: boolean;
};
