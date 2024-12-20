import { NetworkErrorDetailsWithBody, Nullable } from 'shuttlex-integration';
import { FileInfo } from 'shuttlex-integration/lib/typescript/src/shared/screens/MediaCore/types';

export type DocsFeKeyFromAPI = 'passport' | 'driverlicense' | 'insurance' | 'vehicle';

export enum DocsType {
  Personal = 'personal',
  Vehicle = 'vehicle',
}

export type DocsState = {
  zones: ZoneAPIResponse[];
  templates: DocTemplate[];
  templateIdToDocId: Record<string, string>;
  profilePhoto: Nullable<string>;
  selectedZone: Nullable<string>;
  error: Nullable<NetworkErrorDetailsWithBody<any>>;
  isLoading: {
    docsTemplates: boolean;
    paymentData: boolean;
  };
  paymentData: Nullable<PaymentDataForm>;
};

export type ZoneAPIResponse = {
  id: string;
  name: Nullable<string>;
  isoName: Nullable<string>;
  locationType: Nullable<string>;
  parentZoneId: Nullable<string>;
  childZoneIds: Nullable<string[]>;
  docMetadataIds: Nullable<string[]>;
};

export type CreateDocAPIResponse = {
  id: string;
};

export type TemplateIdWithDocId = { templateId: string; docId: string };

export type SaveDocAPIRequest = {
  docId: string;
  file: { name: string; type: string; uri: string };
};

export type SaveProfilePhotoAPIRequest = {
  file: FileInfo;
};

export type SaveProfilePhotoAPIResponse = {
  id: string;
};

export type DocTemplate = {
  id: string;
  feKey: Nullable<DocsFeKeyFromAPI>;
  type: Nullable<DocsType>;
  isFilled: boolean;
};

export type DocsTemplatesAPIResponse = {
  id: string;
  required: boolean;
  feKey: Nullable<DocsFeKeyFromAPI>;
  name: Nullable<string>;
  description: Nullable<string>;
  type: '0' | '1';
  subType: string;
}[];

export type PaymentDataForm = {
  firstName: string;
  surname: string;
  patronymic: string;
  taxNumber: string;
};
