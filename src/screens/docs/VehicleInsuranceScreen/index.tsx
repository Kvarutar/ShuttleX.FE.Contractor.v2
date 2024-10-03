import { useTranslation } from 'react-i18next';

import DocsPhotoCore from '../DocsPhotoCore';
import { VehicleInsuranceScreenProps } from './props';

const VehicleInsuranceScreen = ({ navigation }: VehicleInsuranceScreenProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <DocsPhotoCore
      photoWidth={1240}
      photoHeight={1754}
      windowTitle={t('docs_VehicleInsurance_headerTitle')}
      firstHeaderTitle={t('docs_VehicleInsurance_explanationFirstTitle')}
      secondHeaderTitle={t('docs_VehicleInsurance_explanationSecondTitle')}
      headerDescription={t('docs_VehicleInsurance_explanationDescription')}
      goBack={navigation.goBack}
      documentType="vehicleInsurance"
    />
  );
};

export default VehicleInsuranceScreen;
