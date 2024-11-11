import shuttlexAuthInstanceInitializer from './authClient';
import shuttlexContractorInstanceInitializer from './contractorClient';

const axiosInitilizers = {
  shuttlexAuthAxios: shuttlexAuthInstanceInitializer,
  shuttlexContractorAxios: shuttlexContractorInstanceInitializer,
};

export default axiosInitilizers;
