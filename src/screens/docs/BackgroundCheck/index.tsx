import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import {
  Bar,
  ButtonV1,
  ButtonV1Shapes,
  CreditCheckIcon,
  LockIcon,
  SafeAreaView,
  ScrollViewWithCustomScroll,
  ShortArrowIcon,
  Text,
  TextInput,
  TextInputInputMode,
  useThemeV1,
} from 'shuttlex-integration';

import { updateRequirementDocuments } from '../../../core/auth/redux/docs';
import { RequirementDocsType } from '../../../core/auth/redux/docs/types';
import { useAppDispatch } from '../../../core/redux/hooks';
import { BackgroundCheckScreenProps } from './props';

const BackgroundCheckScreen = ({ navigation }: BackgroundCheckScreenProps): JSX.Element => {
  const { colors } = useThemeV1();
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
    <SafeAreaView containerStyle={styles.container}>
      <View style={styles.wrapper}>
        <View style={[styles.header]}>
          <ButtonV1 onPress={navigation.goBack} shape={ButtonV1Shapes.Circle}>
            <ShortArrowIcon />
          </ButtonV1>
          <Text style={[styles.headerTitle]}>{t('docs_BackgroundCheck_headerTitle')}</Text>
          <View style={styles.headerDummy} />
        </View>
        <ScrollViewWithCustomScroll withShadow>
          <Bar>
            <Text style={styles.title}>{t('docs_BackgroundCheck_explanationTitle')}</Text>
            <Text style={[styles.description, computedStyles.description]}>
              {t('docs_BackgroundCheck_explanationDescription')}
            </Text>
          </Bar>
          <View style={styles.contentWrapper}>
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
        </ScrollViewWithCustomScroll>
        {ssn !== '' && (
          <ButtonV1 text={t('docs_BackgroundCheck_agreeButton')} onPress={onAgree} style={styles.button} />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
  },
  wrapper: {
    flex: 1,
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
  contentWrapper: {
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
  button: {
    marginTop: 20,
  },
});

export default BackgroundCheckScreen;
