import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { Linking, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import {
  BigHeader,
  BottomWindowWithGesture,
  Button,
  ButtonShapes,
  getCurrencySign,
  IS_ANDROID,
  IS_IOS,
  SquareButtonModes,
} from 'shuttlex-integration';
import { CurrencyType } from 'shuttlex-integration/lib/typescript/src/utils/currency/types';

import { logger } from '../../../../../App';
import { subscriptionsSelector } from '../../../../../core/menu/redux/subscription/selectors';
import { RootStackParamList } from '../../../../../Navigate/props';
import { AccountIsNotActivePopupModes, AccountIsNotActivePopupProps } from './types';

const osMode = IS_IOS ? 'Ios' : 'Android';

const textModeData = {
  firstUse: {
    description: 'ride_Ride_Start_accountIsNotActiveFirstUseDescription',
    firstButton: 'ride_Ride_Start_accountIsNotActiveFirstUseFirstButton',
    secondButton: 'ride_Ride_Start_accountIsNotActiveFirstUseSecondButton',
  },
  confirm: {
    description: 'ride_Ride_Start_accountIsNotActiveConfirmDescription',
    firstButton: 'ride_Ride_Start_accountIsNotActiveConfirmFirstButton',
    secondButton: 'ride_Ride_Start_accountIsNotActiveConfirmSecondButton',
  },
  afterUse: {
    description: `ride_Ride_Start_accountIsNotActiveAfterUseDescription${osMode}`,
    firstButton: 'ride_Ride_Start_accountIsNotActiveAfterUseFirstButton',
    secondButton: `ride_Ride_Start_accountIsNotActiveAfterUseSecondButton${osMode}`,
  },
};

const AccountIsNotActivePopup = ({
  setIsAccountIsNotActivePopupVisible,
  onPressLaterHandler,
  mode = AccountIsNotActivePopupModes.FirstUse,
}: AccountIsNotActivePopupProps) => {
  const { t } = useTranslation();
  const subscriptions = useSelector(subscriptionsSelector);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const debtPrice = () => {
    const debtSub = subscriptions.find(sub => sub.subscriptionType === 'Debt');

    return debtSub ? `${getCurrencySign(debtSub.currency as CurrencyType)}${debtSub.amount}` : '';
  };

  const onPressFirstButton = () => {
    if (mode === 'afterUse') {
      Linking.openURL('https://t.me/ShuttleX_Support').catch(logger.error);
    } else {
      if (IS_IOS) {
        navigation.navigate('Subscription');
      } else {
        Linking.openURL('https://www.shuttlex.com/contractor.html').catch(logger.error);
      }
    }
    setIsAccountIsNotActivePopupVisible(false);
  };

  const onPressSecondButton = () => {
    if (mode === 'firstUse') {
      onPressLaterHandler?.();
    }
    if (mode === 'afterUse' && IS_ANDROID) {
      Linking.openURL('https://www.shuttlex.com/contractor.html').catch(logger.error);
    }
    setIsAccountIsNotActivePopupVisible(false);
  };

  return (
    <BottomWindowWithGesture
      withShade
      opened
      setIsOpened={setIsAccountIsNotActivePopupVisible}
      hiddenPart={
        <View>
          <BigHeader
            windowTitle={t(`ride_Ride_Start_accountIsNotActiveSubtitle${osMode}`)}
            firstHeaderTitle={t('ride_Ride_Start_accountIsNotActiveTitle')}
            secondHeaderTitle={t('ride_Ride_Start_accountIsNotActiveSecondTitle')}
            description={t(textModeData[mode].description, { debtPrice: debtPrice() })}
          />
          <View style={styles.popupButtonWrapper}>
            <Button
              shape={ButtonShapes.Square}
              containerStyle={styles.popupButton}
              text={t(textModeData[mode].firstButton)}
              onPress={onPressFirstButton}
            />
            <Button
              containerStyle={styles.popupButton}
              shape={ButtonShapes.Square}
              mode={SquareButtonModes.Mode2}
              text={t(textModeData[mode].secondButton)}
              onPress={onPressSecondButton}
            />
          </View>
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  popupButton: {
    flex: 1,
  },
  popupButtonWrapper: {
    marginTop: 76,
    gap: 8,
    flexDirection: 'row',
  },
});

export default AccountIsNotActivePopup;
