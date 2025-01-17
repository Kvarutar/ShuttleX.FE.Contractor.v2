import { useTranslation } from 'react-i18next';
import { Linking, Platform, StyleSheet, View } from 'react-native';
import { BigHeader, BottomWindowWithGesture, Button, ButtonShapes, SquareButtonModes } from 'shuttlex-integration';

import { logger } from '../../../../../App';
import { AccountIsNotActivePopupModes, AccountIsNotActivePopupProps } from './types';

const osMode = Platform.OS === 'ios' ? 'Ios' : 'Android';

const textModeData = {
  firstUse: {
    description: 'ride_Ride_Start_accountIsNotActiveFirstUseDescription',
    firstButton: 'ride_Ride_Start_accountIsNotActiveFirstUseFirstButton',
    secondButton: 'ride_Ride_Start_accountIsNotActiveFirstUseSecondButton',
  },
  confirm: {
    //TODO change description to new version
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

  const onPressFirstButton = () => {
    Linking.openURL(mode === 'afterUse' ? 'https://t.me/ShuttleX_Support' : 'https://www.shuttlex.com').catch(
      logger.error,
    );
    setIsAccountIsNotActivePopupVisible(false);
  };

  const onPressSecondButton = () => {
    if (mode === 'firstUse') {
      onPressLaterHandler?.();
    }
    if (mode === 'afterUse' && Platform.OS === 'android') {
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
            description={t(textModeData[mode].description)}
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
