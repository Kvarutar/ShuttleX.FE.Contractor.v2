import { DocsFeKeyFromAPI } from '../types';

type DocContent = {
  title: string;
  headerTitle: string;
  explanationFirstTitle: string;
  explanationSecondTitle: string;
  explanationDescription: string;
};

export const getDocTitlesByFeKey: Record<DocsFeKeyFromAPI, DocContent> = {
  passport: {
    title: 'verification_Verification_passport',
    headerTitle: 'docs_Passport_headerTitle',
    explanationFirstTitle: 'docs_Passport_explanationFirstTitle',
    explanationSecondTitle: 'docs_Passport_explanationSecondTitle',
    explanationDescription: 'docs_Passport_explanationDescription',
  },
  driverlicense: {
    title: 'verification_Verification_driverLicense',
    headerTitle: 'docs_DriversLicense_headerTitle',
    explanationFirstTitle: 'docs_DriversLicense_explanationFirstTitle',
    explanationSecondTitle: 'docs_DriversLicense_explanationSecondTitle',
    explanationDescription: 'docs_DriversLicense_explanationDescription',
  },
  insurance: {
    title: 'verification_Verification_vehicleInsurance',
    headerTitle: 'docs_VehicleInsurance_headerTitle',
    explanationFirstTitle: 'docs_VehicleInsurance_explanationFirstTitle',
    explanationSecondTitle: 'docs_VehicleInsurance_explanationSecondTitle',
    explanationDescription: 'docs_VehicleInsurance_explanationDescription',
  },
  vehicle: {
    title: 'verification_Verification_vehicleRegistration',
    headerTitle: 'docs_VehicleRegistration_headerTitle',
    explanationFirstTitle: 'docs_VehicleRegistration_explanationFirstTitle',
    explanationSecondTitle: 'docs_VehicleRegistration_explanationSecondTitle',
    explanationDescription: 'docs_VehicleRegistration_explanationDescription',
  },
};
