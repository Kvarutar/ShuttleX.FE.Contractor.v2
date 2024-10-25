import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import {
  KeyboardState,
  useAnimatedKeyboard,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {
  BottomWindowWithGesture,
  BottomWindowWithGestureRef,
  Button,
  Text,
  TextInput,
  useTheme,
} from 'shuttlex-integration';

import { sendCryptoEmailOrBinanceId } from '../../../../../core/menu/redux/wallet/thunks';
import { useAppDispatch } from '../../../../../core/redux/hooks';
import { AddCryptoMethodPopupProps } from './types';

const keyboardAnimationDuration = {
  opening: 25,
  closing: 300,
};

const AddCryptoMethodPopup = ({ setIsAddCryptoMethodPopupVisible }: AddCryptoMethodPopupProps) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const dispatch = useAppDispatch();

  const bottomWindowRef = useRef<BottomWindowWithGestureRef>(null);

  const [inputText, setInputText] = useState<string>('');

  const keyboard = useAnimatedKeyboard();

  const bottomWindowMargin = useSharedValue(0);

  // TODO: Move logic for lifting elements to BottomWindowWithGesture component in Task-260: https://github.com/DevShuttleXInc/ShuttleX.FE.Contractor.v2/pull/165
  useDerivedValue(() => {
    // Added a "keyboard.state.value === KeyboardState.OPEN" condition, because in some cases keyboard state miss "OPENING" state and just move to "OPEN" (found only here)
    if (keyboard.state.value === KeyboardState.OPENING || keyboard.state.value === KeyboardState.OPEN) {
      bottomWindowMargin.value = withTiming(keyboard.height.value - 20, {
        duration: keyboardAnimationDuration.opening,
      });
    }
    if (keyboard.state.value === KeyboardState.CLOSING) {
      bottomWindowMargin.value = withTiming(0, { duration: keyboardAnimationDuration.closing });
    }
  });

  const bottomWindowAnimatedStyle = useAnimatedStyle(() => ({
    bottom: bottomWindowMargin.value,
  }));

  const computedStyles = StyleSheet.create({
    firstTitle: {
      color: colors.textPrimaryColor,
    },
    secondTitle: {
      color: colors.textQuadraticColor,
    },
  });

  // TODO: Remove mock response on thunk and add processing
  const onSave = async () => {
    await dispatch(sendCryptoEmailOrBinanceId({ emailOrBinanceId: inputText }));
    bottomWindowRef.current?.closeWindow();
    setIsAddCryptoMethodPopupVisible(false);
  };

  return (
    <BottomWindowWithGesture
      containerStyle={bottomWindowAnimatedStyle}
      opened
      withShade
      setIsOpened={setIsAddCryptoMethodPopupVisible}
      hiddenPartContainerStyle={styles.bottomWindowStyle}
      hiddenPart={
        <View>
          <View style={styles.titlesContainer}>
            <Text style={[styles.titleText, computedStyles.firstTitle]}>
              {t('menu_AddCryptoMethodPopup_firstTitle')}
            </Text>
            <Text style={[styles.titleText, computedStyles.secondTitle]}>
              {t('menu_AddCryptoMethodPopup_secondTitle')}
            </Text>
          </View>
          <TextInput
            containerStyle={styles.inputContainerStyle}
            placeholder={t('menu_AddCryptoMethodPopup_inputPlaceholder')}
            value={inputText}
            onChangeText={setInputText}
          />
          <Button text={t('menu_AddCryptoMethodPopup_saveButton')} onPress={onSave} />
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  bottomWindowStyle: {
    paddingTop: 28,
  },
  titlesContainer: {
    marginBottom: 26,
  },
  titleText: {
    fontFamily: 'Inter Bold',
    fontSize: 34,
    letterSpacing: -1.53,
    lineHeight: 34,
  },
  inputContainerStyle: {
    marginBottom: 174,
  },
});

export default AddCryptoMethodPopup;
