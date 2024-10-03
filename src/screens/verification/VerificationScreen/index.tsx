import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import {
  BarModes,
  Button,
  ButtonShapes,
  ButtonSizes,
  CircleButtonModes,
  SafeAreaView,
  ShortArrowIcon,
  SquareButtonModes,
  useTheme,
} from 'shuttlex-integration';

import {
  driversLicenseSelector,
  isAllDocumentsFilledSelector,
  isDriverDocumentsFilledSelector,
  isPersonalDocumentsFilledSelector,
  passportSelector,
  profilePhotoSelector,
  vehicleInsuranceSelector,
  vehicleRegistrationSelector,
} from '../../../core/auth/redux/docs/selectors';
import { contractorZoneSelector, profileSelector } from '../../../core/contractor/redux/selectors';
import { VerificationScreenProps } from './props';
import VerificationHeader from './VerificationHeader';
import VerificationStepBar from './VerificationStepBar';

const VerificationScreen = ({ navigation }: VerificationScreenProps) => {
  const { t } = useTranslation();
  const { colors } = useTheme();

  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  const profile = useSelector(profileSelector);
  const isZoneSelected = useSelector(contractorZoneSelector) !== null;
  const isPresentPersonalDocuments = useSelector(isPersonalDocumentsFilledSelector);
  const isPresentVehicleDocuments = useSelector(isDriverDocumentsFilledSelector);
  const isPresentAllDocuments = useSelector(isAllDocumentsFilledSelector);

  const isVehicleInsurance = Boolean(useSelector(vehicleInsuranceSelector).length);
  const isVehicleRegistration = Boolean(useSelector(vehicleRegistrationSelector).length);

  const isPresentProfile = useSelector(profilePhotoSelector) !== null;
  const isPresentPassport = Boolean(useSelector(passportSelector).length);
  const isPresentDriversLicense = Boolean(useSelector(driversLicenseSelector).length);

  const handlePress = () => {
    if (isZoneSelected && isPresentAllDocuments) {
      navigation.navigate('Ride');
    } else {
      setSelectedSection(null);
    }
  };

  const computedStyles = StyleSheet.create({
    stepBarText: {
      color: isZoneSelected ? colors.textPrimaryColor : colors.textQuadraticColor,
    },
  });

  const defaultState = {
    content: (
      <>
        <VerificationStepBar
          isSelected={isZoneSelected}
          barMode={isZoneSelected ? BarModes.Active : BarModes.Default}
          buttonMode={isZoneSelected ? CircleButtonModes.Mode2 : CircleButtonModes.Mode4}
          onPress={() => navigation.navigate('Zone')}
          text={t('verification_Verification_stepOne')}
        />
        <VerificationStepBar
          isSelected={isPresentPersonalDocuments}
          textStyle={computedStyles.stepBarText}
          barMode={!isZoneSelected ? BarModes.Disabled : BarModes.Default}
          buttonMode={!isZoneSelected ? CircleButtonModes.Mode2 : CircleButtonModes.Mode4}
          onPress={() => setSelectedSection('PersonalDocument')}
          text={t('verification_Verification_stepTwo')}
          isDisabled={!isZoneSelected}
        />

        <VerificationStepBar
          isSelected={isPresentVehicleDocuments}
          textStyle={computedStyles.stepBarText}
          barMode={!isZoneSelected ? BarModes.Disabled : BarModes.Default}
          buttonMode={!isZoneSelected ? CircleButtonModes.Mode2 : CircleButtonModes.Mode4}
          onPress={() => setSelectedSection('VehicleDocument')}
          text={t('verification_Verification_stepThree')}
          isDisabled={!isZoneSelected}
        />
      </>
    ),
    button: (
      <Button
        disabled={!(isZoneSelected && isPresentAllDocuments)}
        text={t('verification_Zone_buttonNext')}
        style={styles.nextButton}
        mode={!(isZoneSelected && isPresentAllDocuments) ? SquareButtonModes.Mode5 : SquareButtonModes.Mode1}
        textStyle={styles.buttonText}
        onPress={handlePress}
      />
    ),
  };

  const vehicleDocument = {
    content: (
      <>
        <VerificationStepBar
          isSelected={isVehicleInsurance}
          barMode={isVehicleInsurance ? BarModes.Active : BarModes.Default}
          buttonMode={CircleButtonModes.Mode4}
          onPress={() => navigation.navigate('VehicleInsurance')}
          text={t('verification_Verification_vehicleDocumentStepOne')}
        />
        <VerificationStepBar
          isSelected={isVehicleRegistration}
          barMode={isVehicleRegistration ? BarModes.Active : BarModes.Default}
          buttonMode={CircleButtonModes.Mode4}
          onPress={() => navigation.navigate('VehicleRegistration')}
          text={t('verification_Verification_vehicleDocumentStepTwo')}
        />
      </>
    ),
    button: (
      <Button
        disabled={!isPresentVehicleDocuments}
        text={t('verification_Zone_buttonNext')}
        style={styles.nextButton}
        mode={!isPresentVehicleDocuments ? SquareButtonModes.Mode5 : SquareButtonModes.Mode1}
        textStyle={styles.buttonText}
        onPress={handlePress}
      />
    ),
  };

  const personalDocument = {
    content: (
      <>
        <VerificationStepBar
          isSelected={isPresentProfile}
          barMode={isPresentProfile ? BarModes.Active : BarModes.Default}
          buttonMode={CircleButtonModes.Mode4}
          onPress={() => navigation.navigate('ProfilePhoto')}
          text={t('verification_Verification_personalDocumentStepOne')}
        />
        <VerificationStepBar
          isSelected={isPresentPassport}
          barMode={isPresentPassport ? BarModes.Active : BarModes.Default}
          buttonMode={CircleButtonModes.Mode4}
          onPress={() => navigation.navigate('Passport')}
          text={t('verification_Verification_personalDocumentStepTwo')}
        />

        <VerificationStepBar
          isSelected={isPresentDriversLicense}
          barMode={isPresentDriversLicense ? BarModes.Active : BarModes.Default}
          buttonMode={CircleButtonModes.Mode4}
          onPress={() => navigation.navigate('DriversLicense')}
          text={t('verification_Verification_personalDocumentStepThree')}
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
        onPress={handlePress}
      />
    ),
  };

  let renderSection;
  let renderButton;

  if (selectedSection == null) {
    renderSection = defaultState.content;
    renderButton = defaultState.button;
  } else if (selectedSection === 'PersonalDocument') {
    renderSection = personalDocument.content;
    renderButton = personalDocument.button;
  } else if (selectedSection === 'VehicleDocument') {
    renderSection = vehicleDocument.content;
    renderButton = vehicleDocument.button;
  }

  //TODO delete name Vladyslav  after connection with backend
  return (
    <SafeAreaView>
      <Button
        onPress={() => setSelectedSection(null)}
        shape={ButtonShapes.Circle}
        mode={CircleButtonModes.Mode2}
        size={ButtonSizes.S}
      >
        <ShortArrowIcon />
      </Button>
      <VerificationHeader
        containerStyle={styles.verificationHeader}
        windowTitle={t('verification_Verification_headerTitle')}
        firstHeaderTitle={t('verification_Verification_explanationTitle')}
        secondHeaderTitle={profile?.name ?? 'Vladyslav'}
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
