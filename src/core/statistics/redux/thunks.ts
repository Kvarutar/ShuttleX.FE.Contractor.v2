import { createAppAsyncThunk } from '../../redux/hooks';
import { ContractorStatisticsAPIResponse } from './types';

//TODO: There's just example! Rewrite when info about "achievements" logic will be known
export const getContractorStatistics = createAppAsyncThunk<ContractorStatisticsAPIResponse, { contractorId: string }>(
  'statistics/getContractorStatistics',
  async () => {
    //TODO: Add networking
    // try {
    //   return await shuttlexContractorInstance.get(`/achievements/contractor/${payload.contractorId}`, {});
    // } catch (error) {
    //   const { code, message } = getAxiosErrorInfo(error);
    //   return rejectWithValue({
    //     code,
    //     message,
    //   });
    // }
    const contractorStatisticsFromBack: ContractorStatisticsAPIResponse = {
      level: 4,
      likes: 4000,
      rides: 10000,
    };
    return contractorStatisticsFromBack;
  },
);
