import { SwipeButtonModes } from 'shuttlex-integration';

export type ConfirmationPopupProps = {
  onClose: () => void;
  onSwipeEnd: () => void;
  swipeMode: SwipeButtonModes;
  popupTitle: string;
};
