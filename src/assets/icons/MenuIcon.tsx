import React from 'react';
import { type StyleProp, StyleSheet, type ViewStyle } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import { sizes } from 'shuttlex-integration';

const MenuIcon = ({ style }: { style?: StyleProp<ViewStyle> }): JSX.Element => (
  <Svg xmlns="http://www.w3.org/2000/svg" style={[styles.MenuIcon, style]} fill="none">
    <Rect x={3.75} y={3.75} width={6.5} height={6.5} rx={3.25} stroke="black" strokeWidth={1.5} />
    <Rect x={3.75} y={13.75} width={6.5} height={6.5} rx={3.25} stroke="black" strokeWidth={1.5} />
    <Rect x={13.75} y={3.75} width={6.5} height={6.5} rx={3.25} stroke="black" strokeWidth={1.5} />
    <Rect x={13.75} y={13.75} width={6.5} height={6.5} rx={3.25} stroke="black" strokeWidth={1.5} />
  </Svg>
);

const styles = StyleSheet.create({
  MenuIcon: {
    width: sizes.iconSize,
    height: sizes.iconSize,
  },
});

export default MenuIcon;
