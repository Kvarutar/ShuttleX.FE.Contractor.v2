import { useTranslation } from 'react-i18next';

import { RequirementDocsType } from '../../../core/auth/redux/docs/types';
import DocsPhotoCore from '../DocsPhotoCore';
import { DocumentFileType } from '../DocsPhotoCore/props';
import { VehicleRegistrationScreenProps } from './props';

const VehicleRegistrationScreen = ({ navigation }: VehicleRegistrationScreenProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <DocsPhotoCore
      photoWidth={1240}
      photoHeight={1754}
      headerTitle={t('docs_VehicleRegistration_headerTitle')}
      explanationTitle={t('docs_VehicleRegistration_explanationTitle')}
      explanationDescription={t('docs_VehicleRegistration_explanationDescription')}
      goBack={navigation.goBack}
      documentType={RequirementDocsType.VehicleRegistration}
      permittedDocumentFileType={DocumentFileType.All}
    />
  );
};

export default VehicleRegistrationScreen;
