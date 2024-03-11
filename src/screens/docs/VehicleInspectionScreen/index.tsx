import React from 'react';
import { useTranslation } from 'react-i18next';

import { RequirementDocsType } from '../../../core/auth/redux/docs/types';
import DocsPhotoCore from '../DocsPhotoCore';
import { VehicleInspectionScreenProps } from './props';

const VehicleInspectionScreen = ({ navigation }: VehicleInspectionScreenProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <DocsPhotoCore
      imageWidth={1240}
      imageHeight={1754}
      headerTitle={t('docs_VehicleInspection_headerTitle')}
      explanationTitle={t('docs_VehicleInspection_explanationTitle')}
      explanationDescription={t('docs_VehicleInspection_explanationDescription')}
      goBack={navigation.goBack}
      documentType={RequirementDocsType.VehicleInspection}
    />
  );
};

export default VehicleInspectionScreen;
