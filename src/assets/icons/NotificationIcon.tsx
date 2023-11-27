import React from 'react';
import { type StyleProp, StyleSheet, type ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { sizes } from 'shuttlex-integration';

const NotificationIcon = ({ style }: { style?: StyleProp<ViewStyle> }): JSX.Element => (
  <Svg xmlns="http://www.w3.org/2000/svg" style={[styles.NotificationIcon, style]} fill="none">
    <Path
      d="M12.1766 5.88281C15.1735 5.88281 17.603 8.31233 17.603 11.3093L17.603 19.3828H6.75009V11.3093C6.75009 8.31233 9.1796 5.88281 12.1766 5.88281Z"
      stroke="black"
      strokeWidth={1.5}
    />
    <Path
      d="M9.89355 6.02088C9.89355 6.02088 10.6047 4 12.1763 4C13.748 4 14.1086 6.02088 14.1086 6.02088"
      stroke="black"
      strokeWidth={1.5}
      strokeLinecap="round"
    />
    <Path d="M10.1768 19.9941H14.3918" stroke="black" strokeWidth={1.5} strokeLinecap="round" />
  </Svg>
);

const styles = StyleSheet.create({
  NotificationIcon: {
    width: sizes.iconSize,
    height: sizes.iconSize,
  },
});

export default NotificationIcon;
