import { StyleSheet } from 'react-native';
import { Popup, WINDOW_HEIGHT } from 'shuttlex-integration';

import Offer from '../../Offer';
import { OfferPopupProps } from './props';

const OfferPopup = ({ offer, onOfferAccept, onOfferDecline, onClose, onCloseAllBottomWindows }: OfferPopupProps) => {
  const computedStyles = StyleSheet.create({
    popup: {
      maxHeight: WINDOW_HEIGHT * 0.7,
    },
  });
  return (
    <Popup bottomWindowStyle={computedStyles.popup} isWithBlur={false}>
      <Offer
        offer={offer}
        onOfferAccept={onOfferAccept}
        onOfferDecline={onOfferDecline}
        onClose={onClose}
        onCloseAllBottomWindows={onCloseAllBottomWindows}
      />
    </Popup>
  );
};

export default OfferPopup;
