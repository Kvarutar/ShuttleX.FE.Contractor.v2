import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import { useSelector } from 'react-redux';
import {
  Button,
  ButtonShapes,
  CircleButtonModes,
  ExternalMapIcon,
  minToMilSec,
  PhoneIcon,
  Text,
  Timer,
  TimerColorModes,
  TimerSizesModes,
  useTheme,
} from 'shuttlex-integration';

import { orderSelector } from '../../../../../../core/ride/redux/trip/selectors';
import { TripStatus } from '../../../../../../core/ride/redux/trip/types';
import { AddressWithPassengerAndOrderInfoProps } from './props';

const AddressWithPassengerAndOrderInfo = ({
  tripPoints,
  withAvatar,
  isWaiting,
  withGoogleMapButton = true,
  timeForTimer,
  contentType,
  setWaitingTime,
}: AddressWithPassengerAndOrderInfoProps) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);

  const [extraWaiting, setExtraWaiting] = useState<boolean>(false);
  const [timerColorMode, setTimerColorMode] = useState<TimerColorModes>(TimerColorModes.Mode1);
  const [extraWaitingSum, setExtraWaitingSum] = useState<number>(0);
  const [disabledShadow, setDisabledShadow] = useState(true);

  const order = useSelector(orderSelector);

  useEffect(() => {
    setDisabledShadow(contentType !== TripStatus.Arriving);
  }, [contentType, extraWaiting]);

  useEffect(() => {
    switch (contentType) {
      case TripStatus.Idle:
        setTimerColorMode(TimerColorModes.Mode1);
        break;
      case TripStatus.Arriving:
        setTimerColorMode(TimerColorModes.Mode2);
        break;
      case TripStatus.Ending:
        setTimerColorMode(TimerColorModes.Mode2);
        break;
      default:
    }
  }, [contentType]);

  useEffect(() => {
    if (order && contentType === TripStatus.Arrived && setWaitingTime) {
      setWaitingTime(Date.now() + minToMilSec(order.waitingTimeInMin));
    }
  }, [order, contentType, setWaitingTime]);

  useEffect(() => {
    if (contentType === TripStatus.Arrived) {
      if (extraWaiting) {
        setTimerColorMode(TimerColorModes.Mode5);
      } else {
        setTimerColorMode(TimerColorModes.Mode2);
      }
    }
  }, [extraWaiting, contentType]);

  useEffect(() => {
    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
      }
    };
  }, []);

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
    hours: Math.floor(order.fullTimeMinutes / 60),
    minutes: order.fullTimeMinutes % 60,
  };

  const computedStyles = StyleSheet.create({
    avatarContainer: {
      backgroundColor: colors.backgroundPrimaryColor,
    },
    visibleContent: {
      paddingTop: withAvatar ? 24 : 0,
    },
    visiblePickUpText: {
      color: colors.textSecondaryColor,
    },
    passengerName: {
      color: colors.textSecondaryColor,
    },
    orderInfo: {
      backgroundColor: colors.backgroundSecondaryColor,
    },
    orderTitle: {
      color: colors.textSecondaryColor,
    },
    orderValue: {
      color: colors.textPrimaryColor,
    },
    openOnGoogleMapButton: {
      borderColor: colors.borderColor,
    },
    openOnText: {
      color: colors.textSecondaryColor,
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
  });

  return (
    <View style={styles.passangerInfoWrapper}>
      <View style={styles.visibleTextWrapper}>
        {withAvatar && (
          <View style={[styles.avatarContainer, computedStyles.avatarContainer]}>
            <Image source={require('../../../../../../assets/img/Man.png')} style={styles.passengerAvatar} />
          </View>
        )}
        <View style={[styles.visibleContent, computedStyles.visibleContent]}>
          <Text style={[styles.visiblePickUpText, computedStyles.visiblePickUpText]}>
            {t('ride_Ride_Order_pickUpText')}
          </Text>
          <Text style={[computedStyles.passengerName, styles.visibleMiniPassengerName]}>
            {order.passenger.name} {order.passenger.lastName}
          </Text>
        </View>
        <View style={styles.visibleHeader}>
          <Text style={styles.address}>{tripPoints[0].address}</Text>
        </View>
        <View>
          {withGoogleMapButton && (
            <Pressable style={[styles.openOnGoogleMapButton, computedStyles.openOnGoogleMapButton]}>
              <ExternalMapIcon />
              <View style={styles.googleMapTextContainer}>
                <Text style={computedStyles.openOnText}>{t('ride_Ride_Order_openOnText')}</Text>
                <Text style={computedStyles.googleMapText}>{t('ride_Ride_Order_googleMapText')}</Text>
              </View>
            </Pressable>
          )}
        </View>
        <View style={styles.orderInfoContainer}>
          <View style={[styles.orderInfo, computedStyles.orderInfo]}>
            <Text style={[styles.orderTitle, computedStyles.orderTitle]}>{t('ride_Ride_Order_travelTimeTitle')}</Text>
            <Text style={[styles.orderValue, computedStyles.orderValue]}>
              {travelTime.hours ? t('ride_Ride_Order_travelTimeHours', { hours: travelTime.hours }) : null}
              {t('ride_Ride_Order_travelTimeMinutes', { minutes: travelTime.minutes })}
            </Text>
          </View>
          <View style={[styles.orderInfo, computedStyles.orderInfo]}>
            <Text style={[styles.orderTitle, computedStyles.orderTitle]}>{t('ride_Ride_Order_pricePerKmTitle')}</Text>
            <Text style={[styles.orderValue, computedStyles.orderValue]}>{order.pricePerKm}</Text>
          </View>
          <View style={[styles.orderInfo, computedStyles.orderInfo]}>
            <Text style={[styles.orderTitle, computedStyles.orderTitle]}>{t('ride_Ride_Order_priceTitle')}</Text>
            <Text style={[styles.orderValue, computedStyles.orderValue]}>{order.price}</Text>
          </View>
        </View>
        <View style={styles.bottomButtonsAndTimer}>
          <Button shape={ButtonShapes.Circle} mode={CircleButtonModes.Mode2} disableShadow>
            <PhoneIcon />
          </Button>
          <View style={styles.timerContainer}>
            <Shadow distance={25} style={styles.shadowStyle} startColor="#00000010" disabled={disabledShadow}>
              <Timer
                time={timeForTimer}
                isWaiting={isWaiting}
                sizeMode={TimerSizesModes.S}
                colorMode={timerColorMode}
                onAfterCountdownEnds={onAfterCountdownEnds}
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
                  >{`+ $${extraWaitingSum}`}</Text>
                </View>
              ))}
          </View>
          {/* TODO: Change empty container to the button when work with messenger */}
          <View style={styles.emptyContainer} />
          {/* <Button shape={ButtonShapes.Circle} mode={CircleButtonModes.Mode2} disableShadow>
            <ChatIcon />
          </Button> */}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  avatarContainer: {
    position: 'absolute',
    top: -70,
    alignSelf: 'center',
    padding: 4,
    borderRadius: 50,
  },
  passangerInfoWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  visibleTextWrapper: {
    flex: 1,
  },
  passengerAvatar: {
    width: 62,
    height: 62,
  },
  visibleHeader: {
    flexDirection: 'row',
    paddingTop: 8,
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
  address: {
    fontFamily: 'Inter Medium',
    flexShrink: 1,
    fontSize: 21,
    paddingHorizontal: 20,
    marginBottom: 24,
    textAlign: 'center',
  },
  visibleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  visiblePickUpText: {
    fontFamily: 'Inter Medium',
  },
  visibleMiniPassengerName: {
    fontSize: 14,
    fontFamily: 'Inter Bold',
  },
  orderInfoContainer: {
    flexDirection: 'row',
    zIndex: 1,
    gap: 4,
    marginBottom: 18,
  },
  orderInfo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
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
    justifyContent: 'center',
    alignItems: 'center',
    gap: 32,
  },
  shadowStyle: {
    borderRadius: 100,
  },
  timerStatusContainer: {
    alignSelf: 'center',
    bottom: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  timerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerStatusText: {
    fontFamily: 'Inter Medium',
    fontSize: 12,
  },
  emptyContainer: {
    width: 60,
    height: 60,
  },
});

export default AddressWithPassengerAndOrderInfo;
