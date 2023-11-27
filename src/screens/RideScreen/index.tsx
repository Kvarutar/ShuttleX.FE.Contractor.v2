import { BlurView } from '@react-native-community/blur';
import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Bar, BottomWindow, Button, RoundButton, sizes, useTheme } from 'shuttlex-integration';

import ClockIcon from '../../assets/icons/ClockIcon';
import CloseIcon from '../../assets/icons/CloseIcon';
import MenuIcon from '../../assets/icons/MenuIcon';
import NotificationIcon from '../../assets/icons/NotificationIcon';
import PreferencesIcon from '../../assets/icons/PreferencesIcon';
import StatisticsIcon from '../../assets/icons/StatitsticsIcon';
import { type RideScreenProps } from './props';

const RideScreen = ({}: RideScreenProps): JSX.Element => {
  const { colors } = useTheme();
  const [isPopup, setPopup] = useState<boolean>(false);

  const computedStyles = StyleSheet.create({
    title: {
      color: colors.textPrimaryColor,
      fontSize: 18,
      fontFamily: 'Inter Medium',
      letterSpacing: 0.72,
    },
    date: {
      fontSize: 12,
      letterSpacing: 0.48,
      marginLeft: 4,
    },
  });

  return (
    <View style={styles.wrapper}>
      <View style={[styles.container]}>
        <RoundButton>
          <MenuIcon />
        </RoundButton>
        <RoundButton>
          <NotificationIcon />
        </RoundButton>
      </View>
      {isPopup ? (
        <BlurView style={styles.absolute} blurType="light" blurAmount={7} reducedTransparencyFallbackColor="white" />
      ) : null}
      <View style={styles.bottom}>
        {isPopup ? (
          <RoundButton style={styles.close} onPress={() => setPopup(false)}>
            <CloseIcon />
          </RoundButton>
        ) : null}
        <BottomWindow>
          <View style={styles.infoWrapper}>
            <Pressable>
              <PreferencesIcon />
            </Pressable>
            <Text style={computedStyles.title}>You`re offline</Text>
            <Pressable>
              <StatisticsIcon />
            </Pressable>
          </View>
          <Bar style={styles.card}>
            <Image source={require('../../assets/img/BasicX.png')} style={styles.img} />
            <View style={styles.textWrapper}>
              <Text style={computedStyles.title}>BasicX</Text>
              <View style={styles.dateWrapper}>
                <ClockIcon />
                <Text style={computedStyles.date}>24/08/22</Text>
              </View>
            </View>
            <Button mode="mode1" text="Let's go" onPress={() => setPopup(true)} />
          </Bar>
        </BottomWindow>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: sizes.paddingHorizontal,
    position: 'absolute',
    width: '100%',
    top: sizes.paddingVertical,
  },
  wrapper: {
    flex: 1,
  },
  card: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  img: {
    width: 90,
    height: 57,
  },
  textWrapper: {
    marginRight: 20,
  },
  dateWrapper: {
    flex: 0,
    alignItems: 'center',
    flexDirection: 'row',
  },
  infoWrapper: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 28,
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  bottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  close: {
    flex: 0,
    alignSelf: 'flex-end',
    marginBottom: 26,
    marginRight: sizes.paddingHorizontal,
  },
});

export default RideScreen;
