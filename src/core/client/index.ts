import authInstanceInitializer from './authClient';
import contractorInstanceInitializer from './contractorClient';

const axiosInitilizers = {
  authAxios: authInstanceInitializer,
  contractorAxios: contractorInstanceInitializer,
};

export default axiosInitilizers;
