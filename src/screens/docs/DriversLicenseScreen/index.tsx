import { useTranslation } from 'react-i18next';

import { RequirementDocsType } from '../../../core/auth/redux/docs/types';
import DocsPhotoCore from '../DocsPhotoCore';
import { DocumentFileType } from '../DocsPhotoCore/props';
import { DriversLicenseScreenProps } from './props';

const DriversLicenseScreen = ({ navigation }: DriversLicenseScreenProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    //TODO: ask backend about height/width
    <DocsPhotoCore
      photoWidth={314}
      photoHeight={215}
      headerTitle={t('docs_DriversLicense_headerTitle')}
      explanationTitle={t('docs_DriversLicense_explanationTitle')}
      explanationDescription={t('docs_DriversLicense_explanationDescription')}
      goBack={navigation.goBack}
      documentType={RequirementDocsType.DriversLicense}
      permittedDocumentFileType={DocumentFileType.All}
    />
  );
};

export default DriversLicenseScreen;
