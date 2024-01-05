import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';
import { Button, PhoneInput, Text, TextInput, useTheme } from 'shuttlex-integration';

import { AuthProps } from './props';

const SignIn = ({ onPress, navigation }: AuthProps): JSX.Element => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const navigationToSignInPhoneCodeScreen = () => navigation.navigate('SignInPhoneCode');

  const computedStyles = StyleSheet.create({
    signUpLabel: {
      color: colors.primaryColor,
    },
    dividerInputsLabel: {
      color: colors.textSecondaryColor,
    },
  });

  return (
    <>
      <View style={styles.phoneNumberContainer}>
        <Text style={styles.title}>{t('auth_Auth_SignIn_title')}</Text>
        <PhoneInput />
        <Text style={[styles.dividerInputsLabel, computedStyles.dividerInputsLabel]}>
          {t('auth_Auth_SignIn_signViaEmail')}
        </Text>
        <TextInput placeholder="Email" />
      </View>

      <View style={styles.bottomButtonsContainer}>
        <Button text={t('auth_Auth_SignIn_nextButton')} onPress={navigationToSignInPhoneCodeScreen} />
        <Pressable style={styles.dontHaveAccountContainer} onPress={onPress} hitSlop={20}>
          <Text style={styles.dontHaveAccountText}>
            {t('auth_Auth_SignIn_dontHaveAccount')}{' '}
            <Text style={[styles.signUpLabel, computedStyles.signUpLabel]}>{t('auth_Auth_SignIn_signUpButton')}</Text>
          </Text>
        </Pressable>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  phoneNumberContainer: {
    flex: 1,
    gap: 30,
  },
  title: {
    fontSize: 18,
    lineHeight: 24,
    fontFamily: 'Inter Medium',
  },
  dividerInputsLabel: {
    fontSize: 12,
    fontFamily: 'Inter Medium',
    alignSelf: 'center',
  },
  bottomButtonsContainer: {
    gap: 32,
  },
  dontHaveAccountContainer: {
    alignSelf: 'center',
  },
  dontHaveAccountText: {
    fontFamily: 'Inter Medium',
  },
  signUpLabel: {
    fontFamily: 'Inter Medium',
  },
});

export default SignIn;
