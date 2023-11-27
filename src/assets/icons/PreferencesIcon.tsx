import React from 'react';
import { type StyleProp, StyleSheet, type ViewStyle } from 'react-native';
import Svg, { Mask, Path, Rect } from 'react-native-svg';
import { sizes } from 'shuttlex-integration';

const PreferencesIcon = ({ style }: { style?: StyleProp<ViewStyle> }): JSX.Element => (
  <Svg xmlns="http://www.w3.org/2000/svg" style={[styles.PreferencesIcon, style]} fill="none">
    <Path d="M19.0779 7.54297H5" stroke="black" strokeWidth={1.5} strokeLinecap="round" />
    <Path d="M18.7192 12.9995L5 13.0434" stroke="black" strokeWidth={1.5} strokeLinecap="round" />
    <Path d="M15.9116 18.523L5 18.5669" stroke="black" strokeWidth={1.5} strokeLinecap="round" />
    <Mask id="path-4-inside-1_115_1740" fill="white">
      <Rect x={14} y={10} width={6} height={6} rx={1} />
    </Mask>
    <Rect
      x={14}
      y={10}
      width={6}
      height={6}
      rx={1}
      fill="white"
      stroke="black"
      strokeWidth={3}
      mask="url(#path-4-inside-1_115_1740)"
    />
    <Mask id="path-5-inside-2_115_1740" fill="white">
      <Rect x={4} y={4} width={6} height={6} rx={1} />
    </Mask>
    <Rect
      x={4}
      y={4}
      width={6}
      height={6}
      rx={1}
      fill="white"
      stroke="black"
      strokeWidth={3}
      mask="url(#path-5-inside-2_115_1740)"
    />
  </Svg>
);

const styles = StyleSheet.create({
  PreferencesIcon: {
    width: sizes.iconSize,
    height: sizes.iconSize,
  },
});

export default PreferencesIcon;
