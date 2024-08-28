import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';
import {
  ButtonV1,
  ButtonV1Modes,
  ChatIcon,
  DropOffIcon,
  PassengerIcon,
  PickUpIcon,
  Text,
  useTheme,
} from 'shuttlex-integration';

import { OrderType, TripPoint } from '../../../../../../core/ride/redux/trip/types';

const constants = {
  buttonFadeAnimationDuration: 200,
  textLayoutAnimationDuration: 100,
};

const AddressWithPassengerInfo = ({
  tripPoints,
  order,
  withStopPoint = false,
  isOpened,
}: {
  tripPoints: TripPoint[];
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
      <Animated.View
        layout={LinearTransition.duration(constants.textLayoutAnimationDuration)}
        style={styles.visibleTextWrapper}
      >
        <Animated.View
          layout={LinearTransition.duration(constants.textLayoutAnimationDuration)}
          style={styles.visibleHeader}
        >
          <PickUpIcon />
          <Text numberOfLines={numberOfLines} style={styles.address}>
            {tripPoints[0].address}
          </Text>
        </Animated.View>
        {withStopPoint && (
          <Animated.View
            layout={LinearTransition.duration(constants.textLayoutAnimationDuration)}
            style={[styles.visibleHeader, styles.secondPoint]}
          >
            <DropOffIcon />
            <Text numberOfLines={numberOfLines} style={styles.address}>
              {tripPoints[1].address}
            </Text>
          </Animated.View>
        )}
        <View style={styles.visibleContentWithoutGap}>
          <PassengerIcon />
          <Text style={[computedStyles.passengerName, styles.visibleMiniPassengerName]}>
            {order.passenger.name} {order.passenger.lastName}
          </Text>
        </View>
      </Animated.View>
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
