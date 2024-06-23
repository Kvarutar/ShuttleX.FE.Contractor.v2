import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Button, ButtonModes, Popup } from 'shuttlex-integration';

const FileTypePopup = ({
  onClose,
  onOpenFilePicker,
  onOpenImagePicker,
}: {
  onClose: () => void;
  onOpenFilePicker: () => {};
  onOpenImagePicker: () => {};
}) => {
  const { t } = useTranslation();

  return (
    <Popup>
      <View style={styles.buttons}>
        <Button text={t('docs_DocsPhotoCore_FileTypePopup_uploadFile')} onPress={onOpenFilePicker} />
        <Button text={t('docs_DocsPhotoCore_FileTypePopup_uploadImage')} onPress={onOpenImagePicker} />
      </View>
      <Button mode={ButtonModes.Mode3} text={t('docs_DocsPhotoCore_FileTypePopup_closeButton')} onPress={onClose} />
    </Popup>
  );
};

const styles = StyleSheet.create({
  buttons: {
    gap: 16,
    marginBottom: 30,
  },
});

export default FileTypePopup;
