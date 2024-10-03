import { useTranslation } from 'react-i18next';

import DocsPhotoCore from '../DocsPhotoCore';
import { PassportScreenProps } from './props';

const PassportScreen = ({ navigation }: PassportScreenProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <DocsPhotoCore
      photoWidth={314}
      photoHeight={215}
      windowTitle={t('docs_Passport_headerTitle')}
      firstHeaderTitle={t('docs_Passport_explanationFirstTitle')}
      secondHeaderTitle={t('docs_Passport_explanationSecondTitle')}
      headerDescription={t('docs_Passport_explanationDescription')}
      goBack={navigation.goBack}
      documentType="passport"
    />
  );
};

export default PassportScreen;
