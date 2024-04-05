import { ReactNode } from 'react';
import { Dimensions } from 'react-native';
import { DocumentPickerResponse } from 'react-native-document-picker';
import { Asset } from 'react-native-image-picker';
import { sizes } from 'shuttlex-integration';

import { RequirementDocsType } from '../../../core/auth/redux/docs/types';

export enum DocumentFileType {
  Photo = 'photo',
  Document = 'document',
  All = 'all',
}

export type DocsPhotoCoreProps = {
  children?: ReactNode;
  photoWidth: number;
  photoHeight: number;
  goBack: () => void;
  headerTitle: string;
  explanationTitle: string;
  explanationDescription: string;
  documentType: RequirementDocsType;
  permittedDocumentFileType: DocumentFileType;
};

export const docsConsts = {
  cropTimeOut: 500,
  fadeAnimationDuration: 200,
  photoMaxSize: Dimensions.get('window').width - sizes.paddingVertical * 2,
};

type PhotoAsset = {
  type: DocumentFileType.Photo;
  body: Asset;
};
type SelectedDocument = {
  type: DocumentFileType.Document;
  body: DocumentPickerResponse;
};

export type SelectedFile = PhotoAsset | SelectedDocument;
