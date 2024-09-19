import { ListRenderItem } from 'react-native';

import { TariffInfo } from '../../../../../core/contractor/redux/types';

export type PreferencesPopupProps = {
  onClose: () => void;
  setIsPreferencesPopupVisible: (newState: boolean) => void;
};

export type HiddenPartProps = {
  onClose: () => void;
  renderTariffs: ListRenderItem<TariffInfo>;
};
