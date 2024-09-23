import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ListRenderItem, Pressable, StyleSheet, View } from 'react-native';
import {
  Button,
  FlatListWithCustomScroll,
  PointIcon,
  ScrollViewWithCustomScroll,
  Separator,
  SquareButtonModes,
  Text,
  Timer,
  TimerColorModes,
  TimerSizesModes,
  useTheme,
} from 'shuttlex-integration';

import { TripPoint } from '../../../../core/ride/redux/trip/types';
import { OfferItemProps, OfferProps } from './props';

const Offer = ({ offer, onOfferAccept, onOfferDecline, onClose }: OfferProps) => {
  const { t } = useTranslation();
  const { colors } = useTheme();

  const makeDecisionTime = Date.now() + 0.5 * 60 * 1000;

  const [isShowMorePoints, setIsShowMorePoints] = useState<boolean>(false);

  const offerPoints = [offer.startPosition, ...offer.targetPointsPosition];

  const computedStyles = StyleSheet.create({
    offerInfoTitle: {
      color: colors.textSecondaryColor,
    },
    offerInfoText: {
      color: colors.textPrimaryColor,
    },
    offerInfoItem: {
      backgroundColor: colors.backgroundSecondaryColor,
    },
    offerItemTitle: {
      color: colors.textSecondaryColor,
    },
    offerAdditionalPointsText: {
      color: colors.textSecondaryColor,
    },
  });

  const renderTarifs: ListRenderItem<TripPoint> = ({ item, index }) => {
    let pointName = `${t('ride_Ride_Offer_stopTitle')}  ${index}`;
    let isDropOff = false;
    let isStopPoint = false;

    if (index === 0) {
      pointName = t('ride_Ride_Offer_pickUpTitle');
    } else if (index === offerPoints.length - 1) {
      pointName = t('ride_Ride_Offer_dropOffTitle');
      isDropOff = true;
    } else if (index !== 0 && index !== offerPoints.length - 1) {
      isStopPoint = true;
    }

    return (
      <OfferItem
        address={item.address}
        pointName={pointName}
        isDropOff={isDropOff}
        isStopPoint={isStopPoint}
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

  const fullTimeMinutes = offer.fullTimeMinutes - Date.now();

  const travelTime = {
    hours: Math.floor(fullTimeMinutes / (1000 * 60 * 60)),
    minutes: Math.floor((fullTimeMinutes % (1000 * 60 * 60)) / (1000 * 60)),
  };

  return (
    <>
      {
        <View style={styles.timerContainer}>
          <Timer
            time={makeDecisionTime}
            sizeMode={TimerSizesModes.S}
            colorMode={TimerColorModes.Mode1}
            onAfterCountdownEnds={onClose}
          />
        </View>
      }
      <View style={styles.offerInfoWrapper}>
        <View style={[styles.offerInfoItem, computedStyles.offerInfoItem]}>
          <Text style={[styles.offerInfoTitle, computedStyles.offerInfoTitle]}>{t('ride_Ride_Offer_travelTime')}</Text>
          <View style={styles.offerTimeContainer}>
            {travelTime.hours !== 0 && (
              <Text style={[styles.offerInfoText, computedStyles.offerInfoText]}>
                {t('ride_Ride_Offer_hours', { hours: travelTime.hours })}
              </Text>
            )}
            {travelTime.minutes !== 0 && (
              <Text style={[styles.offerInfoText, computedStyles.offerInfoText]}>
                {t('ride_Ride_Offer_minutes', { minutes: travelTime.minutes })}
              </Text>
            )}
          </View>
        </View>
        <View style={[styles.offerInfoItem, computedStyles.offerInfoItem]}>
          <Text style={[styles.offerInfoTitle, computedStyles.offerInfoTitle]}>{t('ride_Ride_Offer_pricePerKm')}</Text>
          <Text style={[styles.offerInfoText, computedStyles.offerInfoText]}>
            ${t('ride_Ride_Offer_kilometers', { count: offer.pricePerKm })}
          </Text>
        </View>
        <View style={[styles.offerInfoItem, computedStyles.offerInfoItem]}>
          <Text style={[styles.offerInfoTitle, computedStyles.offerInfoTitle]}>{t('ride_Ride_Offer_price')}</Text>
          <Text style={[styles.offerInfoText, computedStyles.offerInfoText]}>${offer.price}</Text>
        </View>
      </View>
      {content}
      <View style={styles.offerButtons}>
        <Button
          text={t('ride_Ride_Offer_acceptButton')}
          containerStyle={styles.offerButtonsItem}
          onPress={onOfferAccept}
        />
        <Button
          text={t('ride_Ride_Offer_declineButton')}
          mode={SquareButtonModes.Mode4}
          containerStyle={styles.offerButtonsItem}
          onPress={onOfferDecline}
        />
      </View>
    </>
  );
};

const OfferItem = ({
  address,
  pointName,
  isDropOff,
  isStopPoint,
  style,
  setIsShowMorePoints,
  numberOfAdditionalPoints,
}: OfferItemProps) => {
  const { t } = useTranslation();
  const { colors } = useTheme();

  const computedStyles = StyleSheet.create({
    dropOffOuter: {
      color: colors.errorColor,
    },
    dropOffInner: {
      color: colors.iconTertiaryColor,
    },
    stopPointOuter: {
      color: colors.backgroundSecondaryColor,
    },
    invisibleHorizontalSeparator: {
      marginVertical: numberOfAdditionalPoints && numberOfAdditionalPoints > 0 ? 20 : 10,
    },
  });

  return (
    <View style={[styles.offerWrapper, isDropOff ? styles.dropOffWrapper : {}]}>
      <View style={styles.offerItemTop}>
        {isDropOff ? (
          <PointIcon innerColor={computedStyles.dropOffInner.color} outerColor={computedStyles.dropOffOuter.color} />
        ) : isStopPoint ? (
          <PointIcon outerColor={computedStyles.stopPointOuter.color} />
        ) : (
          <PointIcon />
        )}
        {!isDropOff && <Separator mode="vertical" />}
      </View>
      <View style={styles.offerItemBottom}>
        <Text style={[style, styles.offerItemTitle]}>{pointName}</Text>
        <View style={styles.offerAddressWrapper}>
          <Text style={styles.offerItemAddress}>{address}</Text>
          {!isDropOff &&
            (numberOfAdditionalPoints && numberOfAdditionalPoints > 0 ? (
              <View style={styles.offerAdditionalPoints}>
                <View style={computedStyles.invisibleHorizontalSeparator} />
                <Pressable onPress={() => setIsShowMorePoints?.(true)}>
                  <Text style={[styles.offerAdditionalPointsText, style]}>
                    {t('ride_Ride_Offer_moreButton', { numberOfPoints: numberOfAdditionalPoints })}
                  </Text>
                </Pressable>
              </View>
            ) : (
              <View style={computedStyles.invisibleHorizontalSeparator} />
            ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  timerContainer: {
    position: 'absolute',
    top: -45,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  offerInfoWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 4,
    paddingTop: 30,
    paddingBottom: 30,
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
  offerInfoItem: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
  },
  offerInfoTitle: {
    fontFamily: 'Inter Madium',
    fontSize: 14,
  },
  offerInfoText: {
    fontFamily: 'Inter Madium',
    fontSize: 17,
  },
  offerTimeContainer: {
    flexDirection: 'row',
    gap: 4,
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
    marginBottom: 20,
  },
});

export default Offer;
