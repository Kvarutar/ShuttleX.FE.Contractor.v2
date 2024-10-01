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
  useTheme,
} from 'shuttlex-integration';

import {
  driversLicenseSelector,
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

  const isVehicleInsurance = useSelector(vehicleInsuranceSelector) !== null;
  const isVehicleRegistration = useSelector(vehicleRegistrationSelector) !== null;

  const isPresentProfile = useSelector(profilePhotoSelector) !== null;
  const isPresentPassport = useSelector(passportSelector) !== null;
  const isPresentDriversLicense = useSelector(driversLicenseSelector) !== null;

  const computedStyles = StyleSheet.create({
    stepBarText: {
      color: isZoneSelected ? colors.textPrimaryColor : colors.textQuadraticColor,
    },
  });

  const onBackButtonPress = () => {
    if (selectedSection !== null) {
      setSelectedSection(null);
    }
  };

  const defaultState = (
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
  );

  const vehicleDocument = (
    <>
      <VerificationStepBar
        isSelected={isVehicleInsurance}
        barMode={isVehicleInsurance ? BarModes.Active : BarModes.Default}
        buttonMode={CircleButtonModes.Mode2}
        onPress={() => navigation.navigate('VehicleInsurance')}
        text={t('verification_Verification_vehicleDocumentStepOne')}
      />
      <VerificationStepBar
        isSelected={isVehicleRegistration}
        barMode={isVehicleRegistration ? BarModes.Active : BarModes.Default}
        buttonMode={CircleButtonModes.Mode2}
        onPress={() => navigation.navigate('VehicleRegistration')}
        text={t('verification_Verification_vehicleDocumentStepTwo')}
      />
    </>
  );

  const personalDocument = (
    <>
      <VerificationStepBar
        isSelected={isPresentProfile}
        barMode={isPresentProfile ? BarModes.Active : BarModes.Default}
        buttonMode={CircleButtonModes.Mode2}
        onPress={() => navigation.navigate('ProfilePhoto')}
        text={t('verification_Verification_personalDocumentStepOne')}
      />

      <VerificationStepBar
        isSelected={isPresentPassport}
        barMode={isPresentPassport ? BarModes.Active : BarModes.Default}
        buttonMode={CircleButtonModes.Mode2}
        onPress={() => navigation.navigate('VehicleInsurance')}
        text={t('verification_Verification_personalDocumentStepTwo')}
      />

      <VerificationStepBar
        isSelected={isPresentDriversLicense}
        barMode={isPresentDriversLicense ? BarModes.Active : BarModes.Default}
        buttonMode={CircleButtonModes.Mode2}
        onPress={() => navigation.navigate('DriversLicense')}
        text={t('verification_Verification_personalDocumentStepThree')}
      />
    </>
  );

  let renderSection;

  if (selectedSection == null) {
    renderSection = defaultState;
  } else if (selectedSection === 'PersonalDocument') {
    renderSection = personalDocument;
  } else if (selectedSection === 'VehicleDocument') {
    renderSection = vehicleDocument;
  }

  //TODO delete name Vladyslav  after connection with backend
  return (
    <SafeAreaView>
      <Button
        onPress={onBackButtonPress}
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  verificationHeader: {
    marginTop: 18,
  },
  content: {
    marginTop: 32,
    gap: 8,
  },
});

export default VerificationScreen;
