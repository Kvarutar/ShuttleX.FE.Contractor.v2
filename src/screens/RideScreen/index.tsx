import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Pressable, SafeAreaView, StyleSheet, View } from 'react-native';
import { getLocales } from 'react-native-localize';
import {
  Bar,
  BottomWindow,
  Button,
  ButtonModes,
  ClockIcon,
  MenuIcon,
  NotificationIcon,
  Popup,
  PreferencesIcon,
  RoundButton,
  sizes,
  StatisticsIcon,
  SwipeButton,
  SwipeButtonModes,
  Text,
  useTheme,
} from 'shuttlex-integration';

import { type RideScreenProps } from './props';
import RidePreferences from './RidePreferences';

type lineStates = 'online' | 'offline';

type lineStateTypes = {
  popupTitle: string;
  toLineState: lineStates;
  bottomTitle: string;
  buttonText: string;
  buttonMode: ButtonModes;
  swipeMode: SwipeButtonModes;
};

const dateOptions: Intl.DateTimeFormatOptions = {
  year: '2-digit',
  month: '2-digit',
  day: 'numeric',
};

const RideScreen = ({}: RideScreenProps): JSX.Element => {
  const { t } = useTranslation();
  const rideBuilderRecord: Record<lineStates, lineStateTypes> = {
    online: {
      popupTitle: t('ride_Ride_Popup_onlineTitle'),
      toLineState: 'offline',
      bottomTitle: t('ride_Ride_BottomWindow_onlineTitle'),
      buttonText: t('ride_Ride_Bar_onlineTitle'),
      buttonMode: ButtonModes.Mode3,
      swipeMode: SwipeButtonModes.Decline,
    },
    offline: {
      popupTitle: t('ride_Ride_Popup_offlineTitle'),
      toLineState: 'online',
      bottomTitle: t('ride_Ride_BottomWindow_offlineTitle'),
      buttonText: t('ride_Ride_Bar_offlineTitle'),
      buttonMode: ButtonModes.Mode1,
      swipeMode: SwipeButtonModes.Confirm,
    },
  };

  const { colors } = useTheme();
  const [isConfirmationPopupVisible, setIsConfirmationPopupVisible] = useState<boolean>(false);
  const [isPreferencesPopupVisible, setIsPreferencesPopupVisible] = useState<boolean>(false);
  const [lineState, setLineState] = useState<lineStateTypes>(rideBuilderRecord.offline);
  const currentDate = new Intl.DateTimeFormat(getLocales()[0].languageTag, dateOptions).format(new Date());

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
    setIsConfirmationPopupVisible(false);
  };

  const { popupTitle, toLineState, bottomTitle, buttonText, buttonMode, swipeMode } = lineState;
  return (
    <SafeAreaView style={styles.wrapper}>
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
      <BottomWindow style={styles.bottom}>
        <View style={styles.infoWrapper}>
          <Pressable onPress={() => setIsPreferencesPopupVisible(true)}>
            <PreferencesIcon />
          </Pressable>
          <Text style={[computedStyles.title, styles.title]}>{bottomTitle}</Text>
          <Pressable>
            <StatisticsIcon />
          </Pressable>
        </View>
        <Bar style={styles.card} isActive>
          <Image source={require('shuttlex-integration/src/assets/img/BasicX.png')} style={styles.img} />
          <View style={styles.textWrapper}>
            <Text style={computedStyles.title}>BasicX</Text>
            <View style={styles.dateWrapper}>
              <ClockIcon />
              <Text style={[styles.date, computedStyles.dateText]}>{currentDate}</Text>
            </View>
          </View>
          <Button mode={buttonMode} text={buttonText} onPress={() => setIsConfirmationPopupVisible(true)} />
        </Bar>
      </BottomWindow>
      {isConfirmationPopupVisible && (
        <Popup onCloseButtonPress={() => setIsConfirmationPopupVisible(false)}>
          <Text style={[computedStyles.title, styles.confirmTitle, styles.title]}>{popupTitle}</Text>
          <SwipeButton mode={swipeMode} onSwipeEnd={() => swipeHandler(toLineState)} />
        </Popup>
      )}
      {isPreferencesPopupVisible && (
        <Popup
          onCloseButtonPress={() => setIsPreferencesPopupVisible(false)}
          bottomWindowStyle={styles.preferencesPopup}
        >
          <RidePreferences tarifs={['BasicX', 'BasicXL', 'ComfortX']} />
        </Popup>
      )}
    </SafeAreaView>
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
    position: 'relative',
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
  preferencesPopup: {
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
});

export default RideScreen;
