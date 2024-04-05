import { Asset } from 'react-native-image-picker';

export type PhotoProps = {
  photoAsset: Asset;
  onCloseButtonPress: () => void;
  photoWidth: number;
  photoHeight: number;
};
