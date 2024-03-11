import React from 'react';
import { useTranslation } from 'react-i18next';

import { RequirementDocsType } from '../../../core/auth/redux/docs/types';
import DocsPhotoCore from '../DocsPhotoCore';
import { VehicleRegistrationScreenProps } from './props';

const VehicleRegistrationScreen = ({ navigation }: VehicleRegistrationScreenProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <DocsPhotoCore
      imageWidth={1240}
      imageHeight={1754}
      headerTitle={t('docs_VehicleRegistration_headerTitle')}
      explanationTitle={t('docs_VehicleRegistration_explanationTitle')}
      explanationDescription={t('docs_VehicleRegistration_explanationDescription')}
      goBack={navigation.goBack}
      documentType={RequirementDocsType.VehicleRegistration}
    />
  );
};

export default VehicleRegistrationScreen;
