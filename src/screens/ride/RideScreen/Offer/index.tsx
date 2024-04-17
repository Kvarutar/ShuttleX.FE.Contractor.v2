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

import { TripPoint } from '../../../../core/ride/redux/trip/types';
import { OfferItemProps, OfferProps } from './props';

const Offer = ({ offer, onOfferAccept, onOfferDecline }: OfferProps) => {
  const [isShowMorePoints, setIsShowMorePoints] = useState<boolean>(false);

  const { t } = useTranslation();

  const { colors } = useTheme();

  const offerPoints = [offer.startPosition, ...offer.targetPointsPosition];

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

  const renderTarifs: ListRenderItem<TripPoint> = ({ item, index }) => {
    let pointName = `${t('ride_Ride_Offer_stopTitle')}  ${index}`;
    let isDropOff = false;

    if (index === 0) {
      pointName = t('ride_Ride_Offer_pickUpTitle');
    } else if (index === offerPoints.length - 1) {
      pointName = t('ride_Ride_Offer_dropOffTitle');
      isDropOff = true;
    }

    return (
      <OfferItem
        address={item.address}
        pointName={pointName}
        isDropOff={isDropOff}
        style={computedStyles.offerItemTitle}
      />
    );
  };

  let content = null;

  if (isShowMorePoints) {
    content = (
      <FlatListWithCustomScroll
        wrapperStyle={styles.flatListWrapper}
        renderItem={renderTarifs}
        items={offerPoints}
        withScroll
      />
    );
  } else {
    content = (
      <ScrollViewWithCustomScroll wrapperStyle={styles.scrollViewWrapper}>
        <OfferItem
          address={offerPoints[0].address}
          pointName={t('ride_Ride_Offer_pickUpTitle')}
          isDropOff={false}
          style={computedStyles.offerItemTitle}
          numberOfAdditionalPoints={offerPoints.length - 2}
          setIsShowMorePoints={setIsShowMorePoints}
        />
        <OfferItem
          address={offerPoints[offerPoints.length - 1].address}
          pointName={t('ride_Ride_Offer_dropOffTitle')}
          isDropOff
          style={computedStyles.offerItemTitle}
        />
      </ScrollViewWithCustomScroll>
    );
  }

  return (
    <>
      {content}
      <View style={[styles.lastHorizontalSeparator, computedStyles.separator]} />
      <View style={styles.offerInfoWrapper}>
        <View style={styles.offerInfoItem}>
          <ClockIcon style={styles.offerInfoIcon} />
          <Text style={computedStyles.offerInfoText}>{t('ride_Ride_Offer_minutes', { count: offer.fullTime })}</Text>
        </View>
        <View style={styles.offerInfoItem}>
          <LocationIcon style={styles.offerInfoIcon} />
          <Text style={computedStyles.offerInfoText}>
            {t('ride_Ride_Offer_kilometers', { count: offer.fullDistance })}
          </Text>
        </View>
        <View style={styles.offerInfoItem}>
          <CurrencyIcon style={styles.offerInfoIcon} />
          <Text style={computedStyles.offerInfoText}>{offer.total}</Text>
        </View>
      </View>
      <View style={styles.offerButtons}>
        <Button
          text={t('ride_Ride_Offer_declineButton')}
          mode={ButtonModes.Mode3}
          containerStyle={styles.offerButtonsItem}
          onPress={onOfferDecline}
        />
        <Button
          text={t('ride_Ride_Offer_acceptButton')}
          containerStyle={styles.offerButtonsItem}
          onPress={onOfferAccept}
        />
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
}: OfferItemProps) => {
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
      <View style={styles.offerItemBottom}>
        <Text style={[style, styles.offerItemTitle]}>{pointName}</Text>
        <View style={styles.offerAddressWrapper}>
          <Text style={styles.offerItemAddress}>{address}</Text>
          {!isDropOff &&
            (numberOfAdditionalPoints && numberOfAdditionalPoints > 0 ? (
              <View style={styles.offerAdditionalPoints}>
                <View style={[styles.horizontalSeparator, computedStyles.separator]} />
                <Pressable onPress={() => setIsShowMorePoints?.(true)}>
                  <Text style={[styles.offerAdditionalPointsText, style]}>
                    {t('ride_Ride_Offer_moreButton', { numberOfPoints: numberOfAdditionalPoints })}
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
    marginTop: 10,
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
  scrollViewWrapper: {
    flex: 0,
    flexShrink: 1,
  },
  flatListWrapper: {
    flex: 0,
    flexShrink: 1,
  },
  offerWrapper: {
    flexDirection: 'row',
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
    width: '100%',
  },
  offerAddressWrapper: {
    paddingLeft: 6,
    marginTop: 4,
  },
  offerItemTop: {
    alignItems: 'center',
  },
  offerItemBottom: {
    flexShrink: 1,
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
    paddingBottom: 10,
  },
});

export default Offer;
