import Config from 'react-native-config';
import { createAxiosInstance, defaultAxiosRetryConfig } from 'shuttlex-integration';

const shuttlexContractorInstance = createAxiosInstance({
  url: `${Config.API_URL_HTTPS}`,
  retryConfig: defaultAxiosRetryConfig,
});

export default shuttlexContractorInstance;
