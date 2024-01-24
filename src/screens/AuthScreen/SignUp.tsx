import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';
import { Button, CheckBox, DatePicker, PhoneInput, Text, TextInput, useTheme } from 'shuttlex-integration';

import { AuthProps } from './props';

const SignUp = ({ onPress, navigation }: AuthProps): JSX.Element => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const navigationToSignUpPhoneCodeScreen = () => navigation.navigate('SignUpPhoneCode');

  const [signUpDataCollectionForm, setSignUpDataCollectionForm] = useState({
    firstName: '',
    lastName: '',
    dateBirth: null,
    email: '',
    phoneNumber: '',
    isFamiliarWithTermsAndConditions: true,
    isAllowedProccessPersonalData: true,
  });

  const computedStyles = StyleSheet.create({
    signInLabel: {
      color: colors.primaryColor,
    },
    checkBoxText: {
      color: colors.textSecondaryColor,
    },
  });

  return (
    <>
      <View style={styles.formSignUpContainer}>
        <TextInput
          placeholder={t('auth_Auth_SignUp_nameInputPlaceholder')}
          onChangeText={value =>
            setSignUpDataCollectionForm({
              ...signUpDataCollectionForm,
              firstName: value,
            })
          }
        />
        <TextInput
          placeholder={t('auth_Auth_SignUp_lastNameInputPlaceholder')}
          onChangeText={value =>
            setSignUpDataCollectionForm({
              ...signUpDataCollectionForm,
              lastName: value,
            })
          }
        />
        <DatePicker getDate={() => {}} />
        <TextInput
          placeholder="Email"
          onChangeText={value =>
            setSignUpDataCollectionForm({
              ...signUpDataCollectionForm,
              email: value,
            })
          }
        />
        <PhoneInput getPhoneNumber={() => {}} />

        <CheckBox getCheckValue={() => {}} style={styles.checkBoxContainer} text="I agree with the">
          <Pressable onPress={navigationToSignUpPhoneCodeScreen} hitSlop={20}>
            <Text style={[styles.checkBoxText, computedStyles.checkBoxText]}>Terms & Conditions....</Text>
          </Pressable>
        </CheckBox>

        <CheckBox getCheckValue={() => {}} style={styles.checkBoxContainer} text="I allow to process">
          <Pressable onPress={navigationToSignUpPhoneCodeScreen} hitSlop={20}>
            <Text style={[styles.checkBoxText, computedStyles.checkBoxText]}>my personal data</Text>
          </Pressable>
        </CheckBox>
      </View>

      <View style={styles.buttonsContainer}>
        <Button text={t('auth_Auth_SignUp_createAccountButton')} onPress={navigationToSignUpPhoneCodeScreen} />
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
  checkBoxText: {
    fontSize: 12,
    textDecorationLine: 'underline',
  },
  checkBoxContainer: {
    marginLeft: 20,
  },
});

export default SignUp;
