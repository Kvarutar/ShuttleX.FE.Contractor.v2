import { Image, Platform, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { CloseIcon, RoundButton } from 'shuttlex-integration';

import { docsConsts } from '../props';
import { PhotoProps } from './props';

const Photo = ({ photoAsset, onCloseButtonPress, photoWidth, photoHeight }: PhotoProps) => {
  const computedStyles = StyleSheet.create({
    photoWrapper: {
      width: Math.min(docsConsts.photoMaxSize, photoWidth),
      height: Math.min(docsConsts.photoMaxSize, photoHeight),
    },
  });

  if (!photoAsset.uri) {
    return <></>;
  }

  return (
    <View style={[styles.photoWrapper, computedStyles.photoWrapper]}>
      <Animated.View
        style={styles.photoContainer}
        entering={FadeIn.duration(docsConsts.fadeAnimationDuration)}
        exiting={FadeOut.duration(docsConsts.fadeAnimationDuration)}
      >
        <Image
          source={{ uri: Platform.OS === 'ios' ? photoAsset.uri.replace('file://', '') : photoAsset.uri }}
          style={styles.userUmage}
        />
        {/*TODO: remove uri check on deploy? */}
        <RoundButton style={styles.closePhotoButton} onPress={onCloseButtonPress}>
          <CloseIcon />
        </RoundButton>
      </Animated.View>
    </View>
  );
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
  },
  takePhotoWrapper: {
    width: docsConsts.photoMaxSize,
  },
  closePhotoButton: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  userUmage: {
    flex: 1,
    borderRadius: 20,
  },
  photoContainer: {
    flex: 1,
  },
});

export default Photo;
