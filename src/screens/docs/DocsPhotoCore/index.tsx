import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Alert, Platform, StyleSheet, View } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import ImageCropPicker from 'react-native-image-crop-picker';
import { ImagePickerResponse, launchCamera, launchImageLibrary } from 'react-native-image-picker';
import {
  Button,
  ButtonShadows,
  ButtonShapes,
  ButtonSizes,
  CameraIcon,
  CircleButtonModes,
  DocumentIcon,
  GalleryIcon,
  RoundCheckIcon2,
  SafeAreaView,
  ScrollViewWithCustomScroll,
  ShortArrowIcon,
} from 'shuttlex-integration';
import { useTheme } from 'shuttlex-integration/src/core/themes/v2/themeContext';

import { updateRequirementDocuments } from '../../../core/auth/redux/docs';
import { useAppDispatch } from '../../../core/redux/hooks';
import {
  checkCameraUsagePermission,
  checkGalleryUsagePermission,
  requestCameraUsagePermission,
  requestGalleryUsagePermission,
} from '../../../core/utils/permissions';
import VerificationHeader from '../../verification/VerificationScreen/VerificationHeader';
import { docsConsts, DocsPhotoCoreProps, DocumentFileType, SelectedFile } from './props';
import SelectedFilePresentation from './SelectedFilePresentation';

const DocsPhotoCore = ({
  photoWidth,
  photoHeight,
  goBack,
  windowTitle,
  firstHeaderTitle,
  secondHeaderTitle,
  headerDescription,
  documentType,
  children,
}: DocsPhotoCoreProps): JSX.Element => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const dispatch = useAppDispatch();

  const [isFileLoaded, setIsFileLoaded] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);

  const isProfilePhoto = documentType === 'profilePhoto';

  const addSelectedFile = (file: SelectedFile) => {
    const fileExists = selectedFiles.some(selectedFile => selectedFile.body.uri === file.body.uri);

    if (fileExists) {
      Alert.alert(t('docs_DocsPhotoCore_titleAlertDuplicateFile'), t('docs_DocsPhotoCore_messageAlertDuplicateFile'));
    } else {
      setSelectedFiles(prevFiles => [...prevFiles, file]);
    }
  };

  const cropPhoto = async (result: ImagePickerResponse) => {
    if (!result.didCancel && result.assets) {
      const asset = result.assets[0];
      try {
        if (result.assets[0].uri) {
          const croppedResult = await ImageCropPicker.openCropper({
            path: result.assets[0].uri,
            mediaType: 'photo',
            width: photoWidth,
            height: photoHeight,
            cropperCircleOverlay: isProfilePhoto,
          });
          addSelectedFile({
            type: DocumentFileType.Photo,
            body: { ...asset, uri: croppedResult.path, width: croppedResult.width, height: croppedResult.height },
          });
        }
      } catch {
        addSelectedFile({ type: DocumentFileType.Photo, body: asset });
      }
    }
    setIsFileLoaded(true);
  };

  const handlePhotoAction = async (action: 'camera' | 'gallery') => {
    const permissionCheck = action === 'camera' ? checkCameraUsagePermission : checkGalleryUsagePermission;
    const requestPermission = action === 'camera' ? requestCameraUsagePermission : requestGalleryUsagePermission;
    let isGranted = await permissionCheck();

    if (!isGranted) {
      await requestPermission();
      isGranted = await permissionCheck();
    }

    if (isGranted) {
      const result =
        action === 'camera'
          ? await launchCamera({ mediaType: 'photo', maxHeight: 1400, maxWidth: 1400 })
          : await launchImageLibrary({ mediaType: 'photo' });

      if (result.assets) {
        setIsFileLoaded(false);
        setTimeout(() => cropPhoto(result), docsConsts.cropTimeOut);
      }
    }
  };

  const onSelectDocument = async () => {
    try {
      const result = await DocumentPicker.pickSingle({ type: [DocumentPicker.types.allFiles] });
      addSelectedFile({ type: DocumentFileType.Document, body: result });
    } catch {
      Alert.alert(t('docs_DocsPhotoCore_titleAlertSelectDocument'), t('docs_DocsPhotoCore_messageAlertSelectDocument'));
    }
  };

  const onSave = () => {
    const filesToUpload = selectedFiles.map(file => {
      const fileName = file.type === 'photo' ? file.body.fileName : file.body.name;

      if (file.body.uri && file.body.type && fileName) {
        return {
          name: fileName,
          type: file.body.type,
          uri: Platform.OS === 'ios' ? file.body.uri.replace('file://', '') : file.body.uri,
        };
      }
      return null;
    });

    if (filesToUpload.length > 0) {
      dispatch(updateRequirementDocuments({ [documentType]: filesToUpload }));
      goBack();
    }
  };

  const computedStyles = StyleSheet.create({
    activityIndicator: {
      color: colors.iconPrimaryColor,
    },
  });

  let bottomButton = (
    <>
      <Button
        shape={ButtonShapes.Circle}
        mode={CircleButtonModes.Mode2}
        size={ButtonSizes.M}
        onPress={() => handlePhotoAction('gallery')}
      >
        <GalleryIcon style={styles.buttonIcons} />
      </Button>

      <Button
        shape={ButtonShapes.Circle}
        size={ButtonSizes.L}
        innerSpacing={5}
        shadow={ButtonShadows.Strong}
        onPress={() => handlePhotoAction('camera')}
        withCircleMode1Border
      >
        <CameraIcon style={styles.cameraIcon} />
      </Button>

      <Button
        shape={ButtonShapes.Circle}
        mode={CircleButtonModes.Mode2}
        size={ButtonSizes.M}
        onPress={onSelectDocument}
      >
        <DocumentIcon style={styles.buttonIcons} />
      </Button>
    </>
  );

  if (isProfilePhoto) {
    bottomButton =
      selectedFiles.length > 0 ? (
        <Button containerStyle={styles.button} text={t('docs_DocsPhotoCore_saveButton')} onPress={onSave} />
      ) : (
        <Button
          containerStyle={styles.button}
          text={t('docs_DocsPhotoCore_selectPhotoButton')}
          onPress={() => handlePhotoAction('gallery')}
        />
      );
  }

  if (!isFileLoaded) {
    bottomButton = isProfilePhoto ? (
      <Button containerStyle={styles.button}>
        <ActivityIndicator color={computedStyles.activityIndicator.color} />
      </Button>
    ) : (
      <Button
        shape={ButtonShapes.Circle}
        size={ButtonSizes.L}
        innerSpacing={5}
        shadow={ButtonShadows.Strong}
        withCircleMode1Border
        onPress={() => handlePhotoAction('camera')}
      >
        <ActivityIndicator color={computedStyles.activityIndicator.color} />
      </Button>
    );
  }

  return (
    <>
      <SafeAreaView>
        <View style={styles.headerButtonContainer}>
          <Button onPress={goBack} shape={ButtonShapes.Circle} mode={CircleButtonModes.Mode2}>
            <ShortArrowIcon />
          </Button>

          {!isProfilePhoto && (
            <Button
              onPress={onSave}
              shape={ButtonShapes.Circle}
              disabled={selectedFiles.length === 0}
              size={ButtonSizes.S}
              mode={selectedFiles.length > 0 ? CircleButtonModes.Mode1 : CircleButtonModes.Mode2}
              disableShadow
            >
              <RoundCheckIcon2
                style={styles.roundCheckIcon}
                color={selectedFiles.length > 0 ? undefined : colors.backgroundSecondaryColor}
              />
            </Button>
          )}
        </View>

        <VerificationHeader
          containerStyle={styles.verificationHeader}
          windowTitle={windowTitle}
          firstHeaderTitle={firstHeaderTitle}
          secondHeaderTitle={secondHeaderTitle}
          description={headerDescription}
        />

        <ScrollViewWithCustomScroll withShadow withScroll>
          <SelectedFilePresentation
            selectedFiles={selectedFiles}
            onTakePhoto={() => handlePhotoAction('camera')}
            onCloseFile={fileUri => setSelectedFiles(selectedFiles.filter(file => file.body.uri !== fileUri))}
            photoHeight={photoHeight}
            photoWidth={photoWidth}
            isProfilePhoto={isProfilePhoto}
          />
          {children}
        </ScrollViewWithCustomScroll>
        <View style={styles.buttonContainer}>{bottomButton}</View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  verificationHeader: {
    marginTop: 20,
    marginBottom: 24,
  },
  headerButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 24,
    gap: 8,
  },
  button: {
    flex: 1,
  },
  buttonIcons: {
    width: 20,
    height: 20,
  },
  cameraIcon: {
    width: 28,
    height: 28,
  },
  roundCheckIcon: {
    width: 42,
    height: 42,
  },
});

export default DocsPhotoCore;
