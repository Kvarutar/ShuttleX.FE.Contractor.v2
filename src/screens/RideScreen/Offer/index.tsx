import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ListRenderItem, Pressable, StyleSheet, View } from 'react-native';
import {
  Button,
  ButtonModes,
  ClockIcon,
  CurrencyIcon,
  DropOffIcon,
  FlatListWithCustomScroll,
  LocationIcon,
  PickUpIcon,
  ScrollViewWithCustomScroll,
  Text,
  useTheme,
} from 'shuttlex-integration';

import { OfferProps } from './props';

const Offer = ({
  offerPoints,
  onOfferAccept,
  onOfferDecline,
}: {
  offerPoints: string[];
  onOfferAccept: () => void;
  onOfferDecline: () => void;
}) => {
  const [isShowMorePoints, setIsShowMorePoints] = useState<boolean>(false);

  const { t } = useTranslation();

  const { colors } = useTheme();

  const computedStyles = StyleSheet.create({
    offerInfoText: {
      color: colors.textSecondaryColor,
    },
    offerItemTitle: {
      color: colors.textSecondaryColor,
    },
    offerAdditionalPointsText: {
      color: colors.textSecondaryColor,
    },
    separator: {
      borderColor: colors.strokeColor,
    },
  });

  const renderTarifs: ListRenderItem<string> = ({ item, index }) => {
    let pointName = t('ride_Ride_Offer_stopTitle');
    let isDropOff = false;

    if (index === 0) {
      pointName = t('ride_Ride_Offer_pickUpTitle');
    } else if (index === offerPoints.length - 1) {
      pointName = t('ride_Ride_Offer_dropOffTitle');
      isDropOff = true;
    }

    return (
      <OfferItem address={item} pointName={pointName} isDropOff={isDropOff} style={computedStyles.offerItemTitle} />
    );
  };

  return (
    <>
      <View style={styles.offerItemsWrapper}>
        {isShowMorePoints ? (
          <FlatListWithCustomScroll renderItems={renderTarifs} items={offerPoints} withScroll />
        ) : (
          <ScrollViewWithCustomScroll>
            <OfferItem
              address={offerPoints[0]}
              pointName={t('ride_Ride_Offer_pickUpTitle')}
              isDropOff={false}
              style={computedStyles.offerItemTitle}
              numberOfAdditionalPoints={offerPoints.length - 2}
              setIsShowMorePoints={setIsShowMorePoints}
            />
            <OfferItem
              address={offerPoints[1]}
              pointName={t('ride_Ride_Offer_dropOffTitle')}
              isDropOff
              style={computedStyles.offerItemTitle}
            />
          </ScrollViewWithCustomScroll>
        )}
      </View>
      <View style={[styles.lastHorizontalSeparator, computedStyles.separator]} />
      <View style={styles.offerInfoWrapper}>
        <View style={styles.offerInfoItem}>
          <ClockIcon style={styles.offerInfoIcon} />
          <Text style={computedStyles.offerInfoText}>2 {t('ride_Ride_Offer_time')}</Text>
        </View>
        <View style={styles.offerInfoItem}>
          <LocationIcon style={styles.offerInfoIcon} />
          <Text style={computedStyles.offerInfoText}>0.4 {t('ride_Ride_Offer_distance')}</Text>
        </View>
        <View style={styles.offerInfoItem}>
          <CurrencyIcon style={styles.offerInfoIcon} />
          <Text style={computedStyles.offerInfoText}>$856</Text>
        </View>
      </View>
      <View style={styles.offerButtons}>
        <Button
          text={t('ride_Ride_Offer_declineButton')}
          mode={ButtonModes.Mode3}
          style={styles.offerButtonsItem}
          onPress={onOfferDecline}
        />
        <Button text={t('ride_Ride_Offer_acceptButton')} style={styles.offerButtonsItem} onPress={onOfferAccept} />
      </View>
    </>
  );
};

const OfferItem = ({
  address,
  pointName,
  isDropOff,
  style,
  setIsShowMorePoints,
  numberOfAdditionalPoints,
}: OfferProps) => {
  const { t } = useTranslation();

  const { colors } = useTheme();
  const { strokeColor } = colors;
  const computedStyles = StyleSheet.create({
    separator: {
      borderColor: strokeColor,
    },
  });

  return (
    <View style={[styles.offerWrapper, isDropOff ? styles.dropOffWrapper : {}]}>
      <View style={styles.offerItemTop}>
        {isDropOff ? <DropOffIcon /> : <PickUpIcon />}
        <View
          style={[styles.verticalSeparator, computedStyles.separator, isDropOff ? styles.verticalDropOffSeparator : {}]}
        />
      </View>
      <View>
        <Text style={[style, styles.offerItemTitle]}>{pointName}</Text>
        <View style={styles.offerAddressWrapper}>
          <Text style={styles.offerItemAddress}>{address}</Text>
          {!isDropOff &&
            (numberOfAdditionalPoints && numberOfAdditionalPoints > 0 ? (
              <View style={styles.offerAdditionalPoints}>
                <View style={[styles.horizontalSeparator, computedStyles.separator]} />
                <Pressable onPress={() => setIsShowMorePoints?.(true)}>
                  <Text style={[styles.offerAdditionalPointsText, style]}>
                    {numberOfAdditionalPoints} {t('ride_Ride_Offer_moreButton')}
                  </Text>
                </Pressable>
                <View style={[styles.horizontalSeparator, computedStyles.separator]} />
              </View>
            ) : (
              <View style={[styles.horizontalSeparator, computedStyles.separator]} />
            ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  horizontalSeparator: {
    flex: 1,
    borderStyle: 'dashed',
    borderBottomWidth: 1,
    marginTop: 20,
    marginBottom: 20,
  },
  lastHorizontalSeparator: {
    flex: 1,
    borderStyle: 'dashed',
    borderBottomWidth: 1,
    marginBottom: 20,
  },
  verticalSeparator: {
    borderStyle: 'dashed',
    borderLeftWidth: 1,
    flex: 1,
  },
  verticalDropOffSeparator: {
    borderLeftWidth: 0,
  },
  offerWrapper: {
    flexDirection: 'row',
  },
  offerItemsWrapper: {
    maxHeight: 220,
  },
  offerInfoWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 10,
    paddingBottom: 30,
  },
  offerInfoItem: {
    flexDirection: 'row',
  },
  offerInfoIcon: {
    marginRight: 4,
  },
  offerItemTitle: {
    marginLeft: 6,
  },
  offerItemAddress: {
    fontSize: 20,
  },
  offerAddressWrapper: {
    paddingLeft: 6,
    marginTop: 4,
  },
  offerItemTop: {
    alignItems: 'center',
  },
  offerButtons: {
    flexDirection: 'row',
    gap: 22,
  },
  offerButtonsItem: {
    flex: 1,
  },
  offerAdditionalPoints: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  offerAdditionalPointsText: {
    fontSize: 14,
    paddingHorizontal: 8,
  },
  dropOffWrapper: {
    paddingBottom: 20,
  },
});

export default Offer;
