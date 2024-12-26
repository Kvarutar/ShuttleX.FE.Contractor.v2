import { useTranslation } from 'react-i18next';
import { Linking, StyleSheet, View } from 'react-native';
import { BigHeader, BottomWindowWithGesture, Button, ButtonShapes, SquareButtonModes } from 'shuttlex-integration';

import { logger } from '../../../../../App';
import { AccountIsNotActivePopupProps } from './types';

const AccountIsNotActivePopup = ({ setIsAccountIsNotActivePopupVisible }: AccountIsNotActivePopupProps) => {
  const { t } = useTranslation();

  const onPressConfirm = () => {
    Linking.openURL('https://www.shuttlex.com').catch(err => logger.error(err));
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
            windowTitle={t('ride_Ride_Start_accountIsNotActiveSubtitle')}
            firstHeaderTitle={t('ride_Ride_Start_accountIsNotActiveTitle')}
            secondHeaderTitle={t('ride_Ride_Start_accountIsNotActiveSecondTitle')}
            description={t('ride_Ride_Start_accountIsNotActiveDescription')}
          />
          <View style={styles.popupButtonWrapper}>
            <Button
              shape={ButtonShapes.Square}
              containerStyle={styles.popupButton}
              text={t('ride_Ride_Start_accountIsNotActiveFirstButton')}
              onPress={onPressConfirm}
            />
            <Button
              containerStyle={styles.popupButton}
              shape={ButtonShapes.Square}
              mode={SquareButtonModes.Mode2}
              text={t('ride_Ride_Start_accountIsNotActiveSecondButton')}
              onPress={() => setIsAccountIsNotActivePopupVisible(false)}
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
