import { SelectedFile } from '../props';

export type SelectedFileProps = {
  onTakePhoto: () => void;
  onCloseFile: (fileUri: string | undefined) => void;
  selectedFiles: SelectedFile[];
  photoWidth: number;
  photoHeight: number;
  isProfilePhoto: boolean;
};
