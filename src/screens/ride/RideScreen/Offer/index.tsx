import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ListRenderItem, StyleSheet, View } from 'react-native';
import { LatLng } from 'react-native-maps';
import { Shadow } from 'react-native-shadow-2';
import { useSelector } from 'react-redux';
import {
  Button,
  defaultShadow,
  FlatListWithCustomScroll,
  formatCurrency,
  milSecToHours,
  milSecToMin,
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

import { tripDropOffRouteSelector, tripPickUpRouteSelector } from '../../../../core/ride/redux/trip/selectors';
import { TripPoint } from '../../../../core/ride/redux/trip/types';
import { OfferItemProps, OfferProps } from './props';

const addressGap = 40;

const calculateTravelTime = (timeToDropOff: string) => {
  const dropOffTime = new Date(timeToDropOff);

  const differenceInMs = dropOffTime.getTime() - Date.now();

  const minutes = milSecToMin(differenceInMs);
  const hours = Math.floor(milSecToHours(differenceInMs));

  return { hours, minutes };
};

const Offer = ({ offer, onOfferAccept, onOfferDecline, onClose, onCloseAllBottomWindows }: OfferProps) => {
  const { t } = useTranslation();
  const { colors } = useTheme();

  const [isShowMorePoints, setIsShowMorePoints] = useState<boolean>(false);

  const travelTime = calculateTravelTime(offer.timeToDropOff);
  const timeToAnswer = useMemo(() => {
    const differenceInMilliseconds = new Date(offer.timeToAnswer).getTime() - Date.now();
    return Date.now() + differenceInMilliseconds;
  }, [offer.timeToAnswer]);

  const pickUpWaypoints = useSelector(tripDropOffRouteSelector)?.waypoints;
  const dropOffWaypoints = useSelector(tripPickUpRouteSelector)?.waypoints;

  const [pickUpData, setPickUpData] = useState<TripPoint[]>([]);
  const [dropOffData, setDropOffData] = useState<TripPoint[]>([]);

  useEffect(() => {
    if (pickUpWaypoints && pickUpWaypoints.length > 0) {
      const pickUpCoordinates = pickUpWaypoints.map<{ address: string } & LatLng>(waypoint => ({
        address: offer.pickUpAddress,
        latitude: waypoint.geo.latitude,
        longitude: waypoint.geo.longitude,
      }));
      setPickUpData(pickUpCoordinates);
    }

    if (dropOffWaypoints && dropOffWaypoints.length > 0) {
      const dropOffCoordinates = dropOffWaypoints.map<{ address: string } & LatLng>(waypoint => ({
        address: offer.stopPointAddresses.join(', '),
        latitude: waypoint.geo.latitude,
        longitude: waypoint.geo.longitude,
      }));
      setDropOffData(dropOffCoordinates);
    }
  }, [pickUpWaypoints, dropOffWaypoints, offer.stopPointAddresses, offer.pickUpAddress]);

  const startPosition: { address: string } & LatLng =
    pickUpData.length > 0
      ? {
          address: pickUpData[0].address,
          latitude: pickUpData[0].latitude,
          longitude: pickUpData[0].longitude,
        }
      : { address: '', latitude: 0, longitude: 0 };

  const targetPointsPosition = dropOffData.map<{ address: string } & LatLng>(data => ({
    address: data.address && Array.isArray(data.address) ? data.address[0] : data.address,
    latitude: data.latitude,
    longitude: data.longitude,
  }));

  const offerPoints = [startPosition, ...targetPointsPosition];

  useEffect(() => {
    onCloseAllBottomWindows();
  }, [onCloseAllBottomWindows]);

  const computedStyles = StyleSheet.create({
    offerInfoWrapper: {
      marginBottom: addressGap,
    },
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

  const renderOffers: ListRenderItem<TripPoint> = ({ item, index }) => {
    let pointName = `${t('ride_Ride_Offer_stopTitle')} ${index}`;
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
        renderItem={renderOffers}
        items={offerPoints}
        withScroll
      />
    );
  } else {
    content = (
      <ScrollViewWithCustomScroll wrapperStyle={styles.scrollViewWrapper}>
        <OfferItem
          address={offer.pickUpAddress}
          pointName={t('ride_Ride_Offer_pickUpTitle')}
          isDropOff={false}
          style={computedStyles.offerItemTitle}
          numberOfAdditionalPoints={offerPoints.length - 2}
          setIsShowMorePoints={setIsShowMorePoints}
          durationTime={offer.durationMin}
        />
        <OfferItem
          address={offer.stopPointAddresses[offer.stopPointAddresses.length - 1]}
          pointName={t('ride_Ride_Offer_dropOffTitle')}
          isDropOff
          style={computedStyles.offerItemTitle}
        />
      </ScrollViewWithCustomScroll>
    );
  }

  return (
    <>
      {
        <View style={styles.timerContainer}>
          <Shadow {...defaultShadow(colors.strongShadowColor)} style={styles.shadowStyle}>
            <Timer
              time={timeToAnswer}
              sizeMode={TimerSizesModes.S}
              colorMode={TimerColorModes.Mode4}
              onAfterCountdownEnds={onClose}
            />
          </Shadow>
        </View>
      }
      <View style={[styles.offerInfoWrapper, computedStyles.offerInfoWrapper]}>
        <View style={[styles.offerInfoItem, computedStyles.offerInfoItem]}>
          <Text style={[styles.offerInfoTitle, computedStyles.offerInfoText]}>{t('ride_Ride_Offer_travelTime')}</Text>
          <View style={styles.offerTimeContainer}>
            {travelTime.hours !== 0 && travelTime.hours > 0 && (
              <Text style={[styles.offerInfoCounter, computedStyles.offerInfoCounter]}>
                {t('ride_Ride_Offer_hours', { hours: travelTime.hours })}
              </Text>
            )}
            <Text style={[styles.offerInfoCounter, computedStyles.offerInfoCounter]}>
              {t('ride_Ride_Offer_minutes', {
                minutes: travelTime.minutes !== 0 && travelTime.minutes > 0 ? travelTime.minutes : 0,
              })}
            </Text>
          </View>
        </View>
        <View style={[styles.offerInfoItem, computedStyles.offerInfoItem]}>
          <Text style={[styles.offerInfoTitle, computedStyles.offerInfoText]}>{t('ride_Ride_Offer_pricePerKm')}</Text>
          <Text style={[styles.offerInfoCounter, computedStyles.offerInfoCounter]}>
            {formatCurrency(offer.currency, offer.pricePerKm)}
          </Text>
        </View>
        <View style={[styles.offerInfoItem, computedStyles.offerInfoItem]}>
          <Text style={[styles.offerInfoTitle, computedStyles.offerInfoText]}>{t('ride_Ride_Offer_price')}</Text>
          <Text style={[styles.offerInfoCounter, computedStyles.offerInfoCounter]}>
            {formatCurrency(offer.currency, offer.price)}
          </Text>
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

const OfferItem = ({ address, pointName, isDropOff, isStopPoint, style, durationTime }: OfferItemProps) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  let convertedDurationTime;

  if (durationTime) {
    convertedDurationTime = {
      hours: Math.floor(durationTime / 60),
      minutes: Math.floor(durationTime % 60),
    };
  }

  const computedStyles = StyleSheet.create({
    durationTimeContainer: {
      marginTop: addressGap,
    },
    durationTime: {
      color: colors.textQuadraticColor,
    },
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
        {!isDropOff && durationTime && convertedDurationTime && (
          <View style={[styles.durationTimeContainer, computedStyles.durationTimeContainer]}>
            <Separator style={styles.separatorHorizontal} />

            <View style={styles.convertedDurationTimeContainer}>
              {convertedDurationTime.hours !== 0 && convertedDurationTime.hours > 0 && (
                <Text style={[styles.durationTime, computedStyles.durationTime]}>
                  {t('ride_Ride_Offer_durationTimeHours', { hours: convertedDurationTime.hours })}
                </Text>
              )}
              <Text style={[styles.durationTime, computedStyles.durationTime]}>
                {t('ride_Ride_Offer_durationTimeMinutes', {
                  minutes:
                    convertedDurationTime.minutes !== 0 && convertedDurationTime.minutes > 0
                      ? convertedDurationTime.minutes
                      : 0,
                })}
              </Text>
            </View>
            <Separator style={styles.separatorHorizontal} />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  durationTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    gap: 8,
  },
  convertedDurationTimeContainer: {
    flexDirection: 'row',
  },
  durationTime: {
    fontFamily: 'Inter Medium',
    fontSize: 14,
    lineHeight: 16,
  },
  separatorHorizontal: {
    height: 1,
  },
  timerContainer: {
    position: 'absolute',
    top: -45,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  shadowStyle: {
    borderRadius: 100,
  },
  offerInfoWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 5,
    paddingTop: 30,
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
    flex: 1,
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
