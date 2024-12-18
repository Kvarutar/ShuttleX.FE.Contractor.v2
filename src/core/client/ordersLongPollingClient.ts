import { AxiosInstance } from 'axios';
import { AppState } from 'react-native';
import { Config } from 'react-native-config';
import { createAxiosInstance, InitCreateAppAsyncThunkDispatch } from 'shuttlex-integration';

import { AppDispatch } from '../redux/store';
import instanceLongPollingConfig from './instanceLongPollingConfig';

const ordersLongPollingInstanceInitializer = (
  dispatch: InitCreateAppAsyncThunkDispatch<AppState, AppDispatch>,
): AxiosInstance => {
  return createAxiosInstance({
    url: `${Config.API_ORDERS_URL_HTTPS}`,
    ...instanceLongPollingConfig(dispatch),
  });
};
export default ordersLongPollingInstanceInitializer;
