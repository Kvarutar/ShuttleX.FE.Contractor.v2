import { useTranslation } from 'react-i18next';

import DocsPhotoCore from '../DocsPhotoCore';
import { DriversLicenseScreenProps } from './props';

const DriversLicenseScreen = ({ navigation }: DriversLicenseScreenProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <DocsPhotoCore
      photoWidth={314}
      photoHeight={215}
      windowTitle={t('docs_DriversLicense_headerTitle')}
      firstHeaderTitle={t('docs_DriversLicense_explanationFirstTitle')}
      secondHeaderTitle={t('docs_DriversLicense_explanationSecondTitle')}
      headerDescription={t('docs_DriversLicense_explanationDescription')}
      goBack={navigation.goBack}
      documentType="driversLicense"
    />
  );
};

export default DriversLicenseScreen;
