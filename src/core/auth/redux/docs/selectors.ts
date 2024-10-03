import { AppState } from '../../../redux/store';

export const isAllDocumentsFilledSelector = (state: AppState) =>
  Object.values(state.docs).every(doc => (Array.isArray(doc) ? doc.length > 0 : doc !== null));

export const isPersonalDocumentsFilledSelector = (state: AppState) =>
  state.docs.profilePhoto !== null && Boolean(state.docs.driversLicense.length) && Boolean(state.docs.passport.length);

export const isDriverDocumentsFilledSelector = (state: AppState) =>
  Boolean(state.docs.vehicleRegistration.length) && Boolean(state.docs.vehicleInsurance.length);

export const profilePhotoSelector = (state: AppState) => state.docs.profilePhoto;
export const passportSelector = (state: AppState) => state.docs.passport;
export const driversLicenseSelector = (state: AppState) => state.docs.driversLicense;
export const vehicleInsuranceSelector = (state: AppState) => state.docs.vehicleInsurance;
export const vehicleRegistrationSelector = (state: AppState) => state.docs.vehicleRegistration;
