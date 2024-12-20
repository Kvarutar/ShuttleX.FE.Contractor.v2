import { AppState } from '../../../redux/store';

export const docsTemplatesSelector = (state: AppState) => state.docs.templates;
export const zonesSelector = (state: AppState) => state.docs.zones;
export const selectedZoneSelector = (state: AppState) => state.docs.selectedZone;
export const profilePhotoSelector = (state: AppState) => state.docs.profilePhoto;
export const docIdByTemplateIdSelector = (templateId: string) => (state: AppState) =>
  state.docs.templateIdToDocId[templateId];
export const docsPaymentDataSelector = (state: AppState) => state.docs.paymentData;

export const isDocsLoadingSelector = (state: AppState) => state.docs.isLoading;
