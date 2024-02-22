import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import {
  Button,
  ButtonModes,
  ChatIcon,
  DropOffIcon,
  PickUpIcon,
  RoundButton,
  Text,
  useTheme,
} from 'shuttlex-integration';

import { OrderType } from '../../../../../../core/ride/redux/trip/types';

const buttonFadeAnimationDuration = 200;

const AddressWithExtendedPassengerInfo = ({
  order,
  tripPoints,
  withStopPoint = false,
  isOpened,
}: {
  order: OrderType;
  tripPoints: string[];
  withStopPoint?: boolean;
  isOpened: boolean;
}) => {
  const { colors } = useTheme();

  const computedStyles = StyleSheet.create({
    addressMini: {
      color: colors.textSecondaryColor,
    },
  });

  const numberOfLines = isOpened ? 2 : 1;

  return (
    <View style={styles.passangerInfoWrapper}>
      <View style={styles.passangerInfoWithAvatar}>
        <RoundButton roundButtonStyle={styles.passengerAvatarWrapper}>
          <Image style={styles.passengerAvatar} source={require('../../../../../../assets/img/Man.png')} />
        </RoundButton>
        <View style={styles.visibleTextWrapper}>
          <Text style={styles.passangerInfoWithAvatarText}>
            {order.passenger.name} {order.passenger.lastName}
          </Text>
          <View style={styles.addressMiniWrapper}>
            {withStopPoint ? <PickUpIcon /> : <DropOffIcon />}
            <Text numberOfLines={numberOfLines} style={[styles.addressMini, computedStyles.addressMini]}>
              {tripPoints[0]}
            </Text>
          </View>
          {withStopPoint && (
            <View style={[styles.addressMiniWrapper, styles.withoutMarginTop]}>
              <DropOffIcon />
              <Text numberOfLines={numberOfLines} style={[styles.addressMini, computedStyles.addressMini]}>
                {tripPoints[1]}
              </Text>
            </View>
          )}
        </View>
      </View>
      {!isOpened && (
        <Animated.View
          entering={FadeIn.duration(buttonFadeAnimationDuration)}
          exiting={FadeOut.duration(buttonFadeAnimationDuration)}
        >
          <Button mode={ButtonModes.Mode3} buttonStyle={styles.visibleButton}>
            <ChatIcon />
          </Button>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  passangerInfoWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  visibleTextWrapper: {
    flexShrink: 1,
  },
  visibleButton: {
    height: 52,
    width: 52,
  },
  passangerInfoWithAvatar: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    flexShrink: 1,
  },
  passangerInfoWithAvatarText: {
    fontFamily: 'Inter Medium',
  },
  passengerAvatarWrapper: {
    width: 61,
    height: 61,
    borderRadius: 100,
  },
  passengerAvatar: {
    width: 52,
    height: 52,
  },
  addressMini: {
    fontFamily: 'Inter Medium',
    fontSize: 12,
    flexShrink: 1,
  },
  addressMiniWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: -4,
    marginTop: 6,
  },
  withoutMarginTop: {
    marginTop: 0,
  },
});

export default AddressWithExtendedPassengerInfo;
