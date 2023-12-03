import { BlurView } from '@react-native-community/blur';
import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import {
  Bar,
  BottomWindow,
  Button,
  ButtonModes,
  RoundButton,
  sizes,
  SwipeButton,
  SwipeButtonModes,
  Text,
  useTheme,
} from 'shuttlex-integration';

import ClockIcon from '../../assets/icons/ClockIcon';
import MenuIcon from '../../assets/icons/MenuIcon';
import NotificationIcon from '../../assets/icons/NotificationIcon';
import PreferencesIcon from '../../assets/icons/PreferencesIcon';
import StatisticsIcon from '../../assets/icons/StatitsticsIcon';
import Popup from '../../shared/Popup';
import { type RideScreenProps } from './props';

type lineStates = 'online' | 'offline';

type lineStateTypes = {
  popupTitle: string;
  toLineState: lineStates;
  bottomTitle: string;
  buttonText: string;
  buttonMode: ButtonModes;
  swipeMode: SwipeButtonModes;
};

const rideBuilderRecord: Record<lineStates, lineStateTypes> = {
  online: {
    popupTitle: 'Confirm to stop',
    toLineState: 'offline',
    bottomTitle: 'You`re online',
    buttonText: 'Stop',
    buttonMode: ButtonModes.Mode1,
    swipeMode: SwipeButtonModes.Decline,
  },
  offline: {
    popupTitle: 'Confirm to go online',
    toLineState: 'online',
    bottomTitle: 'You`re offline',
    buttonText: "Let's go",
    buttonMode: ButtonModes.Mode3,
    swipeMode: SwipeButtonModes.Confirm,
  },
};

const RideScreen = ({}: RideScreenProps): JSX.Element => {
  const { colors } = useTheme();
  const [isPopupVisible, setIsPopupVisible] = useState<boolean>(false);
  const [lineState, setLineState] = useState<lineStateTypes>(rideBuilderRecord.offline);

  const { textPrimaryColor, textSecondaryColor, backgroundPrimaryColor } = colors;

  const computedStyles = StyleSheet.create({
    title: {
      color: textPrimaryColor,
    },
    dateText: {
      color: textSecondaryColor,
    },
    map: {
      backgroundColor: backgroundPrimaryColor,
    },
  });

  const swipeHandler = (mode: lineStates) => {
    setLineState(rideBuilderRecord[mode]);
    setIsPopupVisible(false);
  };

  const { popupTitle, toLineState, bottomTitle, buttonText, buttonMode, swipeMode } = lineState;
  return (
    <View style={styles.wrapper}>
      <View style={[styles.map, computedStyles.map]}>
        <Text>Карта</Text>
      </View>
      <View style={styles.headerButtonsContainer}>
        <RoundButton>
          <MenuIcon />
        </RoundButton>
        <RoundButton>
          <NotificationIcon />
        </RoundButton>
      </View>
      {isPopupVisible ? (
        <>
          <BlurView
            style={StyleSheet.absoluteFill}
            blurType="light"
            blurAmount={7}
            reducedTransparencyFallbackColor="white"
          />
          <Popup setIsPopupVisible={() => setIsPopupVisible(false)}>
            <Text style={[computedStyles.title, styles.confirmTitle, styles.title]}>{popupTitle}</Text>
            <SwipeButton mode={swipeMode} onSwipeEnd={() => swipeHandler(toLineState)} />
          </Popup>
        </>
      ) : (
        <BottomWindow style={styles.bottom}>
          <View style={styles.infoWrapper}>
            <Pressable>
              <PreferencesIcon />
            </Pressable>
            <Text style={[computedStyles.title, styles.title]}>{bottomTitle}</Text>
            <Pressable>
              <StatisticsIcon />
            </Pressable>
          </View>
          <Bar style={styles.card} isActive>
            <Image source={require('../../assets/img/BasicX.png')} style={styles.img} />
            <View style={styles.textWrapper}>
              <Text style={computedStyles.title}>BasicX</Text>
              <View style={styles.dateWrapper}>
                <ClockIcon />
                <Text style={[styles.date, computedStyles.dateText]}>24/08/22</Text>
              </View>
            </View>
            <Button mode={buttonMode} text={buttonText} onPress={() => setIsPopupVisible(true)} />
          </Bar>
        </BottomWindow>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerButtonsContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: sizes.paddingVertical,
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: sizes.paddingHorizontal,
  },
  wrapper: {
    flex: 1,
  },
  card: {
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
    marginLeft: 2,
  },
  dateWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  infoWrapper: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 28,
  },
  bottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  date: {
    fontSize: 12,
    marginLeft: 4,
  },
  confirmTitle: {
    marginBottom: 62,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter Medium',
    textAlign: 'center',
  },
  map: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RideScreen;
