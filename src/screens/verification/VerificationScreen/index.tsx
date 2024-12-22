import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import {
  BarModes,
  Button,
  ButtonShapes,
  ButtonSizes,
  CircleButtonModes,
  Nullable,
  SafeAreaView,
  ShortArrowIcon,
  SquareButtonModes,
  useTheme,
} from 'shuttlex-integration';

import {
  docsPaymentDataSelector,
  docsTemplatesSelector,
  isDocsLoadingSelector,
  profilePhotoSelector,
  selectedZoneSelector,
  zonesSelector,
} from '../../../core/auth/redux/docs/selectors';
import { fetchAllZone, verifyDocs } from '../../../core/auth/redux/docs/thunks';
import { DocsType, DocTemplate } from '../../../core/auth/redux/docs/types';
import { getDocTitlesByFeKey } from '../../../core/auth/redux/docs/utils/docsFeKey';
import { contractorInfoSelector } from '../../../core/contractor/redux/selectors';
import { getContractorInfo } from '../../../core/contractor/redux/thunks';
import { useAppDispatch } from '../../../core/redux/hooks';
import { RootStackParamList } from '../../../Navigate/props';
import VerificationHeader from './VerificationHeader';
import VerificationStepBar from './VerificationStepBar';

const VerificationScreen = (): JSX.Element => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Verification'>>();

  const { colors } = useTheme();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const isDocsLoading = useSelector(isDocsLoadingSelector);

  const contractorInfo = useSelector(contractorInfoSelector);
  const zones = useSelector(zonesSelector);
  const docsTemplates = useSelector(docsTemplatesSelector);
  const isZoneSelected = useSelector(selectedZoneSelector) !== null;
  const isProfilePhotoSelected = useSelector(profilePhotoSelector) !== null;
  const isPaymentData = useSelector(docsPaymentDataSelector) !== null;

  const [selectedSection, setSelectedSection] = useState<Nullable<DocsType>>(null);

  useEffect(() => {
    if (zones.length === 0) {
      dispatch(fetchAllZone());
    }
  }, [dispatch, zones.length]);

  const getTemplatesByDocsType = (type: DocsType) => docsTemplates.filter(template => template.type === type);
  const isFilledTemplates = (templates: DocTemplate[]) =>
    templates.length > 0 && templates.every(template => template.isFilled);

  const getStyleForText = (isSelected: boolean | undefined) => ({
    color: isSelected ? colors.textPrimaryColor : colors.textQuadraticColor,
  });

  const isPresentPersonalDocuments =
    isFilledTemplates(getTemplatesByDocsType(DocsType.Personal)) && isProfilePhotoSelected && isPaymentData;
  const isPresentVehicleDocuments = isFilledTemplates(getTemplatesByDocsType(DocsType.Vehicle));

  const handleNextPress = () => {
    if (isZoneSelected && isPresentPersonalDocuments && isPresentVehicleDocuments) {
      dispatch(verifyDocs());
      dispatch(getContractorInfo());

      navigation.navigate('Ride');
    } else {
      setSelectedSection(null);
    }
  };

  const handleBackPress = () => {
    if (selectedSection) {
      setSelectedSection(null);
    } else {
      navigation.navigate('Splash');
    }
  };

  const renderStepForDocTemplate = (template: DocTemplate) => {
    const { id, isFilled, feKey } = template;

    if (!feKey) {
      return <></>;
    }

    const { title } = getDocTitlesByFeKey[feKey];

    return (
      <VerificationStepBar
        key={id}
        isSelected={isFilled}
        barMode={isFilled ? BarModes.Active : BarModes.Default}
        buttonMode={CircleButtonModes.Mode4}
        onPress={() => navigation.navigate('DocMedia', { feKey: feKey, templateId: id })}
        text={t(title)}
        textStyle={getStyleForText(isFilled)}
      />
    );
  };

  const defaultState = {
    content: (
      <>
        <VerificationStepBar
          isSelected={isZoneSelected}
          barMode={isZoneSelected ? BarModes.Active : BarModes.Default}
          buttonMode={isZoneSelected ? CircleButtonModes.Mode2 : CircleButtonModes.Mode4}
          onPress={() => navigation.navigate('Zone')}
          text={t('verification_Verification_selectZone')}
          textStyle={getStyleForText(isZoneSelected)}
          isLoading={isDocsLoading.docsTemplates}
        />
        <VerificationStepBar
          isSelected={isPresentPersonalDocuments}
          barMode={
            isPresentPersonalDocuments ? BarModes.Active : !isZoneSelected ? BarModes.Disabled : BarModes.Default
          }
          buttonMode={!isZoneSelected ? CircleButtonModes.Mode2 : CircleButtonModes.Mode4}
          onPress={() => setSelectedSection(DocsType.Personal)}
          text={t('verification_Verification_personalDocs')}
          textStyle={getStyleForText(isPresentPersonalDocuments)}
          isDisabled={!isZoneSelected}
        />
        <VerificationStepBar
          isSelected={isPresentVehicleDocuments}
          barMode={isPresentVehicleDocuments ? BarModes.Active : !isZoneSelected ? BarModes.Disabled : BarModes.Default}
          buttonMode={!isZoneSelected ? CircleButtonModes.Mode2 : CircleButtonModes.Mode4}
          onPress={() => setSelectedSection(DocsType.Vehicle)}
          text={t('verification_Verification_vehicleDocs')}
          textStyle={getStyleForText(isPresentVehicleDocuments)}
          isDisabled={!isZoneSelected}
        />
      </>
    ),
    button: (
      <Button
        disabled={!(isZoneSelected && isFilledTemplates(docsTemplates))}
        text={t('verification_Zone_buttonNext')}
        style={styles.nextButton}
        mode={isZoneSelected && isFilledTemplates(docsTemplates) ? SquareButtonModes.Mode1 : SquareButtonModes.Mode5}
        textStyle={styles.buttonText}
        onPress={handleNextPress}
      />
    ),
  };

  const vehicleDocument = {
    content: <>{getTemplatesByDocsType(DocsType.Vehicle).map(renderStepForDocTemplate)}</>,
    button: (
      <Button
        disabled={!isPresentVehicleDocuments}
        text={t('verification_Zone_buttonNext')}
        style={styles.nextButton}
        mode={!isPresentVehicleDocuments ? SquareButtonModes.Mode5 : SquareButtonModes.Mode1}
        textStyle={styles.buttonText}
        onPress={handleNextPress}
      />
    ),
  };

  const personalDocumentsSection = {
    content: (
      <>
        <VerificationStepBar
          isSelected={isProfilePhotoSelected}
          barMode={isProfilePhotoSelected ? BarModes.Active : BarModes.Default}
          buttonMode={CircleButtonModes.Mode4}
          onPress={() => navigation.navigate('ProfilePhoto')}
          text={t('verification_Verification_profilePhoto')}
          textStyle={getStyleForText(isProfilePhotoSelected)}
        />

        {getTemplatesByDocsType(DocsType.Personal).map(renderStepForDocTemplate)}

        <VerificationStepBar
          isSelected={isPaymentData}
          barMode={isPaymentData ? BarModes.Active : BarModes.Default}
          buttonMode={CircleButtonModes.Mode4}
          onPress={() => navigation.navigate('PaymentDoc')}
          text={t('verification_Verification_paymentData')}
          textStyle={getStyleForText(isPaymentData)}
          isLoading={isDocsLoading.paymentData}
        />
      </>
    ),
    button: (
      <Button
        disabled={!isPresentPersonalDocuments}
        text={t('verification_Zone_buttonNext')}
        style={styles.nextButton}
        mode={!isPresentPersonalDocuments ? SquareButtonModes.Mode5 : SquareButtonModes.Mode1}
        textStyle={styles.buttonText}
        onPress={handleNextPress}
      />
    ),
  };

  let renderSection;
  let renderButton;

  if (selectedSection == null) {
    renderSection = defaultState.content;
    renderButton = defaultState.button;
  } else if (selectedSection === DocsType.Personal) {
    renderSection = personalDocumentsSection.content;
    renderButton = personalDocumentsSection.button;
  } else if (selectedSection === DocsType.Vehicle) {
    renderSection = vehicleDocument.content;
    renderButton = vehicleDocument.button;
  }

  return (
    <SafeAreaView>
      <Button onPress={handleBackPress} shape={ButtonShapes.Circle} mode={CircleButtonModes.Mode2} size={ButtonSizes.S}>
        <ShortArrowIcon />
      </Button>
      <VerificationHeader
        containerStyle={styles.verificationHeader}
        windowTitle={t('verification_Verification_headerTitle')}
        firstHeaderTitle={t('verification_Verification_explanationTitle')}
        secondHeaderTitle={contractorInfo?.name ?? ''}
        description={t('verification_Verification_explanationDescription')}
      />
      <View style={styles.content}>{renderSection}</View>
      {renderButton}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  verificationHeader: {
    marginTop: 18,
  },
  content: {
    flex: 1,
    marginTop: 32,
    gap: 8,
  },
  nextButton: {
    marginTop: 8,
  },
  buttonText: {
    fontSize: 17,
  },
});

export default VerificationScreen;
