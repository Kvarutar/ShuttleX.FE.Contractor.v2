import { Image, Platform, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { Button, ButtonShapes, CircleButtonModes, CloseIcon } from 'shuttlex-integration';

import { docsConsts } from '../props';
import { PhotoProps } from './props';

const Photo = ({ photoAsset, onCloseButtonPress, photoWidth, photoHeight, isProfilePhoto }: PhotoProps) => {
  const imageSize = Math.min(docsConsts.photoMaxSize, photoWidth, photoHeight);
  const borderRadius = isProfilePhoto ? imageSize / 2 : 10;

  const computedStyles = StyleSheet.create({
    photoWrapper: {
      width: Math.min(docsConsts.photoMaxSize, photoWidth),
      height: Math.min(docsConsts.photoMaxSize, photoHeight),
      borderRadius: borderRadius,
    },
    image: {
      borderRadius: borderRadius,
    },
    closePhotoButton: {
      bottom: isProfilePhoto ? 50 : -15,
      right: isProfilePhoto ? 0 : -15,
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
          style={[styles.image, computedStyles.image]}
        />
        {/*TODO: remove uri check on deploy? */}
        <Button
          style={[styles.closePhotoButton, computedStyles.closePhotoButton]}
          onPress={onCloseButtonPress}
          shape={ButtonShapes.Circle}
          mode={CircleButtonModes.Mode2}
        >
          <CloseIcon />
        </Button>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  photoWrapper: {
    flex: 1,
    alignSelf: 'center',
  },
  image: {
    flex: 1,
  },
  photoContainer: {
    flex: 1,
  },
  closePhotoButton: {
    position: 'absolute',
  },
});

export default Photo;
