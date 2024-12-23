import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import { useSelector } from 'react-redux';
import {
  Button,
  ButtonShapes,
  ButtonSizes,
  ChatIcon,
  CircleButtonModes,
  defaultShadow,
  ExternalMapIcon,
  formatCurrency,
  minToMilSec,
  openRouteOnGoogleMaps,
  PhoneIcon,
  Text,
  Timer,
  TimerColorModes,
  TimerSizesModes,
  useTheme,
} from 'shuttlex-integration';

import { orderSelector, tripStatusSelector } from '../../../../../../core/ride/redux/trip/selectors';
import { TripStatus } from '../../../../../../core/ride/redux/trip/types';
import { AddressWithPassengerAndOrderInfoProps } from './props';

const buttonTextHeight = 18;

const AddressWithPassengerAndOrderInfo = ({
  tripPointsAddresses,
  timeForTimer,
  googleMapButtonPoints,
  isWaiting,
  setWaitingTime,
}: AddressWithPassengerAndOrderInfoProps) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);

  const order = useSelector(orderSelector);
  const tripStatus = useSelector(tripStatusSelector);

  const [extraWaiting, setExtraWaiting] = useState<boolean>(false);
  const [timerColorMode, setTimerColorMode] = useState<TimerColorModes>(TimerColorModes.Mode1);
  const [extraWaitingSum, setExtraWaitingSum] = useState<number>(0);
  const [extraWaitingTimeIInSec, setExtraWaitingTimeInSec] = useState<number>(0);

  const withAvatar = tripStatus === TripStatus.Arrived || tripStatus === TripStatus.Ending;

  useEffect(() => {
    switch (tripStatus) {
      case TripStatus.Idle:
        setTimerColorMode(TimerColorModes.Mode1);
        break;
      case TripStatus.NearPoint:
        setTimerColorMode(TimerColorModes.Mode2);
        break;
      case TripStatus.Ending:
        setTimerColorMode(TimerColorModes.Mode2);
        break;
      default:
    }
  }, [tripStatus]);

  useEffect(() => {
    if (order && tripStatus === TripStatus.Arrived && setWaitingTime) {
      setWaitingTime(Date.now() + order.waitingTimeInMilSec);
    }
  }, [order, tripStatus, setWaitingTime]);

  useEffect(() => {
    if (tripStatus === TripStatus.Arrived) {
      if (extraWaiting) {
        setTimerColorMode(TimerColorModes.Mode5);
      } else {
        setTimerColorMode(TimerColorModes.Mode2);
      }
    }
  }, [extraWaiting, tripStatus]);

  useEffect(() => {
    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
      }
    };
  }, []);

  //TODO: Check time for timer and logic for rendering time in timer
  // There is some small problems with time render after reloading app
  useEffect(() => {
    if (order && order.waitingTimeInMilSec < 0) {
      const waitingTimeInMin = Math.floor(Math.abs(order.waitingTimeInMilSec) / (1000 * 60));

      setExtraWaiting(true);
      setExtraWaitingSum(waitingTimeInMin * order.pricePerMin);
      setExtraWaitingTimeInSec(waitingTimeInMin * 60);
    }
  }, [order]);

  if (!order) {
    return;
  }

  const onAfterCountdownEnds = () => {
    if (isWaiting && !intervalIdRef.current) {
      setExtraWaiting(true);
      intervalIdRef.current = setInterval(() => {
        setExtraWaitingSum(prevSum => prevSum + order.pricePerMin);
      }, minToMilSec(1));
    }
  };

  const travelTime = {
    hours: Math.floor(order.travelTimeInMilSec / (1000 * 60 * 60)),
    minutes: Math.floor((order.travelTimeInMilSec / (1000 * 60)) % 60),
  };

  const computedStyles = StyleSheet.create({
    outerContainer: {
      paddingTop: withAvatar ? 0 : 16,
    },
    visibleContent: {
      paddingTop: withAvatar ? 24 : 0,
    },
    visiblePickUpText: {
      color: colors.textQuadraticColor,
    },
    passengerName: {
      color: colors.textSecondaryColor,
    },
    orderInfo: {
      backgroundColor: colors.backgroundSecondaryColor,
    },
    orderTitle: {
      color: colors.textQuadraticColor,
    },
    orderValue: {
      color: colors.textPrimaryColor,
    },
    openOnGoogleMapButton: {
      borderColor: colors.borderColor,
    },
    openOnText: {
      color: colors.textQuadraticColor,
    },
    googleMapText: {
      color: colors.textPrimaryColor,
    },
    timerStatusContainer: {
      backgroundColor: colors.backgroundTertiaryColor,
    },
    timerStatusText: {
      color: colors.textTertiaryColor,
    },
    contactButtonText: {
      color: colors.textSecondaryColor,
    },
    contactButtonTextDisabled: {
      color: colors.textQuadraticColor,
    },
    chatIcon: {
      color: colors.iconSecondaryColor,
    },
    endingAddress: {
      color: colors.textQuadraticColor,
    },
    endingPassengerNames: {
      color: colors.textPrimaryColor,
    },
  });

  return (
    <View style={[styles.outerContainer, computedStyles.outerContainer]}>
      <View style={styles.innerContainer}>
        {tripStatus !== TripStatus.Ending ? (
          <>
            <View style={[styles.visibleContent, computedStyles.visibleContent]}>
              <Text style={[styles.visiblePickUpText, computedStyles.visiblePickUpText]}>
                {t('ride_Ride_Order_pickUpText')}
              </Text>
              <Text style={[computedStyles.passengerName, styles.visibleMiniPassengerName]}>
                {order.passenger.name}
              </Text>
            </View>
            <Text style={styles.address}>{tripPointsAddresses[0]}</Text>
          </>
        ) : (
          <View style={styles.endingAdressAndNames}>
            <Text style={[styles.endingAddress, computedStyles.endingAddress]}>{tripPointsAddresses[0]}</Text>
            <Text style={[styles.endingPassengerNames, computedStyles.endingPassengerNames]}>
              {order.passenger.name}
            </Text>
          </View>
        )}
        <View>
          {googleMapButtonPoints && (
            <Pressable
              style={[styles.openOnGoogleMapButton, computedStyles.openOnGoogleMapButton]}
              onPress={() => openRouteOnGoogleMaps(googleMapButtonPoints.startPoint, googleMapButtonPoints.endPoint)}
            >
              <ExternalMapIcon />
              <View style={styles.googleMapTextContainer}>
                <Text style={[styles.openOnText, computedStyles.openOnText]}>{t('ride_Ride_Order_openOnText')}</Text>
                <Text style={[styles.googleMapText, computedStyles.googleMapText]}>
                  {t('ride_Ride_Order_googleMapText')}
                </Text>
              </View>
            </Pressable>
          )}
        </View>
        <View style={styles.orderInfoContainer}>
          <View style={[styles.orderInfo, computedStyles.orderInfo]}>
            <Text style={[styles.orderTitle, computedStyles.orderTitle]}>{t('ride_Ride_Order_travelTimeTitle')}</Text>
            <Text style={[styles.orderValue, computedStyles.orderValue]}>
              {travelTime.hours && travelTime.hours > 0
                ? t('ride_Ride_Order_travelTimeHours', { hours: travelTime.hours })
                : null}
              {t('ride_Ride_Order_travelTimeMinutes', { minutes: travelTime.minutes > 0 ? travelTime.minutes : 0 })}
            </Text>
          </View>
          <View style={[styles.orderInfo, computedStyles.orderInfo]}>
            <Text style={[styles.orderTitle, computedStyles.orderTitle]}>{t('ride_Ride_Order_pricePerKmTitle')}</Text>
            <Text style={[styles.orderValue, computedStyles.orderValue]}>
              {formatCurrency(order.currencyCode, order.pricePerKm)}
            </Text>
          </View>
          <View style={[styles.orderInfo, computedStyles.orderInfo]}>
            <Text style={[styles.orderTitle, computedStyles.orderTitle]}>{t('ride_Ride_Order_priceTitle')}</Text>
            <Text style={[styles.orderValue, computedStyles.orderValue]}>
              {formatCurrency(order.currencyCode, order.price)}
            </Text>
          </View>
        </View>
        <View style={styles.bottomButtonsAndTimer}>
          <View style={styles.contactButtonContainer}>
            <View style={styles.textDummy} />
            <Button shape={ButtonShapes.Circle} mode={CircleButtonModes.Mode2} size={ButtonSizes.M} disableShadow>
              <PhoneIcon />
            </Button>
            <Text style={[styles.contactButtonText, computedStyles.contactButtonText]}>
              {t('ride_Ride_Order_call')}
            </Text>
          </View>
          <View>
            <Shadow
              {...defaultShadow(
                timerColorMode !== TimerColorModes.Mode2 ? colors.strongShadowColor : colors.weakShadowColor,
              )}
              style={styles.shadowStyle}
            >
              <Timer
                time={timeForTimer}
                isWaiting={isWaiting}
                sizeMode={TimerSizesModes.S}
                colorMode={timerColorMode}
                onAfterCountdownEnds={onAfterCountdownEnds}
                countingForwardStartTime={extraWaitingTimeIInSec}
              />
            </Shadow>

            {isWaiting &&
              (!extraWaiting ? (
                <View style={[styles.timerStatusContainer, computedStyles.timerStatusContainer]}>
                  <Text style={[styles.timerStatusText, computedStyles.timerStatusText]}>
                    {t('ride_Ride_Order_waiting')}
                  </Text>
                </View>
              ) : (
                <View style={[styles.timerStatusContainer, computedStyles.timerStatusContainer]}>
                  <Text
                    style={[styles.timerStatusText, computedStyles.timerStatusText]}
                  >{`+${formatCurrency(order.currencyCode, extraWaitingSum)}`}</Text>
                </View>
              ))}
          </View>
          <View style={styles.contactButtonContainer}>
            <View style={styles.textDummy} />
            <Button
              shape={ButtonShapes.Circle}
              mode={CircleButtonModes.Mode2}
              size={ButtonSizes.M}
              disableShadow
              disabled
            >
              <ChatIcon color={computedStyles.chatIcon.color} />
            </Button>
            <Text style={[styles.contactButtonText, computedStyles.contactButtonTextDisabled]}>
              {t('ride_Ride_Order_message')}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  innerContainer: {
    flex: 1,
  },
  visibleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginBottom: 6,
  },
  visiblePickUpText: {
    fontFamily: 'Inter Medium',
  },
  visibleMiniPassengerName: {
    fontFamily: 'Inter Medium',
  },
  endingAdressAndNames: {
    marginTop: 32,
    marginBottom: 14,
  },
  endingPassengerNames: {
    fontFamily: 'Inter Medium',
    fontSize: 21,
    textAlign: 'center',
  },
  address: {
    flexShrink: 1,
    fontFamily: 'Inter Medium',
    fontSize: 21,
    lineHeight: 21,
    paddingHorizontal: 20,
    marginBottom: 16,
    textAlign: 'center',
  },
  endingAddress: {
    fontFamily: 'Inter Medium',
    fontSize: 16,
    textAlign: 'center',
  },
  openOnGoogleMapButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    marginBottom: 8,
  },
  googleMapTextContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  openOnText: {
    fontFamily: 'Inter Medium',
    fontSize: 14,
  },
  googleMapText: {
    fontFamily: 'Inter Medium',
    fontSize: 14,
  },
  orderInfoContainer: {
    flexDirection: 'row',
    zIndex: 1,
    gap: 6,
    marginBottom: 12,
  },
  orderInfo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 2,
    paddingVertical: 16,
    borderRadius: 12,
  },
  orderTitle: {
    fontFamily: 'Inter Medium',
    fontSize: 14,
  },
  orderValue: {
    fontFamily: 'Inter Medium',
    fontSize: 18,
  },
  bottomButtonsAndTimer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  contactButtonContainer: {
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  contactButtonText: {
    fontFamily: 'Inter Medium',
    lineHeight: buttonTextHeight,
  },
  textDummy: {
    height: buttonTextHeight,
    width: 20,
  },
  shadowStyle: {
    borderRadius: 30,
  },
  timerStatusContainer: {
    alignSelf: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    paddingVertical: 4,
    paddingHorizontal: 14,
    minWidth: 68,
    borderRadius: 16,
  },
  timerStatusText: {
    fontFamily: 'Inter Medium',
    fontSize: 12,
  },
});

export default AddressWithPassengerAndOrderInfo;
