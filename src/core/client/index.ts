import authInstanceInitializer from './authClient';
import authResetInstanceInitializer from './authResetClient';
import configInstanceInitializer from './configClient';
import contractorInstanceInitializer from './contractorClient';
import docsInstanceInitializer from './docsClient';
import notificatorInstanceInitializer from './notificatorClient';
import offersInstanceInitializer from './offersClient';
import ordersInstanceInitializer from './ordersClient';
import profileInstanceInitializer from './profileClient';

const axiosInitilizers = {
  authAxios: authInstanceInitializer,
  authResetAxios: authResetInstanceInitializer,
  contractorAxios: contractorInstanceInitializer,
  notificatorAxios: notificatorInstanceInitializer,
  offersAxios: offersInstanceInitializer,
  ordersAxios: ordersInstanceInitializer,
  configAxios: configInstanceInitializer,
  docsAxios: docsInstanceInitializer,
  profileAxios: profileInstanceInitializer,
};

export default axiosInitilizers;
