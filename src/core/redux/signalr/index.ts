import Config from 'react-native-config';
import { createSignalRSlice } from 'shuttlex-integration';

import { AppState } from '../store';
import { UpdateContractorGeoSignalRRequest, UpdateContractorGeoSignalRResponse } from './types';

const { slice, signalRThunks, createSignalRMethodThunk } = createSignalRSlice({
  options: {
    url: (() => {
      if (Config.SIGNALR_URL === undefined) {
        console.error('SIGNALR_URL is not specified in config!');
        return '';
      }
      return Config.SIGNALR_URL;
    })(),
  },
  listeners: [
    {
      methodName: 'update-contractor-geo',
      // Ignoring eslint is just for showing how you can get state
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      callback: ({ readOnlyState }: { readOnlyState: AppState }, result: UpdateContractorGeoSignalRResponse) => {
        console.log('update-contractor-geo listener result:', result);
      },
    },
  ],
});

const updateContractorGeo = createSignalRMethodThunk<void, UpdateContractorGeoSignalRRequest>('update-contractor-geo');

export default slice.reducer;

const { updateSignalRAccessToken } = slice.actions;

export { signalRThunks, updateContractorGeo, updateSignalRAccessToken };
