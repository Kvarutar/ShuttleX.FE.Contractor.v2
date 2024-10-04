import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'shuttlex-integration';

import DocsPhotoCore from '../DocsPhotoCore';
import { ProfilePhotoScreenProps } from './props';

const ProfilePhotoScreen = ({ navigation }: ProfilePhotoScreenProps): JSX.Element => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const computedStyles = StyleSheet.create({
    tipText: {
      color: colors.textSecondaryColor,
    },
    dot: {
      backgroundColor: colors.backgroundTertiaryColor,
    },
  });

  const tip = (text: string) => (
    <View style={styles.tip}>
      <View style={[styles.dot, computedStyles.dot]} />
      <Text style={[styles.tipText, computedStyles.tipText]}>{text}</Text>
    </View>
  );

  return (
    <DocsPhotoCore
      photoWidth={374}
      photoHeight={376}
      windowTitle={t('docs_ProfilePhoto_headerTitle')}
      firstHeaderTitle={t('docs_ProfilePhoto_explanationFirstTitle')}
      secondHeaderTitle={t('docs_ProfilePhoto_explanationSecondTitle')}
      headerDescription={t('docs_ProfilePhoto_explanationDescription')}
      goBack={navigation.goBack}
      documentType="profilePhoto"
    >
      <View style={styles.tips}>
        {tip(t('docs_ProfilePhoto_tip1'))}
        {tip(t('docs_ProfilePhoto_tip2'))}
        {tip(t('docs_ProfilePhoto_tip3'))}
      </View>
    </DocsPhotoCore>
  );
};

const styles = StyleSheet.create({
  tips: {
    gap: 8,
    paddingVertical: 16,
  },
  tip: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  tipText: {
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: -0.56,
  },
});

export default ProfilePhotoScreen;
