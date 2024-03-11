import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import ImageCropPicker from 'react-native-image-crop-picker';
import { Asset, ImagePickerResponse, launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import {
  Bar,
  BarModes,
  BigCameraIcon,
  Button,
  ButtonModes,
  CloseIcon,
  RoundButton,
  ScrollViewWithCustomScroll,
  ShortArrowIcon,
  sizes,
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
import { docsConsts, DocsPhotoCoreProps } from './props';

const photoMaxWidth = Dimensions.get('window').width - sizes.paddingVertical * 2;

const DocsPhotoCore = ({
  imageWidth,
  imageHeight,
  goBack,
  headerTitle,
  explanationTitle,
  explanationDescription,
  documentType,
  children,
}: DocsPhotoCoreProps): JSX.Element => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const [isImageLoaded, setIsImageLoaded] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<Asset | null>(null);

  const computedStyles = StyleSheet.create({
    container: {
      backgroundColor: colors.backgroundPrimaryColor,
    },
    description: {
      color: colors.textSecondaryColor,
    },
    imageWrapper: {
      width: Math.min(photoMaxWidth, imageWidth),
      height: Math.min(300, imageHeight),
    },
  });

  const cropPhoto = async (result: ImagePickerResponse) => {
    if (!result.didCancel && result.assets) {
      try {
        if (result.assets[0].uri) {
          const croppedResult = await ImageCropPicker.openCropper({
            path: result.assets[0].uri,
            mediaType: 'photo',
            width: imageWidth,
            height: imageHeight,
          });
          setSelectedPhoto({
            ...result.assets[0],
            uri: croppedResult.path,
            width: croppedResult.width,
            height: croppedResult.height,
          });
        }
      } catch {
        setSelectedPhoto({ ...result.assets[0] });
      }
    }
    setIsImageLoaded(true);
  };

  async function onTakePhoto() {
    let isGranted = await checkCameraUsagePermission();

    if (!isGranted) {
      await requestCameraUsagePermission();
      isGranted = await checkCameraUsagePermission();
    }
    if (isGranted) {
      const result = await launchCamera({ mediaType: 'photo', cameraType: 'front', maxHeight: 1400, maxWidth: 1400 });

      setIsImageLoaded(false);
      setTimeout(() => cropPhoto(result), docsConsts.cropTimeOut);
    }
  }

  async function onSelectPhoto() {
    let isGranted = await checkGalleryUsagePermission();

    if (!isGranted) {
      await requestGalleryUsagePermission();
      isGranted = await checkGalleryUsagePermission();
    }

    if (isGranted) {
      const result = await launchImageLibrary({ mediaType: 'photo' });

      setIsImageLoaded(false);
      setTimeout(() => cropPhoto(result), docsConsts.cropTimeOut);
    }
  }

  const onSave = () => {
    if (selectedPhoto && selectedPhoto.fileName && selectedPhoto.uri && selectedPhoto.type) {
      dispatch(
        updateRequirementDocuments({
          type: documentType,
          body: {
            name: selectedPhoto.fileName,
            type: selectedPhoto.type,
            uri: Platform.OS === 'ios' ? selectedPhoto.uri.replace('file://', '') : selectedPhoto.uri,
          },
        }),
      );
      goBack();
    }
  };

  let bottomButton = <Button text={t('docs_DocsPhotoCore_selectButton')} onPress={onSelectPhoto} />;

  if (!isImageLoaded) {
    bottomButton = (
      <Button mode={ButtonModes.Mode4} style={styles.loadingButton}>
        <ActivityIndicator />
      </Button>
    );
  }

  if (selectedPhoto) {
    bottomButton = <Button text={t('docs_DocsPhotoCore_saveButton')} onPress={onSave} />;
  }

  let image = (
    <Pressable onPress={onTakePhoto} style={styles.photoContainer}>
      <Bar mode={BarModes.Default} style={styles.takeImage}>
        <BigCameraIcon />
      </Bar>
    </Pressable>
  );

  if (selectedPhoto?.uri) {
    image = (
      <Animated.View
        style={styles.photoContainer}
        entering={FadeIn.duration(docsConsts.fadeAnimationDuration)}
        exiting={FadeOut.duration(docsConsts.fadeAnimationDuration)}
      >
        <Image
          source={{ uri: Platform.OS === 'ios' ? selectedPhoto.uri.replace('file://', '') : selectedPhoto.uri }}
          style={styles.userUmage}
        />
        {/*TODO: remove uri check on deploy */}
        <RoundButton style={styles.closePhotoButton} onPress={() => setSelectedPhoto(null)}>
          <CloseIcon />
        </RoundButton>
      </Animated.View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, computedStyles.container]}>
      <View style={[styles.header]}>
        <RoundButton onPress={goBack}>
          <ShortArrowIcon />
        </RoundButton>
        <Text style={[styles.headerTitle]}>{headerTitle}</Text>
        <View style={styles.headerDummy} />
      </View>
      <ScrollViewWithCustomScroll>
        <Bar>
          <Text style={styles.title}>{explanationTitle}</Text>
          <Text style={[styles.description, computedStyles.description]}>{explanationDescription}</Text>
        </Bar>
        <View style={[styles.imageWrapper, selectedPhoto?.uri ? computedStyles.imageWrapper : styles.takeImageWrapper]}>
          {image}
        </View>
        {children}
      </ScrollViewWithCustomScroll>
      {bottomButton}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: sizes.paddingHorizontal,
    paddingVertical: sizes.paddingVertical,
  },
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
  takeImage: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  imageWrapper: {
    marginTop: 40,
    flex: 1,
    alignSelf: 'center',
  },
  takeImageWrapper: {
    width: photoMaxWidth,
  },
  tips: {
    gap: 8,
    marginTop: 24,
    marginBottom: 44,
  },
  userUmage: {
    flex: 1,
    borderRadius: 20,
  },
  closePhotoButton: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  photoContainer: {
    flex: 1,
  },
});

export default DocsPhotoCore;
