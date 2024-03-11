import { ReactNode } from 'react';

import { RequirementDocsType } from '../../../core/auth/redux/docs/types';

export type DocsPhotoCoreProps = {
  children?: ReactNode;
  imageWidth: number;
  imageHeight: number;
  goBack: () => void;
  headerTitle: string;
  explanationTitle: string;
  explanationDescription: string;
  documentType: RequirementDocsType;
};

export const docsConsts = {
  cropTimeOut: 500,
  fadeAnimationDuration: 200,
};
