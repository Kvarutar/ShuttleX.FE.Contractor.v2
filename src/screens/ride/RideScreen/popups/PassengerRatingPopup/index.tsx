import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, View } from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import { useSelector } from 'react-redux';
import {
  BottomWindow,
  Button,
  ButtonShapes,
  ButtonSizes,
  CircleButtonModes,
  defaultShadow,
  DislikeIcon,
  LikeIcon,
  SquareButtonModes,
  Text,
  useTheme,
} from 'shuttlex-integration';

import { useAppDispatch } from '../../../../../core/redux/hooks';
import { endTrip } from '../../../../../core/ride/redux/trip';
import { orderSelector } from '../../../../../core/ride/redux/trip/selectors';
import { updatePassengerRating } from '../../../../../core/ride/redux/trip/thunks';
import { PassengerRate } from './props';

const PassengerRating = () => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const order = useSelector(orderSelector);

  const [passengerRate, setPassengerRate] = useState<PassengerRate>(null);

  const isPassengerLiked = passengerRate === 'like';
  const isPassengerDisilked = passengerRate === 'dislike';

  if (!order) {
    return;
  }

  const computedStyles = StyleSheet.create({
    subTitle: {
      color: colors.textQuadraticColor,
    },
    titleFirst: {
      color: colors.textPrimaryColor,
    },
    description: {
      color: colors.textSecondaryColor,
    },
    likeIcon: {
      color: isPassengerLiked ? colors.iconTertiaryColor : colors.iconPrimaryColor,
    },
    dislikeIcon: {
      color: isPassengerDisilked ? colors.iconTertiaryColor : colors.iconPrimaryColor,
    },
    avatarShadow: {
      backgroundColor: colors.backgroundPrimaryColor,
    },
  });

  //TODO: Add logic for sending data to backend with rate
  const onPressPassengerRate = (rate: PassengerRate) => {
    if (rate === passengerRate) {
      setPassengerRate(null);
    } else {
      setPassengerRate(rate);
    }
  };

  //TODO: Add logic for sending data to backend
  const onPressPaidViaCash = async () => {
    if (passengerRate) {
      await dispatch(updatePassengerRating({ orderId: order.id, rate: passengerRate === 'like' }));
    }
    dispatch(endTrip());
  };

  //TODO: Add logic for sending data to backend
  const onPressGetHelp = () => {
    dispatch(endTrip());
  };

  return (
    <BottomWindow windowStyle={styles.windowStyle} withShade>
      <View>
        <Text style={[styles.titleFirst, computedStyles.titleFirst]}>
          {t('ride_Ride_PassengerRatingPopup_title', { name: order?.passenger.name })}
        </Text>
        <Text style={[styles.description, computedStyles.description]}>
          {t('ride_Ride_PassengerRatingPopup_description', { name: order?.passenger.name })}
        </Text>

        <View style={styles.avatarAndButtonsContainer}>
          <Button
            shape={ButtonShapes.Circle}
            mode={isPassengerDisilked ? CircleButtonModes.Mode3 : CircleButtonModes.Mode2}
            size={ButtonSizes.M}
            disableShadow
            onPress={() => onPressPassengerRate('dislike')}
          >
            <DislikeIcon color={computedStyles.dislikeIcon.color} style={styles.dislikeIcon} />
          </Button>
          <Shadow
            {...defaultShadow(colors.strongShadowColor)}
            style={[styles.avatarShadow, computedStyles.avatarShadow]}
          >
            {order.passenger.avatarURL !== '' ? (
              <Image
                style={styles.avatar}
                source={{
                  uri: order.passenger.avatarURL,
                }}
              />
            ) : (
              <Image style={styles.avatar} source={require('../../../../../assets/img/DefaultAvatar.png')} />
            )}
          </Shadow>
          <Button
            shape={ButtonShapes.Circle}
            mode={isPassengerLiked ? CircleButtonModes.Mode5 : CircleButtonModes.Mode2}
            size={ButtonSizes.M}
            disableShadow
            onPress={() => onPressPassengerRate('like')}
          >
            <LikeIcon color={computedStyles.likeIcon.color} style={styles.likeIcon} />
          </Button>
        </View>
      </View>
      <View style={styles.buttonsContainer}>
        <Button
          text={t('ride_Ride_PassengerRatingPopup_confirmButton')}
          textStyle={styles.buttonText}
          containerStyle={styles.button}
          onPress={onPressPaidViaCash}
        />
        <Button
          text={t('ride_Ride_PassengerRatingPopup_getHelpButton')}
          textStyle={styles.buttonText}
          containerStyle={styles.button}
          mode={SquareButtonModes.Mode5}
          onPress={onPressGetHelp}
        />
      </View>
    </BottomWindow>
  );
};

const styles = StyleSheet.create({
  windowStyle: {
    justifyContent: 'space-between',
    paddingVertical: 0,
    paddingTop: 56,
    paddingBottom: 36,
  },
  titleFirst: {
    fontFamily: 'Inter Bold',
    fontSize: 34,
    letterSpacing: -1.53,
    lineHeight: 34,
    marginBottom: 19,
  },
  description: {
    fontSize: 16,
    lineHeight: 20,
    marginBottom: 36,
  },
  avatarAndButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 47,
    paddingBottom: 46,
  },
  dislikeIcon: {
    width: 23,
    height: 23,
  },
  avatarShadow: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    height: 92,
    width: 92,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 100,
  },
  likeIcon: {
    width: 20,
    height: 20,
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 6,
  },
  buttonText: {
    fontSize: 17,
  },
  button: {
    flex: 1,
  },
});

export default PassengerRating;
