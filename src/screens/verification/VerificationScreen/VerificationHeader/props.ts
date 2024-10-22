import { StyleProp, ViewStyle } from 'react-native';

export type VerificationHeaderProps = {
  windowTitle: string;
  firstHeaderTitle: string;
  secondHeaderTitle: string;
  description?: string;
  containerStyle?: StyleProp<ViewStyle>;
};
