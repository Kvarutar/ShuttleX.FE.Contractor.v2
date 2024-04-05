import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Bar, BarModes, BigCameraIcon } from 'shuttlex-integration';

import Document from '../Document';
import Photo from '../Photo';
import { docsConsts, DocumentFileType } from '../props';
import { SelectedFileProps } from './props';

const SelectedFilePresentation = ({
  onTakePhoto,
  selectedFile,
  photoWidth,
  photoHeight,
  onCloseFile,
}: SelectedFileProps) => {
  if (!selectedFile) {
    return (
      <Animated.View style={styles.photoWrapper} entering={FadeIn.duration(200)}>
        <Pressable onPress={onTakePhoto} style={styles.photoContainer}>
          <Bar mode={BarModes.Default} style={styles.takePhoto}>
            <BigCameraIcon />
          </Bar>
        </Pressable>
      </Animated.View>
    );
  }

  if (selectedFile.type === DocumentFileType.Photo) {
    return (
      <Photo
        onCloseButtonPress={onCloseFile}
        photoAsset={selectedFile.body}
        photoHeight={photoHeight}
        photoWidth={photoWidth}
      />
    );
  } else if (selectedFile.type === DocumentFileType.Document) {
    return <Document onCloseButtonPress={onCloseFile} selectedDocument={selectedFile.body} />;
  }

  return <></>;
};

const styles = StyleSheet.create({
  takePhoto: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  photoWrapper: {
    marginTop: 40,
    flex: 1,
    alignSelf: 'center',
    width: docsConsts.photoMaxSize,
  },
  photoContainer: {
    flex: 1,
  },
});

export default SelectedFilePresentation;
