import { useTranslation } from 'react-i18next';
import { Platform, SafeAreaView, StyleSheet, View } from 'react-native';
import Video from 'react-native-video';
import { Button, GroupedBrandIconMini, sizes, SquareButtonModes, Text, useTheme } from 'shuttlex-integration';

import { SplashScreenProps } from './props';

const SplashScreen = ({ navigation }: SplashScreenProps): JSX.Element => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const navigationToSignIn = () => navigation.replace('Auth', { state: 'SignIn' });

  const navigationToSignUp = () => navigation.replace('Auth', { state: 'SignUp' });

  const computedStyles = StyleSheet.create({
    container: {
      paddingVertical: Platform.OS === 'android' ? sizes.paddingVertical : 0,
    },
    driverText: {
      color: colors.textSecondaryColor,
    },
    startNowText: {
      color: colors.textTertiaryColor,
    },
    favIconStyle: {
      color: colors.primaryColor,
    },
    favIconInnerStyle: {
      color: colors.iconPrimaryColor,
    },
    textIconStyle: {
      color: colors.backgroundPrimaryColor,
    },
  });

  return (
    <SafeAreaView style={[computedStyles.container, styles.container]}>
      <Video
        source={require('../../../../assets/videos/background_video.mp4')}
        repeat
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />
      <View style={styles.groupedBrandIconContainer}>
        <GroupedBrandIconMini
          favIconColor={computedStyles.favIconStyle.color}
          favIconInnerColor={computedStyles.favIconInnerStyle.color}
          textIconColor={computedStyles.textIconStyle.color}
        />
      </View>
      <View style={styles.titlesContainer}>
        <Text style={[styles.driverText, computedStyles.driverText]}>{t('auth_Splash_title')}</Text>
        <Text style={[styles.startNowText, computedStyles.startNowText]}>{t('auth_Splash_startNow')}</Text>
      </View>
      <View style={styles.buttonsContainer}>
        <Button text={t('auth_Splash_signIn')} onPress={navigationToSignIn} containerStyle={styles.button} />
        <Button
          text={t('auth_Splash_signUp')}
          onPress={navigationToSignUp}
          mode={SquareButtonModes.Mode3}
          containerStyle={styles.button}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  groupedBrandIconContainer: {
    flex: 1,
    alignItems: 'center',
  },
  titlesContainer: {
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  driverText: {
    fontFamily: 'Inter Bold',
    fontSize: 17,
  },
  startNowText: {
    fontFamily: 'Inter Bold',
    fontSize: 52,
    letterSpacing: -1.53,
    width: 248,
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
  },
  button: {
    flex: 1,
  },
});

export default SplashScreen;
