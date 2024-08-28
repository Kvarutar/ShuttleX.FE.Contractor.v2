import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { ButtonV1, ButtonV1Modes, Popup } from 'shuttlex-integration';

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
        <ButtonV1 text={t('docs_DocsPhotoCore_FileTypePopup_uploadFile')} onPress={onOpenFilePicker} />
        <ButtonV1 text={t('docs_DocsPhotoCore_FileTypePopup_uploadImage')} onPress={onOpenImagePicker} />
      </View>
      <ButtonV1 mode={ButtonV1Modes.Mode3} text={t('docs_DocsPhotoCore_FileTypePopup_closeButton')} onPress={onClose} />
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
