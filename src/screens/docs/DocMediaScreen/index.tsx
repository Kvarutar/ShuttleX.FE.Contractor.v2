import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { MediaCore } from 'shuttlex-integration';

import { docIdByTemplateIdSelector } from '../../../core/auth/redux/docs/selectors';
import { saveDocBlob } from '../../../core/auth/redux/docs/thunks';
import { getDocTitlesByFeKey } from '../../../core/auth/redux/docs/utils/docsFeKey';
import { useAppDispatch } from '../../../core/redux/hooks';
import { RootStackParamList } from '../../../Navigate/props';

const DocMediaScreen = (): JSX.Element => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'DocMedia'>>();
  const route = useRoute<RouteProp<RootStackParamList, 'DocMedia'>>();
  const { feKey, templateId } = route.params;

  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const { headerTitle, explanationSecondTitle, explanationFirstTitle, explanationDescription } =
    getDocTitlesByFeKey[feKey];
  const docId = useSelector(docIdByTemplateIdSelector(templateId));

  return (
    <MediaCore
      windowTitle={t(headerTitle)}
      firstHeaderTitle={t(explanationFirstTitle)}
      secondHeaderTitle={t(explanationSecondTitle)}
      headerDescription={t(explanationDescription)}
      goBack={navigation.goBack}
      onSaveFiles={files => {
        files.map(file => dispatch(saveDocBlob({ docId: docId, file: file })));
      }}
    />
  );
};

export default DocMediaScreen;
