import React from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, Pressable, SafeAreaView, StyleSheet, View } from 'react-native';
import { Button, GroupedBrandIcon, sizes, Text, useTheme } from 'shuttlex-integration';

import { SplashScreenProps } from './props';

const SplashScreen = ({ navigation }: SplashScreenProps): JSX.Element => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const computedStyles = StyleSheet.create({
    wrapper: {
      backgroundColor: colors.backgroundPrimaryColor,
    },
    container: {
      paddingVertical: Platform.OS === 'android' ? sizes.paddingVertical : 0,
    },
  });

  const navigationToSignUp = () => navigation.navigate('Auth', { state: 'SignUp' });

  const navigationToSignIn = () => navigation.navigate('Auth', { state: 'SignIn' });

  return (
    <SafeAreaView style={[styles.wrapper, computedStyles.wrapper]}>
      <View style={[styles.container, computedStyles.container]}>
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
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: sizes.paddingHorizontal,
  },
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
