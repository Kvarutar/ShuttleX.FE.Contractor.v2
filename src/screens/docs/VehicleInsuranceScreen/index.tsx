import { useTranslation } from 'react-i18next';

import { RequirementDocsType } from '../../../core/auth/redux/docs/types';
import DocsPhotoCore from '../DocsPhotoCore';
import { DocumentFileType } from '../DocsPhotoCore/props';
import { VehicleInsuranceScreenProps } from './props';

const VehicleInsuranceScreen = ({ navigation }: VehicleInsuranceScreenProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <DocsPhotoCore
      photoWidth={1240}
      photoHeight={1754}
      headerTitle={t('docs_VehicleInsurance_headerTitle')}
      explanationTitle={t('docs_VehicleInsurance_explanationTitle')}
      explanationDescription={t('docs_VehicleInsurance_explanationDescription')}
      goBack={navigation.goBack}
      documentType={RequirementDocsType.VehicleInsurance}
      permittedDocumentFileType={DocumentFileType.All}
    />
  );
};

export default VehicleInsuranceScreen;
