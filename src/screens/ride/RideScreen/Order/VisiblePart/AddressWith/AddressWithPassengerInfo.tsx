import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import {
  Button,
  ButtonModes,
  ChatIcon,
  DropOffIcon,
  PassengerIcon,
  PickUpIcon,
  Text,
  useTheme,
} from 'shuttlex-integration';

import { OrderType } from '../../../../../../core/ride/redux/trip/types';

const buttonFadeAnimationDuration = 200;

const AddressWithPassengerInfo = ({
  tripPoints,
  order,
  withStopPoint = false,
  isOpened,
}: {
  tripPoints: string[];
  order: OrderType;
  withStopPoint?: boolean;
  isOpened: boolean;
}) => {
  const { colors } = useTheme();

  const computedStyles = StyleSheet.create({
    passengerName: {
      color: colors.textSecondaryColor,
    },
  });

  const numberOfLines = isOpened ? 2 : 1;

  return (
    <View style={styles.passangerInfoWrapper}>
      <View style={styles.visibleTextWrapper}>
        <View style={styles.visibleHeader}>
          <PickUpIcon />
          <Text numberOfLines={numberOfLines} style={styles.address}>
            {tripPoints[0]}
          </Text>
        </View>
        {withStopPoint && (
          <View style={[styles.visibleHeader, styles.secondPoint]}>
            <DropOffIcon />
            <Text numberOfLines={numberOfLines} style={styles.address}>
              {tripPoints[1]}
            </Text>
          </View>
        )}
        <View style={styles.visibleContentWithoutGap}>
          <PassengerIcon />
          <Text style={[computedStyles.passengerName, styles.visibleMiniPassengerName]}>
            {order.passenger.name} {order.passenger.lastName}
          </Text>
        </View>
      </View>
      {!isOpened && (
        <Animated.View
          entering={FadeIn.duration(buttonFadeAnimationDuration)}
          exiting={FadeOut.duration(buttonFadeAnimationDuration)}
        >
          <Button mode={ButtonModes.Mode3} style={styles.visibleButton}>
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
  visibleHeader: {
    flexDirection: 'row',
  },
  address: {
    fontFamily: 'Inter Medium',
    flexShrink: 1,
  },
  secondPoint: {
    marginTop: 6,
  },
  visibleContentWithoutGap: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
    marginLeft: 4,
  },
  visibleMiniPassengerName: {
    fontSize: 14,
    marginLeft: 2,
  },
  visibleButton: {
    height: 52,
    width: 52,
  },
});

export default AddressWithPassengerInfo;
