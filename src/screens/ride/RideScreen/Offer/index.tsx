import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ListRenderItem, StyleSheet, View } from 'react-native';
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

const addressGap = 40;

const Offer = ({ offer, onOfferAccept, onOfferDecline, onClose }: OfferProps) => {
  const { t } = useTranslation();
  const { colors } = useTheme();

  const makeDecisionTime = Date.now() + 0.5 * 60 * 1000;

  const [isShowMorePoints, setIsShowMorePoints] = useState<boolean>(false);

  const offerPoints = [offer.startPosition, ...offer.targetPointsPosition];

  const computedStyles = StyleSheet.create({
    offerInfoText: {
      color: colors.textQuadraticColor,
    },
    offerInfoCounter: {
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
            colorMode={TimerColorModes.Mode4}
            onAfterCountdownEnds={onClose}
          />
        </View>
      }
      <View style={styles.offerInfoWrapper}>
        <View style={[styles.offerInfoItem, computedStyles.offerInfoItem]}>
          <Text style={[styles.offerInfoTitle, computedStyles.offerInfoText]}>{t('ride_Ride_Offer_travelTime')}</Text>
          <View style={styles.offerTimeContainer}>
            {travelTime.hours !== 0 && (
              <Text style={[styles.offerInfoText, computedStyles.offerInfoText]}>
                {t('ride_Ride_Offer_hours', { hours: travelTime.hours })}
              </Text>
            )}
            {travelTime.minutes !== 0 && (
              <Text style={[styles.offerInfoCounter, computedStyles.offerInfoCounter]}>
                {t('ride_Ride_Offer_minutes', { minutes: travelTime.minutes })}
              </Text>
            )}
          </View>
        </View>
        <View style={[styles.offerInfoItem, computedStyles.offerInfoItem]}>
          <Text style={[styles.offerInfoTitle, computedStyles.offerInfoText]}>{t('ride_Ride_Offer_pricePerKm')}</Text>
          <Text style={[styles.offerInfoCounter, computedStyles.offerInfoCounter]}>
            ${t('ride_Ride_Offer_kilometers', { count: offer.pricePerKm })}
          </Text>
        </View>
        <View style={[styles.offerInfoItem, computedStyles.offerInfoItem]}>
          <Text style={[styles.offerInfoTitle, computedStyles.offerInfoText]}>{t('ride_Ride_Offer_price')}</Text>
          <Text style={[styles.offerInfoCounter, computedStyles.offerInfoCounter]}>${offer.price}</Text>
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

const OfferItem = ({ address, pointName, isDropOff, isStopPoint, style }: OfferItemProps) => {
  const { colors } = useTheme();

  const computedStyles = StyleSheet.create({
    offerItemTitle: {
      color: colors.textQuadraticColor,
    },
    dropOffOuter: {
      color: colors.errorColor,
    },
    dropOffInner: {
      color: colors.iconTertiaryColor,
    },
    stopPointOuter: {
      color: colors.backgroundSecondaryColor,
    },
  });

  return (
    <View style={styles.offerWrapper}>
      <View style={styles.offerIconsContainer}>
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
        <Text style={[style, styles.offerPointTitle, computedStyles.offerItemTitle]}>{pointName}</Text>
        <Text style={styles.offerItemAddress}>{address}</Text>
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
    gap: 5,
    paddingTop: 30,
    marginBottom: addressGap,
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
  offerItemBottom: {
    flexShrink: 1,
    marginLeft: 12,
    marginBottom: addressGap,
  },
  offerInfoTitle: {
    fontSize: 14,
  },
  offerInfoText: {
    fontSize: 18,
    lineHeight: 16,
  },
  offerInfoCounter: {
    fontFamily: 'Inter Medium',
    fontSize: 18,
    lineHeight: 18,
  },
  offerTimeContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  offerIconsContainer: {
    alignItems: 'center',
  },
  offerPointTitle: {
    fontFamily: 'Inter Medium',
    fontSize: 16,
  },
  offerItemAddress: {
    fontFamily: 'Inter Medium',
    fontSize: 21,
  },
  offerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  offerButtonsItem: {
    flex: 1,
  },
});

export default Offer;
