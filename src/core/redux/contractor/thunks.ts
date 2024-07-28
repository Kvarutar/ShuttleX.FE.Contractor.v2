import { getAxiosErrorInfo, TariffType } from 'shuttlex-integration';

import shuttlexContractorInstance from '../../client';
import { createAppAsyncThunk } from '../hooks';
import { ContractorStatus } from './types';

export const sendSelectedTariffs = createAppAsyncThunk<void, TariffType[]>(
  'contractor/sendSelectedTariffs',
  async (payload, { rejectWithValue }) => {
    try {
      await shuttlexContractorInstance.post('/contractor/tariff/update-contractor-selected-tariffs', {
        tariffNames: payload,
      });
    } catch (error) {
      const { code, message } = getAxiosErrorInfo(error);
      return rejectWithValue({
        code,
        message,
      });
    }
  },
);

export const updateContractorStatus = createAppAsyncThunk<void, ContractorStatus>(
  'contractor/updateContractorStatus',
  async (payload, { rejectWithValue }) => {
    const urlPath = payload === 'online' ? 'make-contractor-state-waiting-order' : 'make-contractor-state-out-of-work';

    try {
      await shuttlexContractorInstance.post(`/contractor/${urlPath}`);
    } catch (error) {
      const { code, message } = getAxiosErrorInfo(error);
      return rejectWithValue({
        code,
        message,
      });
    }
  },
);
