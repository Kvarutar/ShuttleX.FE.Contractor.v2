import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Bar, BarModes, BigCameraIcon } from 'shuttlex-integration';

import Document from '../Document';
import Photo from '../Photo';
import { docsConsts, DocumentFileType } from '../props';
import { SelectedFileProps } from './props';

const SelectedFilePresentation = ({
  onTakePhoto,
  selectedFiles,
  photoWidth,
  photoHeight,
  onCloseFile,
  isProfilePhoto,
}: SelectedFileProps) => {
  if (selectedFiles.length === 0) {
    return (
      <Animated.View style={styles.photoWrapper} entering={FadeIn.duration(200)}>
        <Bar mode={BarModes.Default} style={styles.takePhoto} onPress={onTakePhoto}>
          <Pressable onPress={onTakePhoto}>
            <BigCameraIcon />
          </Pressable>
        </Bar>
      </Animated.View>
    );
  }

  return (
    <View style={styles.content}>
      {selectedFiles.map(file => {
        switch (file.type) {
          case DocumentFileType.Photo:
            return (
              <Photo
                key={file.body.uri}
                onCloseButtonPress={() => onCloseFile(file.body.uri)}
                photoAsset={file.body}
                photoHeight={photoHeight}
                photoWidth={photoWidth}
                isProfilePhoto={isProfilePhoto}
              />
            );
          case DocumentFileType.Document:
            return (
              <Document
                key={file.body.uri}
                onCloseButtonPress={() => onCloseFile(file.body.uri)}
                selectedDocument={file.body}
              />
            );
          default:
            return null;
        }
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingVertical: 10,
    gap: 20,
  },
  takePhoto: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  photoWrapper: {
    flex: 1,
    alignSelf: 'center',
    height: 250,
    width: docsConsts.photoMaxSize,
  },
});

export default SelectedFilePresentation;
