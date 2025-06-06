import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { FileInfo, MediaAmount, MediaCore, Text, useTheme } from 'shuttlex-integration';

import { saveProfilePhoto } from '../../../core/auth/redux/docs/thunks';
import { getContractorInfo } from '../../../core/contractor/redux/thunks';
import { useAppDispatch } from '../../../core/redux/hooks';
import { RootStackParamList } from '../../../Navigate/props';

const ProfilePhotoScreen = (): JSX.Element => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'ProfilePhoto'>>();

  const { colors } = useTheme();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

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

  const onSaveFiles = async (files: FileInfo[]) => {
    await dispatch(saveProfilePhoto({ file: files[0] }));
    dispatch(getContractorInfo());
  };

  return (
    <MediaCore
      windowTitle={t('docs_ProfilePhoto_headerTitle')}
      firstHeaderTitle={t('docs_ProfilePhoto_explanationFirstTitle')}
      secondHeaderTitle={t('docs_ProfilePhoto_explanationSecondTitle')}
      headerDescription={t('docs_ProfilePhoto_explanationDescription')}
      goBack={navigation.goBack}
      mediaAmount={MediaAmount.Single}
      cropperCircleOverlay
      onSaveFiles={onSaveFiles}
    >
      <View style={styles.tips}>
        {tip(t('docs_ProfilePhoto_tip1'))}
        {tip(t('docs_ProfilePhoto_tip2'))}
        {tip(t('docs_ProfilePhoto_tip3'))}
      </View>
    </MediaCore>
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
