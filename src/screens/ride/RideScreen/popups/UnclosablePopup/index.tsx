import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, StyleSheet, View } from 'react-native';
import { BottomWindow, BottomWindowWithGestureRef, Text, useTheme } from 'shuttlex-integration';

import { UnclosablePopupInfo, UnclosablePopupModes, UnclosablePopupProps } from './props';

const windowHeight = Dimensions.get('window').height;

const popupInfo: UnclosablePopupInfo = {
  warning: {
    subTitle: 'ride_Ride_UnclosablePopup_warningSubtitle',
    title: 'ride_Ride_UnclosablePopup_warningTitle',
    secondTitle: null,
    description: 'ride_Ride_UnclosablePopup_warningDescription',
  },
  banned: {
    subTitle: 'ride_Ride_UnclosablePopup_bannedSubtitle',
    title: 'ride_Ride_UnclosablePopup_bannedTitle',
    secondTitle: null,
    description: 'ride_Ride_UnclosablePopup_bannedDescription',
  },
  accountIsNotActive: {
    subTitle: 'ride_Ride_UnclosablePopup_accountIsNotActiveSubtitle',
    title: 'ride_Ride_UnclosablePopup_accountIsNotActiveTitle',
    secondTitle: 'ride_Ride_UnclosablePopup_accountIsNotActiveSecondTitle',
    description: 'ride_Ride_UnclosablePopup_accountIsNotActiveDescription',
  },
};

const UnclosablePopup = ({ mode = UnclosablePopupModes.Warning, bottomAdditionalContent }: UnclosablePopupProps) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const bottomWindowRef = useRef<BottomWindowWithGestureRef>(null);

  useEffect(() => {
    bottomWindowRef.current?.openWindow();
  }, []);

  const computedStyles = StyleSheet.create({
    windowStyle: {
      height: windowHeight * 0.6,
    },
    subTitle: {
      color: colors.textSecondaryColor,
    },
    titleFirst: {
      color: colors.textPrimaryColor,
      marginBottom: !popupInfo[mode].secondTitle ? 14 : 0,
    },
    titleSecond: {
      color: colors.textSecondaryColor,
      marginBottom: 14,
    },
    description: {
      color: colors.textSecondaryColor,
    },
  });

  return (
    <BottomWindow windowStyle={[styles.windowStyle, computedStyles.windowStyle]}>
      <View>
        {popupInfo[mode].subTitle && (
          <Text style={[styles.subTitle, computedStyles.subTitle]}>{t(popupInfo[mode].subTitle ?? '')}</Text>
        )}
        <View>
          {popupInfo[mode].title && (
            <Text style={[styles.titleFirst, computedStyles.titleFirst]}>{t(popupInfo[mode].title ?? '')}</Text>
          )}
          {popupInfo[mode].secondTitle && (
            <Text style={[styles.titleSecond, computedStyles.titleSecond]}>{t(popupInfo[mode].secondTitle ?? '')}</Text>
          )}
        </View>
        {popupInfo[mode].description && (
          <Text style={[styles.description, computedStyles.description]}>{t(popupInfo[mode].description ?? '')}</Text>
        )}
      </View>
      {bottomAdditionalContent}
    </BottomWindow>
  );
};

const styles = StyleSheet.create({
  windowStyle: {
    justifyContent: 'space-between',
  },
  subTitle: {
    fontFamily: 'Inter Bold',
    fontSize: 14,
    marginBottom: 14,
    maxWidth: '70%',
  },
  titleFirst: {
    fontFamily: 'Inter Bold',
    fontSize: 34,
  },
  titleSecond: {
    fontFamily: 'Inter Bold',
    fontSize: 34,
  },
  description: {
    fontFamily: 'Inter Medium',
    fontSize: 14,
    maxWidth: '70%',
  },
});

export default UnclosablePopup;
