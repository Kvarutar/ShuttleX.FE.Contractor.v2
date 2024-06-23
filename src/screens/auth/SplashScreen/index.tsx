import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';
import { Button, GroupedBrandIcon, SafeAreaView, Text } from 'shuttlex-integration';

import { SplashScreenProps } from './props';

const SplashScreen = ({ navigation }: SplashScreenProps): JSX.Element => {
  const { t } = useTranslation();

  const navigationToSignUp = () => navigation.replace('Auth', { state: 'SignUp' });

  const navigationToSignIn = () => navigation.replace('Auth', { state: 'SignIn' });

  return (
    <SafeAreaView>
      <View style={styles.groupedBrandIconContainer}>
        <GroupedBrandIcon />
        <Text style={styles.titleApp}>{t('auth_Splash_title')}</Text>
      </View>
      <View style={styles.buttonsContainer}>
        <Button text={t('auth_Splash_startButton')} onPress={navigationToSignUp} />
        <Pressable style={styles.alreadyHaveAccountContainer} onPress={navigationToSignIn} hitSlop={20}>
          <Text style={styles.alreadyHaveAccountText}>{t('auth_Splash_haveAccount')}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  groupedBrandIconContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 32,
  },
  buttonsContainer: {
    gap: 28,
  },
  alreadyHaveAccountContainer: {
    alignSelf: 'center',
  },
  alreadyHaveAccountText: {
    fontFamily: 'Inter Medium',
  },
  titleApp: {
    textTransform: 'uppercase',
    fontFamily: 'Inter SemiBold',
  },
});

export default SplashScreen;
