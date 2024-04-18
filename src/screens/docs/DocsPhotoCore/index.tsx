import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Platform, StyleSheet, View } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import ImageCropPicker from 'react-native-image-crop-picker';
import { ImagePickerResponse, launchCamera, launchImageLibrary } from 'react-native-image-picker';
import {
  Bar,
  Button,
  ButtonModes,
  RoundButton,
  SafeAreaView,
  ScrollViewWithCustomScroll,
  ShortArrowIcon,
  Text,
  useTheme,
} from 'shuttlex-integration';

import { updateRequirementDocuments } from '../../../core/auth/redux/docs';
import { useAppDispatch } from '../../../core/redux/hooks';
import {
  checkCameraUsagePermission,
  checkGalleryUsagePermission,
  requestCameraUsagePermission,
  requestGalleryUsagePermission,
} from '../../../core/utils/permissions';
import FileTypePopup from './FileTypePopup';
import { docsConsts, DocsPhotoCoreProps, DocumentFileType, SelectedFile } from './props';
import SelectedFilePresentation from './SelectedFilePresentation';

type DocsPhotoCoreContent = {
  onUploadContent: () => {} | void;
  uploadButtonText: string;
};

const DocsPhotoCore = ({
  photoWidth,
  photoHeight,
  goBack,
  headerTitle,
  explanationTitle,
  explanationDescription,
  documentType,
  children,
  permittedDocumentFileType,
}: DocsPhotoCoreProps): JSX.Element => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const [isFileLoaded, setIsFileLoaded] = useState(true);
  const [selectedFile, setSelectedFile] = useState<SelectedFile | null>(null);

  const [isFileTypePopupVisible, setIsFileTypePopupVisible] = useState(false);

  const computedStyles = StyleSheet.create({
    description: {
      color: colors.textSecondaryColor,
    },
  });

  const cropPhoto = async (result: ImagePickerResponse) => {
    if (!result.didCancel && result.assets) {
      try {
        if (result.assets[0].uri) {
          const croppedResult = await ImageCropPicker.openCropper({
            path: result.assets[0].uri,
            mediaType: 'photo',
            width: photoWidth,
            height: photoHeight,
          });
          setSelectedFile({
            type: DocumentFileType.Photo,
            body: {
              ...result.assets[0],
              uri: croppedResult.path,
              width: croppedResult.width,
              height: croppedResult.height,
            },
          });
        }
      } catch {
        setSelectedFile({
          type: DocumentFileType.Photo,
          body: result.assets[0],
        });
      }
    }
    setIsFileLoaded(true);
  };

  const onTakePhoto = async () => {
    let isGranted = await checkCameraUsagePermission();

    if (!isGranted) {
      await requestCameraUsagePermission();
      isGranted = await checkCameraUsagePermission();
    }
    if (isGranted) {
      const result = await launchCamera({ mediaType: 'photo', cameraType: 'front', maxHeight: 1400, maxWidth: 1400 });

      setIsFileLoaded(false);
      setTimeout(() => cropPhoto(result), docsConsts.cropTimeOut);
    }
  };

  const onSelectPhoto = async () => {
    let isGranted = await checkGalleryUsagePermission();

    if (!isGranted) {
      await requestGalleryUsagePermission();
      isGranted = await checkGalleryUsagePermission();
    }

    if (isGranted) {
      const result = await launchImageLibrary({ mediaType: 'photo' });

      if (!result.didCancel) {
        setIsFileLoaded(false);
        setTimeout(() => {
          cropPhoto(result);
          setIsFileTypePopupVisible(false);
        }, docsConsts.cropTimeOut);
      }
    }
  };

  const onSelectDocument = async () => {
    try {
      const result = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.allFiles],
      });

      setIsFileTypePopupVisible(false);
      setSelectedFile({
        type: DocumentFileType.Document,
        body: result,
      });
    } catch {
      //TODO: add error
    }
  };

  const onSave = () => {
    let body = null;

    if (selectedFile) {
      const fileName = selectedFile.type === 'photo' ? selectedFile.body.fileName : selectedFile.body.name;

      if (selectedFile.body.uri && selectedFile.body.type && fileName) {
        body = {
          name: fileName,
          type: selectedFile.body.type,
          uri: Platform.OS === 'ios' ? selectedFile.body.uri.replace('file://', '') : selectedFile.body.uri,
          //TODO: check if be need this replace
        };
      }
    }

    if (body) {
      dispatch(
        updateRequirementDocuments({
          type: documentType,
          body,
        }),
      );
      goBack();
    }
  };

  const docsPhotoCoreRecord: Record<DocumentFileType, DocsPhotoCoreContent> = {
    photo: {
      onUploadContent: onSelectPhoto,
      uploadButtonText: t('docs_DocsPhotoCore_selectPhotoButton'),
    },
    document: {
      onUploadContent: onSelectDocument,
      uploadButtonText: t('docs_DocsPhotoCore_selectDocumentButton'),
    },
    all: {
      onUploadContent: () => setIsFileTypePopupVisible(true),
      uploadButtonText: t('docs_DocsPhotoCore_selectFileButton'),
    },
  };

  let bottomButton = (
    <Button
      text={docsPhotoCoreRecord[permittedDocumentFileType].uploadButtonText}
      onPress={docsPhotoCoreRecord[permittedDocumentFileType].onUploadContent}
    />
  );

  if (!isFileLoaded) {
    bottomButton = (
      <Button mode={ButtonModes.Mode4} style={styles.loadingButton}>
        <ActivityIndicator />
      </Button>
    );
  } else if (selectedFile) {
    bottomButton = <Button text={t('docs_DocsPhotoCore_saveButton')} onPress={onSave} />;
  }

  return (
    <>
      <SafeAreaView>
        <View style={styles.header}>
          <RoundButton onPress={goBack}>
            <ShortArrowIcon />
          </RoundButton>
          <Text style={[styles.headerTitle]}>{headerTitle}</Text>
          <View style={styles.headerDummy} />
        </View>
        <ScrollViewWithCustomScroll withShadow>
          <Bar>
            <Text style={styles.title}>{explanationTitle}</Text>
            <Text style={[styles.description, computedStyles.description]}>{explanationDescription}</Text>
          </Bar>
          <SelectedFilePresentation
            selectedFile={selectedFile ?? undefined}
            onTakePhoto={onTakePhoto}
            onCloseFile={() => setSelectedFile(null)}
            photoHeight={photoHeight}
            photoWidth={photoWidth}
          />
          {children}
        </ScrollViewWithCustomScroll>
        {bottomButton}
      </SafeAreaView>
      {isFileTypePopupVisible && (
        <FileTypePopup
          onClose={() => setIsFileTypePopupVisible(false)}
          onOpenFilePicker={onSelectDocument}
          onOpenImagePicker={onSelectPhoto}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  loadingButton: {
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  headerTitle: {
    fontFamily: 'Inter Medium',
    fontSize: 18,
  },
  headerDummy: {
    width: 50,
  },
  title: {
    fontFamily: 'Inter Medium',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
  tips: {
    gap: 8,
    marginTop: 24,
    marginBottom: 44,
  },
});

export default DocsPhotoCore;
