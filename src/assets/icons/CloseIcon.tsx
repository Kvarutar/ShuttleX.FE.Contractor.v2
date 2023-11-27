import React from 'react';
import { type StyleProp, StyleSheet, type ViewStyle } from 'react-native';
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg';
import { sizes } from 'shuttlex-integration';

const CloseIcon = ({ style }: { style?: StyleProp<ViewStyle> }): JSX.Element => (
  <Svg xmlns="http://www.w3.org/2000/svg" style={[styles.CloseIcon, style]} fill="none">
    <G clipPath="url(#clip0_117_2818)">
      <Path d="M18.3642 18.3848L5.98985 6.01043" stroke="black" strokeWidth={2} strokeLinecap="round" />
      <Path d="M5.6357 18.3847L18.0101 6.01036" stroke="black" strokeWidth={2} strokeLinecap="round" />
    </G>
    <Defs>
      <ClipPath id="clip0_117_2818">
        <Rect width={24} height={24} fill="white" />
      </ClipPath>
    </Defs>
  </Svg>
);

const styles = StyleSheet.create({
  CloseIcon: {
    width: sizes.iconSize,
    height: sizes.iconSize,
  },
});

export default CloseIcon;
