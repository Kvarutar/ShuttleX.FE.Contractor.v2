import authAccountSettingsInstanceInitializer from './authAccountSettingsClient';
import authInstanceInitializer from './authClient';
import cashieringInstanceInitializer from './cashieringClient';
import configInstanceInitializer from './configClient';
import contractorInstanceInitializer from './contractorClient';
import docsInstanceInitializer from './docsClient';
import notificatorInstanceInitializer from './notificatorClient';
import offersInstanceInitializer from './offersClient';
import offersLongPollingInstanceInitializer from './offersLongPollingClient';
import ordersInstanceInitializer from './ordersClient';
import ordersLongPollingInstanceInitializer from './ordersLongPollingClient';
import profileInstanceInitializer from './profileClient';

const axiosInitilizers = {
  authAxios: authInstanceInitializer,
  authAccountSettingsAxios: authAccountSettingsInstanceInitializer,
  contractorAxios: contractorInstanceInitializer,
  notificatorAxios: notificatorInstanceInitializer,
  offersAxios: offersInstanceInitializer,
  ordersAxios: ordersInstanceInitializer,
  configAxios: configInstanceInitializer,
  docsAxios: docsInstanceInitializer,
  profileAxios: profileInstanceInitializer,
  cashieringAxios: cashieringInstanceInitializer,
  offersLongPollingAxios: offersLongPollingInstanceInitializer,
  ordersLongPollingAxios: ordersLongPollingInstanceInitializer,
};

export default axiosInitilizers;
