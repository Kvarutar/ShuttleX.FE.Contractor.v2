import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import {
  Bar,
  Button,
  CreditCheckIcon,
  LockIcon,
  RoundButton,
  ShortArrowIcon,
  sizes,
  Text,
  TextInput,
  TextInputInputMode,
  useTheme,
} from 'shuttlex-integration';

import { updateRequirementDocuments } from '../../../core/auth/redux/docs';
import { RequirementDocsType } from '../../../core/auth/redux/docs/types';
import { useAppDispatch } from '../../../core/redux/hooks';
import { BackgroundCheckScreenProps } from './props';

const BackgroundCheckScreen = ({ navigation }: BackgroundCheckScreenProps): JSX.Element => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const [ssn, setSsn] = useState<string>('');

  const computedStyles = StyleSheet.create({
    container: {
      backgroundColor: colors.backgroundPrimaryColor,
    },
    description: {
      color: colors.textSecondaryColor,
    },
  });

  const onAgree = () => {
    if (ssn) {
      dispatch(
        updateRequirementDocuments({
          type: RequirementDocsType.BackgroundCheck,
          body: ssn.replace(/[^+\d]/g, ''),
        }),
      );

      navigation.goBack();
    }
  };

  const onChange = (text: string) => {
    setSsn(text.replace(/^(\d{3})(\d{2})(\d{0,6})/, '$1-$2-$3').replace(/-+(?=-)/, ''));
  };

  return (
    <SafeAreaView style={[styles.container, computedStyles.container]}>
      <View>
        <View style={[styles.header]}>
          <RoundButton onPress={() => navigation.goBack()}>
            <ShortArrowIcon />
          </RoundButton>
          <Text style={[styles.headerTitle]}>{t('docs_BackgroundCheck_headerTitle')}</Text>
          <View style={styles.headerDummy} />
        </View>
        <Bar>
          <Text style={styles.title}>{t('docs_BackgroundCheck_explanationTitle')}</Text>
          <Text style={[styles.description, computedStyles.description]}>
            {t('docs_BackgroundCheck_explanationDescription')}
          </Text>
        </Bar>
        <View style={styles.wrapper}>
          <Text style={styles.blockTitle}>{t('docs_BackgroundCheck_blockTitle')}</Text>
          <TextInput
            maxLength={11}
            inputMode={TextInputInputMode.Numeric}
            value={ssn}
            placeholder="000-00-0000"
            onChangeText={onChange}
          />
          <View style={styles.agreements}>
            <View style={styles.agreementsItem}>
              <LockIcon />
              <Text style={styles.agreementsDescription}>{t('docs_BackgroundCheck_agreement1')}</Text>
            </View>
            <View style={styles.agreementsItem}>
              <CreditCheckIcon />
              <Text style={styles.agreementsDescription}>{t('docs_BackgroundCheck_agreement2')}</Text>
            </View>
          </View>
        </View>
      </View>
      {ssn !== '' && <Button text={t('docs_BackgroundCheck_agreeButton')} onPress={onAgree} />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: sizes.paddingHorizontal,
    paddingVertical: sizes.paddingVertical,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  headerTitle: {
    fontFamily: 'Inter Medium',
    fontSize: 18,
  },
  headerDummy: {
    width: 50,
  },
  title: {
    fontFamily: 'Inter Medium',
    marginBottom: 8,
  },
  blockTitle: {
    fontFamily: 'Inter Medium',
    fontSize: 18,
    marginBottom: 16,
  },
  wrapper: {
    marginTop: 40,
  },
  agreements: {
    marginTop: 32,
    gap: 24,
  },
  agreementsItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  agreementsDescription: {
    fontSize: 14,
    lineHeight: 20,
    flexShrink: 1,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default BackgroundCheckScreen;
