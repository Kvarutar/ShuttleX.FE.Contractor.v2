import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'shuttlex-integration';

import { RequirementDocsType } from '../../../core/auth/redux/docs/types';
import DocsPhotoCore from '../DocsPhotoCore';
import { ProfilePhotoScreenProps } from './props';

const ProfilePhotoScreen = ({ navigation }: ProfilePhotoScreenProps): JSX.Element => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const computedStyles = StyleSheet.create({
    description: {
      color: colors.textSecondaryColor,
    },
  });

  return (
    <DocsPhotoCore
      imageWidth={374}
      imageHeight={376}
      headerTitle={t('docs_ProfilePhoto_headerTitle')}
      explanationTitle={t('docs_ProfilePhoto_explanationTitle')}
      explanationDescription={t('docs_ProfilePhoto_explanationDescription')}
      goBack={navigation.goBack}
      documentType={RequirementDocsType.ProfilePhoto}
    >
      <View style={styles.tips}>
        <Text style={[styles.description, computedStyles.description]}>{t('docs_ProfilePhoto_tip1')}</Text>
        <Text style={[styles.description, computedStyles.description]}>{t('docs_ProfilePhoto_tip2')}</Text>
        <Text style={[styles.description, computedStyles.description]}>{t('docs_ProfilePhoto_tip3')}</Text>
      </View>
    </DocsPhotoCore>
  );
};

const styles = StyleSheet.create({
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
  tips: {
    gap: 8,
    marginTop: 24,
    marginBottom: 44,
  },
});

export default ProfilePhotoScreen;
