import { Image, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { DropOffIcon, PickUpIcon, Text, useTheme } from 'shuttlex-integration';

import { orderSelector } from '../../../../../../core/ride/redux/trip/selectors';

const AddressWithExtendedPassengerInfo = ({
  tripPoints,
  withStopPoint = false,
}: {
  tripPoints: string[];
  withStopPoint?: boolean;
}) => {
  const { colors } = useTheme();

  const order = useSelector(orderSelector);

  if (!order) {
    return;
  }

  const computedStyles = StyleSheet.create({
    addressMini: {
      color: colors.textSecondaryColor,
    },
  });

  const isPickUp = tripPoints.length === order.stopPoints.length + 1;

  return (
    <View style={styles.passangerInfoWrapper}>
      <View style={styles.passangerInfoWithAvatar}>
        <Image style={styles.passengerAvatar} source={require('../../../../../../assets/img/Man.png')} />
        <View style={styles.visibleTextWrapper}>
          <Text style={styles.passangerInfoWithAvatarText}>{order.passenger.name}</Text>
          <View style={styles.addressMiniWrapper}>
            {withStopPoint ? <PickUpIcon /> : <DropOffIcon />}
            <Text style={[styles.addressMini, computedStyles.addressMini]}>{tripPoints[0]}</Text>
          </View>
          {(isPickUp || withStopPoint) && (
            <View style={[styles.addressMiniWrapper, styles.withoutMarginTop]}>
              <DropOffIcon />
              <Text style={[styles.addressMini, computedStyles.addressMini]}>{tripPoints[1]}</Text>
            </View>
          )}
        </View>
      </View>
      {/* TODO: Add this component when work with chat */}
      {/* {!isOpened && (
        <Animated.View
          entering={FadeIn.duration(constants.buttonFadeAnimationDuration)}
          exiting={FadeOut.duration(constants.buttonFadeAnimationDuration)}
        >
          <Button mode={SquareButtonModes.Mode3} style={styles.visibleButton}>
            <ChatIcon />
          </Button>
        </Animated.View>
      )} */}
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
