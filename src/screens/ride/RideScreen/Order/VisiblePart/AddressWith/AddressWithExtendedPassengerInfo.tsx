import { Image, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';
import {
  ButtonV1,
  ButtonV1Modes,
  ButtonV1Shapes,
  ChatIcon,
  DropOffIcon,
  PickUpIcon,
  Text,
  useThemeV1,
} from 'shuttlex-integration';

import { OrderType, TripPoint } from '../../../../../../core/ride/redux/trip/types';

const constants = {
  buttonFadeAnimationDuration: 200,
  textLayoutAnimationDuration: 100,
};

const AddressWithExtendedPassengerInfo = ({
  order,
  tripPoints,
  withStopPoint = false,
  isOpened,
}: {
  order: OrderType;
  tripPoints: TripPoint[];
  withStopPoint?: boolean;
  isOpened: boolean;
}) => {
  const { colors } = useThemeV1();

  const computedStyles = StyleSheet.create({
    addressMini: {
      color: colors.textSecondaryColor,
    },
  });

  const numberOfLines = isOpened ? 2 : 1;

  const isPickUp = tripPoints.length === order.targetPointsPosition.length + 1;

  return (
    <View style={styles.passangerInfoWrapper}>
      <View style={styles.passangerInfoWithAvatar}>
        <ButtonV1 containerStyle={styles.passengerAvatarWrapper} shape={ButtonV1Shapes.Circle}>
          <Image style={styles.passengerAvatar} source={require('../../../../../../assets/img/Man.png')} />
        </ButtonV1>
        <Animated.View
          layout={LinearTransition.duration(constants.textLayoutAnimationDuration)}
          style={styles.visibleTextWrapper}
        >
          <Text style={styles.passangerInfoWithAvatarText}>
            {order.passenger.name} {order.passenger.lastName}
          </Text>
          <Animated.View
            layout={LinearTransition.duration(constants.textLayoutAnimationDuration)}
            style={styles.addressMiniWrapper}
          >
            {withStopPoint ? <PickUpIcon /> : <DropOffIcon />}
            <Text numberOfLines={numberOfLines} style={[styles.addressMini, computedStyles.addressMini]}>
              {tripPoints[0].address}
            </Text>
          </Animated.View>
          {(isPickUp || withStopPoint) && (
            <Animated.View
              layout={LinearTransition.duration(constants.textLayoutAnimationDuration)}
              style={[styles.addressMiniWrapper, styles.withoutMarginTop]}
            >
              <DropOffIcon />
              <Text numberOfLines={numberOfLines} style={[styles.addressMini, computedStyles.addressMini]}>
                {tripPoints[1].address}
              </Text>
            </Animated.View>
          )}
        </Animated.View>
      </View>
      {!isOpened && (
        <Animated.View
          entering={FadeIn.duration(constants.buttonFadeAnimationDuration)}
          exiting={FadeOut.duration(constants.buttonFadeAnimationDuration)}
        >
          <ButtonV1 mode={ButtonV1Modes.Mode3} style={styles.visibleButton}>
            <ChatIcon />
          </ButtonV1>
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
