import { OfferInfo } from '../../../../../core/ride/redux/trip/types';

export type OfferPopupProps = {
  offer: OfferInfo;
  onOfferAccept: () => void;
  onOfferDecline: () => void;
  onClose: () => void;
  onCloseAllBottomWindows: () => void;
};
