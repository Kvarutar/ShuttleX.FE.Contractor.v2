import { useTranslation } from 'react-i18next';

import DocsPhotoCore from '../DocsPhotoCore';
import { VehicleRegistrationScreenProps } from './props';

const VehicleRegistrationScreen = ({ navigation }: VehicleRegistrationScreenProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <DocsPhotoCore
      photoWidth={1240}
      photoHeight={1754}
      windowTitle={t('docs_VehicleRegistration_headerTitle')}
      firstHeaderTitle={t('docs_VehicleRegistration_explanationFirstTitle')}
      secondHeaderTitle={t('docs_VehicleRegistration_explanationSecondTitle')}
      headerDescription={t('docs_VehicleRegistration_explanationDescription')}
      goBack={navigation.goBack}
      documentType="vehicleRegistration"
    />
  );
};

export default VehicleRegistrationScreen;
