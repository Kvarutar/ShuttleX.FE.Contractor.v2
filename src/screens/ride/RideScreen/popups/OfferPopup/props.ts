import { OfferType } from '../../../../../core/ride/redux/trip/types';

export type OfferPopupProps = {
  offer: OfferType;
  onOfferAccept: () => void;
  onOfferDecline: () => void;
  onClose: () => void;
  onCloseAllBottomWindows: () => void;
};
