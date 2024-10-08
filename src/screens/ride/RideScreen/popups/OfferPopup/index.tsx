import { Dimensions, StyleSheet } from 'react-native';
import { Popup } from 'shuttlex-integration';

import Offer from '../../Offer';
import { OfferPopupProps } from './props';

const windowHeight = Dimensions.get('window').height;

const OfferPopup = ({ offer, onOfferAccept, onOfferDecline, onClose, onCloseAllBottomWindows }: OfferPopupProps) => {
  return (
    <Popup bottomWindowStyle={styles.popup} isWithBlur={false}>
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

const styles = StyleSheet.create({
  popup: {
    maxHeight: windowHeight * 0.7,
  },
});

export default OfferPopup;
