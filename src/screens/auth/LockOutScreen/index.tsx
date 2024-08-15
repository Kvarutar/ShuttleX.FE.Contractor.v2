import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Button, SafeAreaView, Text } from 'shuttlex-integration';

import { LockOutScreenProps } from './props';

const LockOutScreen = ({ navigation }: LockOutScreenProps): JSX.Element => {
  const { t } = useTranslation();

  const handleContactSupport = () => {
    //TODO: send user to support
    console.log('Contact support');
  };
  const handleRequestCodeAgain = () => {
    //TODO: send request to backend
    navigation.goBack();
  };

  return (
    <SafeAreaView>
      <View style={styles.header}>
        <View style={styles.headerDummy} />
        <Text style={[styles.headerTitle]}>{t('auth_LockOut_headerTitle')}</Text>
        <View style={styles.headerDummy} />
      </View>

      <Text style={[styles.codeText]}>{t('auth_LockOut_prompt')}</Text>

      <View style={styles.buttonsContainer}>
        <Button text={t('auth_LockOut_support_button')} onPress={handleContactSupport} />
        <Button text={t('auth_LockOut_request_button')} onPress={handleRequestCodeAgain} />
      </View>
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
  headerDummy: {
    width: 50,
  },
  buttonsContainer: {
    marginTop: 30,
    gap: 24,
  },
});

export default LockOutScreen;
