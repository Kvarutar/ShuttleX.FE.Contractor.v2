import React from 'react';
import { useTranslation } from 'react-i18next';
import { Linking, Pressable, StyleSheet, View } from 'react-native';
import {
  Bar,
  Button,
  ButtonModes,
  ChatIcon,
  EmergencyServiceIcon,
  PassengerIcon,
  PhoneIcon,
  ReportIcon,
  sizes,
  Text,
  useTheme,
} from 'shuttlex-integration';

import { offerType } from '../../props';
import { HiddenPartProps } from './props';

const HiddenPart = ({ offer, rideStatus }: HiddenPartProps) => {
  const { t } = useTranslation();

  const hiddenContactContent = {
    idle: <ExtendedContactInfo offer={offer} />,
    arriving: <ShortContactInfo offer={offer} />,
    arrivingAtStopPoint: <ShortContactInfo offer={offer} />,
    arrived: <ShortContactInfo offer={offer} />,
    arrivedAtStopPoint: <ShortContactInfo offer={offer} />,
    ride: <ExtendedContactInfo offer={offer} />,
    ending: <ShortContactInfo offer={offer} />,
  };

  return (
    <>
      {hiddenContactContent[rideStatus]}
      <View style={styles.hiddenTripType}>
        <Text style={styles.hiddenTripTypeTitle}>{t('ride_Ride_Order_tripType')}</Text>
        <Text style={styles.hiddenTripTypeContent}>BasicXL</Text>
      </View>
      <Bar isActive style={styles.hiddenTotal}>
        <Text style={styles.hiddenTotalTitle}>{t('ride_Ride_Order_totalForRide')}</Text>
        <Text style={styles.hiddenTotalContent}>20.45</Text>
      </Bar>
      <View style={styles.hiddenSafety}>
        <Pressable style={styles.hiddenSafetyItem} onPress={() => Linking.openURL('tel:911')}>
          <Bar style={styles.hiddenSafetyItemIcon} isActive>
            <EmergencyServiceIcon />
          </Bar>
          <Text style={styles.hiddenSafetyItemText}>{t('ride_Ride_Order_contactEmergency')}</Text>
        </Pressable>
        <Pressable style={styles.hiddenSafetyItem}>
          <Bar style={styles.hiddenSafetyItemIcon} isActive>
            <ReportIcon />
          </Bar>
          <Text style={styles.hiddenSafetyItemText}>{t('ride_Ride_Order_reportIssue')}</Text>
        </Pressable>
      </View>
    </>
  );
};

const ExtendedContactInfo = ({ offer }: { offer: offerType }) => {
  const { colors } = useTheme();

  return (
    <Bar isActive style={styles.hiddenExtendedContactInfo}>
      <View style={styles.hiddenPassengerInfo}>
        <PassengerIcon style={styles.passengerBigIcon} color={colors.iconPrimaryColor} />
        <Text style={styles.hiddenPassengerInfoName}>
          {offer.passenger.name} {offer.passenger.lastName}
        </Text>
      </View>
      <View style={styles.hiddenContactButtons}>
        <Button buttonStyle={styles.hiddenContactButtonStyle} style={styles.hiddenContactButtonsItem}>
          <ChatIcon />
        </Button>
        <Button
          buttonStyle={styles.hiddenContactButtonStyle}
          style={styles.hiddenContactButtonsItem}
          mode={ButtonModes.Mode3}
          onPress={() => Linking.openURL('tel:89990622720')}
        >
          <PhoneIcon />
        </Button>
      </View>
    </Bar>
  );
};

const ShortContactInfo = ({ offer }: { offer: offerType }) => {
  const { t } = useTranslation();

  return (
    <Pressable onPress={() => Linking.openURL('tel:89990622720')}>
      <Bar isActive style={styles.hiddenShortContactInfo}>
        <Text style={styles.hiddenShortContactInfoText}>
          {t('ride_Ride_Order_callButton')} {offer.passenger.name}
        </Text>
        <Button mode={ButtonModes.Mode3} buttonStyle={styles.smallPhoneButton}>
          <PhoneIcon style={styles.smallPhoneButtonIcon} />
        </Button>
      </Bar>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  hiddenPassengerInfo: {
    flexDirection: 'row',
    marginBottom: 20,
    justifyContent: 'center',
    gap: 4,
  },
  hiddenExtendedContactInfo: {
    marginBottom: 30,
  },
  hiddenPassengerInfoName: {
    fontFamily: 'Inter Medium',
    fontSize: 17,
  },
  hiddenContactButtons: {
    flexDirection: 'row',
    gap: 18,
  },
  hiddenContactButtonsItem: {
    flex: 1,
  },
  hiddenTripType: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    paddingHorizontal: 16,
  },
  hiddenTripTypeTitle: {
    fontFamily: 'Inter Medium',
  },
  hiddenTripTypeContent: {
    fontFamily: 'Inter Medium',
    fontSize: 18,
  },
  hiddenTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  hiddenTotalTitle: {
    fontFamily: 'Inter Medium',
  },
  hiddenTotalContent: {
    fontFamily: 'Inter Medium',
    fontSize: 18,
  },
  hiddenSafety: {
    flexDirection: 'row',
    gap: 14,
  },
  hiddenSafetyItem: {
    flex: 1,
  },
  hiddenSafetyItemIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  hiddenSafetyItemText: {
    textAlign: 'center',
    fontFamily: 'Inter Medium',
    fontSize: 12,
    marginTop: 6,
  },
  hiddenShortContactInfo: {
    marginBottom: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hiddenShortContactInfoText: {
    fontFamily: 'Inter Medium',
  },
  hiddenContactButtonStyle: {
    height: 48,
  },
  passengerBigIcon: {
    width: sizes.iconSize,
    height: sizes.iconSize,
  },
  smallPhoneButton: {
    paddingHorizontal: 0,
    width: 34,
    height: 34,
  },
  smallPhoneButtonIcon: {
    width: 16,
    height: 16,
  },
});

export default HiddenPart;
