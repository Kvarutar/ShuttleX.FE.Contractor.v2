import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import Video from 'react-native-video';
import {
  Button,
  GroupedBrandIconMini,
  SafeAreaView,
  sizes,
  SquareButtonModes,
  Text,
  useTheme,
} from 'shuttlex-integration';

import { SplashScreenProps } from './props';

const SplashScreen = ({ navigation }: SplashScreenProps): JSX.Element => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const navigationToSignIn = () => navigation.replace('Auth', { state: 'SignIn' });

  const navigationToSignUp = () => navigation.replace('Auth', { state: 'SignUp' });

  const computedStyles = StyleSheet.create({
    driverText: {
      color: colors.textTitleColor,
    },
    startNowText: {
      color: colors.textTertiaryColor,
    },
    textIconStyle: {
      color: colors.backgroundPrimaryColor,
    },
  });

  return (
    <>
      <Video
        source={require('../../../../assets/videos/background_video.mp4')}
        repeat
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />
      <SafeAreaView withTransparentBackground containerStyle={styles.container}>
        <View style={styles.groupedBrandIconContainer}>
          <GroupedBrandIconMini textIconColor={computedStyles.textIconStyle.color} isContractorIcon />
        </View>
        <View style={styles.titlesContainer}>
          <Text style={[styles.driverText, computedStyles.driverText]}>{t('auth_Splash_title')}</Text>
          <Text style={[styles.startNowText, computedStyles.startNowText]}>{t('auth_Splash_startNow')}</Text>
        </View>
        <View style={styles.buttonsContainer}>
          <Button text={t('auth_Splash_signIn')} onPress={navigationToSignIn} containerStyle={styles.buttonContainer} />
          <Button
            text={t('auth_Splash_signUp')}
            onPress={navigationToSignUp}
            mode={SquareButtonModes.Mode3}
            containerStyle={styles.buttonContainer}
            style={styles.button}
          />
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 0,
  },
  groupedBrandIconContainer: {
    flex: 1,
    alignItems: 'center',
  },
  titlesContainer: {
    marginBottom: 32,
    paddingHorizontal: sizes.paddingHorizontal,
  },
  driverText: {
    fontFamily: 'Inter Bold',
    fontSize: 17,
    lineHeight: 17,
    marginBottom: 14,
  },
  startNowText: {
    fontFamily: 'Inter Bold',
    fontSize: 52,
    letterSpacing: -1.53,
    lineHeight: 52,
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
  },
  buttonContainer: {
    flex: 1,
  },
  button: {
    paddingHorizontal: 8,
  },
});

export default SplashScreen;
