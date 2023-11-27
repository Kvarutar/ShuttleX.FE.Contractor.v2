import React from 'react';
import { type StyleProp, StyleSheet, type ViewStyle } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { sizes } from 'shuttlex-integration';

const ClockIcon = ({ style }: { style?: StyleProp<ViewStyle> }): JSX.Element => (
  <Svg xmlns="http://www.w3.org/2000/svg" style={[styles.ClockIcon, style]} fill="none">
    <Circle cx={11.5} cy={11.5} r={8.75} stroke="#B4B4B4" strokeWidth={1.5} />
    <Path d="M11.5 7.40234V11.5009L14.3174 14.3182" stroke="#B4B4B4" strokeWidth={1.5} strokeLinecap="round" />
  </Svg>
);

const styles = StyleSheet.create({
  ClockIcon: {
    width: sizes.iconSize,
    height: sizes.iconSize,
  },
});

export default ClockIcon;
