import { useTranslation } from 'react-i18next';

import { RequirementDocsType } from '../../../core/auth/redux/docs/types';
import DocsPhotoCore from '../DocsPhotoCore';
import { DocumentFileType } from '../DocsPhotoCore/props';
import { VehicleInspectionScreenProps } from './props';

const VehicleInspectionScreen = ({ navigation }: VehicleInspectionScreenProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <DocsPhotoCore
      photoWidth={1240}
      photoHeight={1754}
      headerTitle={t('docs_VehicleInspection_headerTitle')}
      explanationTitle={t('docs_VehicleInspection_explanationTitle')}
      explanationDescription={t('docs_VehicleInspection_explanationDescription')}
      goBack={navigation.goBack}
      documentType={RequirementDocsType.VehicleInspection}
      permittedDocumentFileType={DocumentFileType.All}
    />
  );
};

export default VehicleInspectionScreen;
