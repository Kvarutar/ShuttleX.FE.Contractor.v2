import React from 'react';
import { useTranslation } from 'react-i18next';

import { RequirementDocsType } from '../../../core/auth/redux/docs/types';
import DocsPhotoCore from '../DocsPhotoCore';
import { DriversLicenseScreenProps } from './props';

const DriversLicenseScreen = ({ navigation }: DriversLicenseScreenProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    //TODO: ask backend about height/width
    <DocsPhotoCore
      imageWidth={314}
      imageHeight={215}
      headerTitle={t('docs_DriversLicense_headerTitle')}
      explanationTitle={t('docs_DriversLicense_explanationTitle')}
      explanationDescription={t('docs_DriversLicense_explanationDescription')}
      goBack={navigation.goBack}
      documentType={RequirementDocsType.DriversLicense}
    />
  );
};

export default DriversLicenseScreen;
