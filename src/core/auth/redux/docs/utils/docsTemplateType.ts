import { DocsTemplatesAPIResponse, DocsType } from '../types';

export const convertDocTemplateTypeFromAPI: Record<DocsTemplatesAPIResponse[0]['type'], DocsType> = {
  '0': DocsType.Personal,
  '1': DocsType.Vehicle,
};
