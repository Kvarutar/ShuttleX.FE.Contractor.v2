import { useTranslation } from 'react-i18next';
import { ListRenderItem, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import {
  Bar,
  BarModes,
  Button,
  ButtonShapes,
  ButtonSizes,
  CircleButtonModes,
  FlatListWithCustomScroll,
  RoundCheckIcon2,
  SafeAreaView,
  ShortArrowIcon,
  SquareButtonModes,
  Text,
  useTheme,
  WarningIcon,
} from 'shuttlex-integration';

import {
  isAllDocumentsFilledSelector,
  requirementDocumentsListSelector,
} from '../../../core/auth/redux/docs/selectors';
import { DocsState, RequirementDocs, RequirementDocsType } from '../../../core/auth/redux/docs/types';
import { profileSelector } from '../../../core/contractor/redux/selectors';
import VerificationHeader from '../../verification/VerificationScreen/VerificationHeader';
import { DocsScreenProps } from './types';

//TODO add logic for get docs status from backend
const DocsScreen = ({ navigation }: DocsScreenProps): JSX.Element => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const profile = useSelector(profileSelector);
  const isPresentAllDocuments = useSelector(isAllDocumentsFilledSelector);
  const requirementDocumentsList = useSelector(requirementDocumentsListSelector);

  const screensContent: Record<RequirementDocsType, { navFunc: () => void; title: string }> = {
    profilePhoto: {
      navFunc: () => navigation.navigate('ProfilePhoto'),
      title: t('docs_Docs_profilePhoto'),
    },
    passport: {
      navFunc: () => navigation.navigate('Passport'),
      title: t('docs_Docs_passport'),
    },
    driversLicense: {
      navFunc: () => navigation.navigate('DriversLicense'),
      title: t('docs_Docs_driversLicense'),
    },
    vehicleInsurance: {
      navFunc: () => navigation.navigate('VehicleInsurance'),
      title: t('docs_Docs_vehicleInsurance'),
    },
    vehicleRegistration: {
      navFunc: () => navigation.navigate('VehicleRegistration'),
      title: t('docs_Docs_vehicleRegistration'),
    },
  };

  const computedStyles = StyleSheet.create({
    textStyle: {
      color: colors.textPrimaryColor,
    },
  });

  const renderItem: ListRenderItem<[RequirementDocsType, RequirementDocs]> = ({ item }) => {
    const isComplete = Array.isArray(item[1]) ? item[1].length > 0 : item[0] !== null;
    return (
      <Bar style={styles.bar} mode={BarModes.Active} onPress={() => !isComplete && screensContent[item[0]].navFunc()}>
        <Text style={[styles.contentText, computedStyles.textStyle]}>{screensContent[item[0]].title}</Text>
        {isComplete ? <RoundCheckIcon2 style={styles.roundButton} /> : <WarningIcon style={styles.roundButton} />}
      </Bar>
    );
  };

  return (
    <SafeAreaView>
      <Button
        onPress={navigation.goBack}
        shape={ButtonShapes.Circle}
        mode={CircleButtonModes.Mode2}
        size={ButtonSizes.S}
      >
        <ShortArrowIcon />
      </Button>
      <VerificationHeader
        containerStyle={styles.verificationHeader}
        windowTitle={t('docs_Docs_headerTitle')}
        firstHeaderTitle={t('docs_Docs_explanationTitle')}
        secondHeaderTitle={profile?.fullName ?? ''}
      />

      <FlatListWithCustomScroll
        items={Object.entries(requirementDocumentsList) as [keyof DocsState, RequirementDocs][]}
        renderItem={renderItem}
        wrapperStyle={styles.documentsWrapper}
        contentContainerStyle={styles.flatListContainer}
        withShadow
      />

      <Button
        disabled={!isPresentAllDocuments}
        text={t('docs_Docs_buttonNext')}
        style={styles.nextButton}
        mode={!isPresentAllDocuments ? SquareButtonModes.Mode5 : SquareButtonModes.Mode1}
        textStyle={styles.buttonText}
        onPress={navigation.goBack}
      />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  verificationHeader: {
    marginTop: 18,
  },
  roundButton: {
    height: 32,
    width: 32,
  },
  bar: {
    height: 64,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  contentText: {
    fontFamily: 'Inter Medium',
  },
  documentsWrapper: {
    marginTop: 12,
  },
  flatListContainer: {
    gap: 16,
  },
  nextButton: {
    marginTop: 8,
  },
  buttonText: {
    fontSize: 17,
  },
});
export default DocsScreen;
