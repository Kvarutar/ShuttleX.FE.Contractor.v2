import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NetworkErrorDetailsWithBody } from 'shuttlex-integration';

import {
  fetchAllZone,
  fetchDocsTemplates,
  saveDocBlob,
  saveDocPaymentData,
  saveProfilePhoto,
  verifyDocs,
} from './thunks';
import { DocsState, DocTemplate } from './types';
import { convertDocTemplateTypeFromAPI } from './utils/docsTemplateType';

const initialState: DocsState = {
  zones: [],
  templates: [],
  templateIdToDocId: {},
  profilePhoto: null,
  selectedZone: null,
  error: null,
  isLoading: {
    paymentData: false,
    docsTemplates: false,
    profilePhoto: false,
  },
  paymentData: null,
};

const slice = createSlice({
  name: 'docs',
  initialState,
  reducers: {
    setZones(state, action: PayloadAction<DocsState['zones']>) {
      state.zones = action.payload;
    },
    setSelectedZone(state, action: PayloadAction<DocsState['selectedZone']>) {
      state.selectedZone = action.payload;
    },
    setDocTemplates(state, action: PayloadAction<DocsState['templates']>) {
      state.templates = action.payload;
    },
    setTemplateIdToDocId(state, action: PayloadAction<DocsState['templateIdToDocId']>) {
      state.templateIdToDocId = action.payload;
    },
    setError(state, action: PayloadAction<DocsState['error']>) {
      state.error = action.payload;
    },
    setProfilePhoto(state, action: PayloadAction<DocsState['profilePhoto']>) {
      state.profilePhoto = action.payload;
    },
    setDocPaymentData(state, action: PayloadAction<DocsState['paymentData']>) {
      state.paymentData = action.payload;
    },
    updateDocTemplateIsFilled(state, action: PayloadAction<{ docId: string }>) {
      Object.entries(state.templateIdToDocId).forEach(([templateId, docId]) => {
        if (docId === action.payload.docId) {
          const templateIndex = state.templates.findIndex(template => template.id === templateId);
          if (templateIndex !== -1) {
            state.templates[templateIndex].isLoading = false;
            state.templates[templateIndex].isFilled = true;
          }
        }
      });
    },
    clearDocsState() {
      return initialState;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchAllZone.fulfilled, (state, action) => {
        slice.caseReducers.setZones(state, {
          payload: action.payload,
          type: setZones.type,
        });
      })
      .addCase(fetchAllZone.rejected, (state, action) => {
        slice.caseReducers.setError(state, {
          payload: action.payload as NetworkErrorDetailsWithBody<any>,
          type: setError.type,
        });
      })

      .addCase(fetchDocsTemplates.pending, state => {
        state.isLoading.docsTemplates = true;
      })
      .addCase(fetchDocsTemplates.fulfilled, (state, action) => {
        slice.caseReducers.setDocTemplates(state, {
          payload: action.payload.map<DocTemplate>(el => ({
            id: el.id,
            type: convertDocTemplateTypeFromAPI[el.type],
            feKey: el.feKey,
            isFilled: false,
            isLoading: false,
          })),
          type: setDocTemplates.type,
        });
        state.isLoading.docsTemplates = false;
      })
      .addCase(fetchDocsTemplates.rejected, (state, action) => {
        slice.caseReducers.setError(state, {
          payload: action.payload as NetworkErrorDetailsWithBody<any>,
          type: setError.type,
        });
        state.isLoading.docsTemplates = false;
      })

      .addCase(saveDocBlob.pending, (state, action) => {
        Object.entries(state.templateIdToDocId).forEach(([templateId, docId]) => {
          if (docId === action.meta.arg.docId) {
            const templateIndex = state.templates.findIndex(template => template.id === templateId);
            if (templateIndex !== -1) {
              state.templates[templateIndex].isLoading = true;
            }
          }
        });
      })
      .addCase(saveDocBlob.rejected, (state, action) => {
        slice.caseReducers.setError(state, {
          payload: action.payload as NetworkErrorDetailsWithBody<any>,
          type: setError.type,
        });
        Object.entries(state.templateIdToDocId).forEach(([templateId, docId]) => {
          if (docId === action.meta.arg.docId) {
            const templateIndex = state.templates.findIndex(template => template.id === templateId);
            if (templateIndex !== -1) {
              state.templates[templateIndex].isLoading = false;
            }
          }
        });
      })

      .addCase(saveProfilePhoto.pending, state => {
        state.isLoading.profilePhoto = true;
      })
      .addCase(saveProfilePhoto.fulfilled, (state, action) => {
        slice.caseReducers.setProfilePhoto(state, {
          payload: action.payload.id,
          type: setProfilePhoto.type,
        });
        state.isLoading.profilePhoto = false;
      })
      .addCase(saveProfilePhoto.rejected, (state, action) => {
        slice.caseReducers.setError(state, {
          payload: action.payload as NetworkErrorDetailsWithBody<any>,
          type: setError.type,
        });
        state.isLoading.profilePhoto = false;
      })

      .addCase(verifyDocs.rejected, (state, action) => {
        slice.caseReducers.setError(state, {
          payload: action.payload as NetworkErrorDetailsWithBody<any>,
          type: setError.type,
        });
      })

      .addCase(saveDocPaymentData.pending, state => {
        state.isLoading.paymentData = true;
      })
      .addCase(saveDocPaymentData.fulfilled, (state, action) => {
        slice.caseReducers.setDocPaymentData(state, {
          payload: action.payload,
          type: setDocPaymentData.type,
        });
        state.isLoading.paymentData = false;
      })
      .addCase(saveDocPaymentData.rejected, (state, action) => {
        slice.caseReducers.setError(state, {
          payload: action.payload as NetworkErrorDetailsWithBody<any>,
          type: setError.type,
        });
        state.isLoading.paymentData = false;
      });
  },
});

export const {
  setDocTemplates,
  setError,
  setTemplateIdToDocId,
  setProfilePhoto,
  updateDocTemplateIsFilled,
  setZones,
  setSelectedZone,
  setDocPaymentData,
  clearDocsState,
} = slice.actions;

export default slice.reducer;
