import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';
import { Button, DatePicker, PhoneInput, Text, TextInput, useTheme } from 'shuttlex-integration';

import { AuthProps } from './props';

const SignUp = ({ onPress }: AuthProps): JSX.Element => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const computedStyles = StyleSheet.create({
    signInLabel: {
      color: colors.primaryColor,
    },
  });

  return (
    <>
      <View style={styles.formSignUpContainer}>
        <TextInput placeholder={t('auth_Auth_SignUp_nameInputPlaceholder')} />
        <TextInput placeholder={t('auth_Auth_SignUp_lastNameInputPlaceholder')} />
        <DatePicker />
        <TextInput placeholder="Email" />
        <PhoneInput />
      </View>

      <View style={styles.buttonsContainer}>
        <Button text={t('auth_Auth_SignUp_createAccountButton')} />
        <Pressable style={styles.alreadyHaveAccountContainer} onPress={onPress} hitSlop={20}>
          <Text style={styles.alreadyHaveAccountText}>
            {t('auth_Auth_SignUp_haveAccount')}{' '}
            <Text style={[styles.signInLabel, computedStyles.signInLabel]}>{t('auth_Auth_SignUp_signInButton')}</Text>
          </Text>
        </Pressable>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  formSignUpContainer: {
    flex: 1,
    gap: 24,
  },
  buttonsContainer: {
    gap: 32,
  },
  alreadyHaveAccountContainer: {
    alignSelf: 'center',
  },
  alreadyHaveAccountText: {
    fontFamily: 'Inter Medium',
  },
  signInLabel: {
    fontFamily: 'Inter Medium',
  },
});

export default SignUp;
