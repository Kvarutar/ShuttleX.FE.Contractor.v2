import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NetworkErrorDetailsWithBody } from 'shuttlex-integration';

import { fetchAllZone, fetchDocsTemplates, saveDocBlob, saveProfilePhoto, verifyDocs } from './thunks';
import { DocsState, DocTemplate } from './types';
import { convertDocTemplateTypeFromAPI } from './utils/docsTemplateType';

const initialState: DocsState = {
  zones: [],
  templates: [],
  templateIdToDocId: {},
  profilePhoto: null,
  selectedZone: null,
  error: null,
  isLoading: false,
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
    updateDocTemplateIsFilled(state, action: PayloadAction<{ docId: string }>) {
      Object.entries(state.templateIdToDocId).forEach(([templateId, docId]) => {
        if (docId === action.payload.docId) {
          const templateIndex = state.templates.findIndex(template => template.id === templateId);
          if (templateIndex !== -1) {
            state.templates[templateIndex].isFilled = true;
          }
        }
      });
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

      .addCase(fetchDocsTemplates.fulfilled, (state, action) => {
        slice.caseReducers.setDocTemplates(state, {
          payload: action.payload.map<DocTemplate>(el => ({
            id: el.id,
            type: convertDocTemplateTypeFromAPI[el.type],
            feKey: el.feKey,
            isFilled: false,
          })),
          type: setDocTemplates.type,
        });
      })
      .addCase(fetchDocsTemplates.rejected, (state, action) => {
        slice.caseReducers.setError(state, {
          payload: action.payload as NetworkErrorDetailsWithBody<any>,
          type: setError.type,
        });
      })

      .addCase(saveDocBlob.rejected, (state, action) => {
        slice.caseReducers.setError(state, {
          payload: action.payload as NetworkErrorDetailsWithBody<any>,
          type: setError.type,
        });
      })

      .addCase(saveProfilePhoto.fulfilled, (state, action) => {
        slice.caseReducers.setProfilePhoto(state, {
          payload: action.payload.id,
          type: setProfilePhoto.type,
        });
      })
      .addCase(saveProfilePhoto.rejected, (state, action) => {
        slice.caseReducers.setError(state, {
          payload: action.payload as NetworkErrorDetailsWithBody<any>,
          type: setError.type,
        });
      })

      .addCase(verifyDocs.rejected, (state, action) => {
        slice.caseReducers.setError(state, {
          payload: action.payload as NetworkErrorDetailsWithBody<any>,
          type: setError.type,
        });
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
} = slice.actions;

export default slice.reducer;
