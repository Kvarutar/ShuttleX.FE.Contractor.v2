import { AxiosInstance } from 'axios';
import { AppState } from 'react-native';
import { Config } from 'react-native-config';
import { createAxiosInstance, InitCreateAppAsyncThunkDispatch } from 'shuttlex-integration';

import { AppDispatch } from '../redux/store';
import instanceDefaultConfig from './instanceDefaultConfig';

const offersInstanceInitializer = (dispatch: InitCreateAppAsyncThunkDispatch<AppState, AppDispatch>): AxiosInstance => {
  return createAxiosInstance({
    url: `${Config.API_OFFERS_URL_HTTPS}`,
    ...instanceDefaultConfig(dispatch),
  });
};

export default offersInstanceInitializer;
