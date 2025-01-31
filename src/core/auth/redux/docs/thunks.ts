import { getNetworkErrorInfo } from 'shuttlex-integration';

import { createAppAsyncThunk } from '../../../redux/hooks';
import { clearDocsState, setSelectedZone, setTemplateIdToDocId, updateDocTemplateIsFilled } from './index';
import { selectedZoneSelector } from './selectors';
import {
  CreateDocAPIResponse,
  DocsState,
  DocsTemplatesAPIResponse,
  PaymentDataForm,
  SaveDocAPIRequest,
  SaveProfilePhotoAPIRequest,
  SaveProfilePhotoAPIResponse,
  TemplateIdWithDocId,
  ZoneAPIResponse,
} from './types';

export const fetchAllZone = createAppAsyncThunk<ZoneAPIResponse[], void>(
  'docs/fetchAllZone',
  async (_, { rejectWithValue, configAxios }) => {
    try {
      const response = await configAxios.get<ZoneAPIResponse[]>('/zones');
      return response.data;
    } catch (error) {
      return rejectWithValue(getNetworkErrorInfo(error));
    }
  },
);

export const fetchDocsTemplates = createAppAsyncThunk<DocsTemplatesAPIResponse, string>(
  'docs/fetchDocsTemplates',
  async (zoneId, { rejectWithValue, configAxios, docsAxios, dispatch }) => {
    try {
      const response = await configAxios.get<DocsTemplatesAPIResponse>(`/zones/${zoneId}/doc-metadatas`);

      const templateIdToDocIdArr: TemplateIdWithDocId[] = await Promise.all(
        response.data.map(template => {
          return new Promise<TemplateIdWithDocId>(async (resolve, reject) => {
            try {
              const createDocResponse = await docsAxios.post<CreateDocAPIResponse>('/docs', {
                metadataId: template.id,
              });
              resolve({ templateId: template.id, docId: createDocResponse.data.id });
            } catch (e) {
              reject(e);
            }
          });
        }),
      );

      const templateIdToDocIdMap: DocsState['templateIdToDocId'] = {};
      templateIdToDocIdArr.forEach(el => (templateIdToDocIdMap[el.templateId] = el.docId));

      dispatch(setTemplateIdToDocId(templateIdToDocIdMap));
      dispatch(setSelectedZone(zoneId));

      return response.data;
    } catch (error) {
      return rejectWithValue(getNetworkErrorInfo(error));
    }
  },
);

export const saveDocBlob = createAppAsyncThunk<string, SaveDocAPIRequest>(
  'docs/saveDocBlob',
  async ({ docId, file }, { rejectWithValue, docsAxios, dispatch }) => {
    const formData = new FormData();
    formData.append('File', file);

    try {
      const response = await docsAxios.post<string>(`/docs/${docId}/blob`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      dispatch(updateDocTemplateIsFilled({ docId }));

      return response.data;
    } catch (error) {
      return rejectWithValue(getNetworkErrorInfo(error));
    }
  },
);

export const saveProfilePhoto = createAppAsyncThunk<SaveProfilePhotoAPIResponse, SaveProfilePhotoAPIRequest>(
  'docs/saveProfilePhoto',
  async (data, { rejectWithValue, profileAxios }) => {
    const { file } = data;
    const formData = new FormData();
    formData.append('Avatar', file);

    try {
      const response = await profileAxios.post<SaveProfilePhotoAPIResponse>('/profile/avatars/blob', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(getNetworkErrorInfo(error));
    }
  },
);

export const verifyDocs = createAppAsyncThunk<void, void>(
  'docs/verifyDocs',
  async (_, { rejectWithValue, docsAxios, getState, dispatch }) => {
    try {
      const zoneId = selectedZoneSelector(getState());
      const response = await docsAxios.post(`/zones/${zoneId}/contractors/complete`);
      dispatch(clearDocsState());
      return response.data;
    } catch (error) {
      return rejectWithValue(getNetworkErrorInfo(error));
    }
  },
);

export const saveDocPaymentData = createAppAsyncThunk<PaymentDataForm, PaymentDataForm>(
  'docs/paymentData',
  async (payload, { rejectWithValue, profileAxios }) => {
    try {
      await profileAxios.post('/profile/first-names', { type: 0, value: payload.firstName.trim() });
      await profileAxios.post('/profile/last-names', { type: 0, value: payload.surname.trim() });
      await profileAxios.post('/profile/patronic-names', {
        type: 0,
        value: payload.patronymic,
      });
      await profileAxios.patch('/profile', { socialSecurityNumber: payload.taxNumber });

      return payload;
    } catch (error) {
      return rejectWithValue(getNetworkErrorInfo(error));
    }
  },
);
