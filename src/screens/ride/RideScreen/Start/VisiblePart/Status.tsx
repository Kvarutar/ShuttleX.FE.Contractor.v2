import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useSelector } from 'react-redux';
import {
  Button,
  ButtonShapes,
  ButtonSizes,
  CircleButtonModes,
  PreferencesIcon,
  sizes,
  Text,
  useTheme,
} from 'shuttlex-integration';

import { contractorStatusSelector } from '../../../../../core/contractor/redux/selectors';
import TariffsCarousel from '../../TariffsCarousel';
import { StatusProps } from './types';

const animationDuration = 200;

const Status = ({ bottomWindowRef, setIsPreferencesPopupVisible, lineState }: StatusProps) => {
  const { t } = useTranslation();
  const { colors } = useTheme();

  const contractorStatus = useSelector(contractorStatusSelector);

  const contractorStatusIsOffline = contractorStatus === 'offline';

  const computedStyles = StyleSheet.create({
    headerWrapper: {
      paddingLeft: sizes.paddingHorizontal + 6,
    },
    statusText: {
      color: colors.textPrimaryColor,
    },
  });

  if (contractorStatusIsOffline) {
    return (
      <Animated.View entering={FadeIn.duration(animationDuration)} exiting={FadeOut.duration(animationDuration)}>
        <View style={[styles.headerWrapper, computedStyles.headerWrapper]}>
          <View>
            <Text style={[computedStyles.statusText, styles.statusText]}>{lineState.bottomTitle}</Text>
          </View>
          <Button
            shape={ButtonShapes.Circle}
            size={ButtonSizes.S}
            mode={CircleButtonModes.Mode2}
            disableShadow
            onPress={() => setIsPreferencesPopupVisible(true)}
          >
            <PreferencesIcon />
          </Button>
        </View>
        <View style={styles.card}>
          <TariffsCarousel />
        </View>
        <Button
          text={lineState.buttonText}
          mode={lineState.buttonMode}
          onPress={() => bottomWindowRef.current?.openWindow()}
          containerStyle={styles.startStopButton}
        />
      </Animated.View>
    );
  }

  return (
    <Animated.View entering={FadeIn.duration(animationDuration)} exiting={FadeOut.duration(animationDuration)}>
      <View style={[styles.headerWrapper, computedStyles.headerWrapper]}>
        <Text style={[computedStyles.statusText, styles.statusText]}>{t('ride_Ride_BottomWindow_onlineTitle')}</Text>
        <Button
          shape={ButtonShapes.Circle}
          size={ButtonSizes.S}
          mode={CircleButtonModes.Mode2}
          disableShadow
          onPress={() => setIsPreferencesPopupVisible(true)}
        >
          <PreferencesIcon />
        </Button>
      </View>
      <View style={styles.card}>
        <TariffsCarousel />
      </View>
      {/* //TODO: Add a component which render "remains to work" time  */}
      <Button
        text={lineState.buttonText}
        mode={lineState.buttonMode}
        onPress={() => bottomWindowRef.current?.openWindow()}
        containerStyle={styles.startStopButton}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  headerWrapper: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 22,
    paddingTop: 18,
    paddingRight: sizes.paddingHorizontal,
  },
  statusText: {
    alignSelf: 'center',
    fontFamily: 'Inter Medium',
    fontSize: 21,
    lineHeight: 22,
    opacity: 0.6,
  },
  card: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  startStopButton: {
    paddingHorizontal: 16,
    marginBottom: sizes.paddingVertical,
  },
});

export default Status;
