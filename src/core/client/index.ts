import authInstanceInitializer from './authClient';
import authResetInstanceInitializer from './authResetClient';
import configInstanceInitializer from './configClient';
import contractorInstanceInitializer from './contractorClient';
import notificatorInstanceInitializer from './notificatorClient';
import offersInstanceInitializer from './offersClient';
import ordersInstanceInitializer from './ordersClient';

const axiosInitilizers = {
  authAxios: authInstanceInitializer,
  authResetAxios: authResetInstanceInitializer,
  contractorAxios: contractorInstanceInitializer,
  notificatorAxios: notificatorInstanceInitializer,
  offersAxios: offersInstanceInitializer,
  ordersAxios: ordersInstanceInitializer,
  configAxios: configInstanceInitializer,
};

export default axiosInitilizers;
