import { SelectedFile } from '../props';

export type SelectedFileProps = {
  onTakePhoto: () => void;
  onCloseFile: () => void;
  selectedFile?: SelectedFile;
  photoWidth: number;
  photoHeight: number;
};
