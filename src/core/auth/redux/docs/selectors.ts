import { AppState } from '../../../redux/store';

export const requirementDocumentsListSelector = (state: AppState) => state.docs;
export const isPersonalDocumentsFilledSelector = (state: AppState) => {
  return state.docs.profilePhoto !== null && state.docs.driversLicense !== null && state.docs.passport !== null;
};
export const isDriverDocumentsFilledSelector = (state: AppState) => {
  return state.docs.vehicleRegistration !== null && state.docs.vehicleInsurance !== null;
};
export const profilePhotoSelector = (state: AppState) => state.docs.profilePhoto;
export const passportSelector = (state: AppState) => state.docs.passport;
export const driversLicenseSelector = (state: AppState) => state.docs.driversLicense;
export const vehicleInsuranceSelector = (state: AppState) => state.docs.vehicleInsurance;
export const vehicleRegistrationSelector = (state: AppState) => state.docs.vehicleRegistration;
