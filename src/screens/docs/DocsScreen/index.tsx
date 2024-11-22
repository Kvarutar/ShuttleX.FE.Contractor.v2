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

import { DocsState } from '../../../core/auth/redux/docs/types';
import { contractorInfoSelector } from '../../../core/contractor/redux/selectors';
import VerificationHeader from '../../verification/VerificationScreen/VerificationHeader';
import { DocsScreenProps } from './types';

//TODO add logic for get docs status from backend
const DocsScreen = ({ navigation }: DocsScreenProps): JSX.Element => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  //TODO add logic for get docs status from backend, now MOCK!
  const contractorInfo = useSelector(contractorInfoSelector);
  const isPresentAllDocuments = true;
  const requirementDocumentsList = true;

  const screensContent: Record<string, { navFunc: () => void; title: string }> = {
    templates: {
      navFunc: () => ({}),
      title: t('docs_Docs_profilePhoto'),
    },
    profilePhoto: {
      navFunc: () => navigation.navigate('ProfilePhoto'),
      title: t('docs_Docs_profilePhoto'),
    },
    passport: {
      navFunc: () => {},
      title: t('docs_Docs_passport'),
    },
    driversLicense: {
      navFunc: () => {},
      title: t('docs_Docs_driversLicense'),
    },
    vehicleInsurance: {
      navFunc: () => {},
      title: t('docs_Docs_vehicleInsurance'),
    },
    vehicleRegistration: {
      navFunc: () => {},
      title: t('docs_Docs_vehicleRegistration'),
    },
  };

  const computedStyles = StyleSheet.create({
    textStyle: {
      color: colors.textPrimaryColor,
    },
  });

  const renderItem: ListRenderItem<[string, string]> = ({ item }) => {
    const isComplete = Array.isArray(item[1]) ? item[1].length > 0 : item[1] !== null;
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
        secondHeaderTitle={contractorInfo?.name ?? ''}
      />

      <FlatListWithCustomScroll
        items={Object.entries(requirementDocumentsList) as [keyof DocsState, string][]}
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
