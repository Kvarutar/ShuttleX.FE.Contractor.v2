import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Button, CodeInput, RoundButton, SafeAreaView, ShortArrowIcon, Text } from 'shuttlex-integration';

import { setProfile } from '../../../core/contractor/redux';
import { useAppDispatch } from '../../../core/redux/hooks';
import { SignUpPhoneCodeScreenProps } from './props';

const SignUpPhoneCodeScreen = ({ navigation, route }: SignUpPhoneCodeScreenProps): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const { profile } = route.params;

  const onPress = () => {
    //TODO: send profile to backend
    dispatch(setProfile(profile));
    navigation.replace('Verification');
  };

  return (
    <SafeAreaView>
      <View style={styles.header}>
        <RoundButton onPress={navigation.goBack}>
          <ShortArrowIcon />
        </RoundButton>
        <Text style={[styles.headerTitle]}>{t('auth_SignUpPhoneCode_headerTitle')}</Text>
        <View style={styles.headerDummy} />
      </View>

      <Text style={[styles.codeText]}>{t('auth_SignUpPhoneCode_prompt')}</Text>

      <CodeInput style={styles.codeInput} onCodeChange={() => {}} />

      <Button text={t('auth_SignUpPhoneCode_button')} onPress={onPress} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Inter Medium',
    fontSize: 18,
  },
  codeText: {
    fontSize: 18,
    lineHeight: 24,
    fontFamily: 'Inter Medium',
    marginTop: 64,
  },
  codeInput: {
    flex: 1,
    gap: 30,
    marginTop: 50,
    alignSelf: 'center',
  },
  signUpLabel: {
    fontFamily: 'Inter Medium',
  },
  headerDummy: {
    width: 50,
  },
});

export default SignUpPhoneCodeScreen;
