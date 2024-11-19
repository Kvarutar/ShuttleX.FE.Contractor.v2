import authInstanceInitializer from './authClient';
import authResetInstanceInitializer from './authResetClient';
import contractorInstanceInitializer from './contractorClient';
import notificatorInstanceInitializer from './notificatorClient';
import offersInstanceInitializer from './offersClient';
import ordersInstanceInitializer from './orderClient';

const axiosInitilizers = {
  authAxios: authInstanceInitializer,
  authResetAxios: authResetInstanceInitializer,
  contractorAxios: contractorInstanceInitializer,
  notificatorAxios: notificatorInstanceInitializer,
  offersAxios: offersInstanceInitializer,
  ordersAxios: ordersInstanceInitializer,
};

export default axiosInitilizers;
