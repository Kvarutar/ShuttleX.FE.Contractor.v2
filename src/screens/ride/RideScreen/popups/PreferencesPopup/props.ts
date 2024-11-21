import { RefObject } from 'react';
import { ListRenderItem } from 'react-native';
import { BottomWindowWithGestureRef } from 'shuttlex-integration';

import { TariffInfo } from '../../../../../core/contractor/redux/types';

export type PreferencesPopupProps = {
  onClose: () => void;
  setIsPreferencesPopupVisible: (newState: boolean) => void;
  preferencesBottomWindowRef: RefObject<BottomWindowWithGestureRef>;
};

export type HiddenPartProps = {
  onClose: () => void;
  renderTariffs: ListRenderItem<TariffInfo>;
  isTariffsLoaded: boolean;
  localTariffsSorted: TariffInfo[];
};
