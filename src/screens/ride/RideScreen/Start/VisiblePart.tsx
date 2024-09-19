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
  TariffsCarImage,
  Text,
  useTheme,
} from 'shuttlex-integration';

import {
  contractorStatusSelector,
  primaryTariffSelector,
  tariffsSelector,
} from '../../../../core/contractor/redux/selectors';
import { TariffInfo } from '../../../../core/contractor/redux/types';
import TariffsCarousel from '../TariffsCarousel';
import { VisiblePartProps } from './props';

const animationDuration = 200;

const VisiblePart = ({ isOpened, bottomWindowRef, setIsPreferencesPopupVisible, lineState }: VisiblePartProps) => {
  const { t } = useTranslation();
  const { colors } = useTheme();

  const contractorStatus = useSelector(contractorStatusSelector);
  const tariffs = useSelector(tariffsSelector);
  const primaryTariff: TariffInfo = useSelector(primaryTariffSelector) || tariffs[0];

  const contractorStatusIsOffline = contractorStatus === 'offline';

  const computedStyles = StyleSheet.create({
    title: {
      color: colors.textPrimaryColor,
    },
    onlineStatusText: {
      color: colors.textSecondaryColor,
    },
  });

  if (isOpened) {
    return (
      <Animated.View entering={FadeIn.duration(animationDuration)}>
        <View style={styles.tariffsCarImageContainer}>
          <TariffsCarImage tariff={primaryTariff.name} style={styles.bigCarImage} />
        </View>
      </Animated.View>
    );
  }

  if (contractorStatusIsOffline) {
    return (
      <Animated.View entering={FadeIn.duration(animationDuration)} exiting={FadeOut.duration(animationDuration)}>
        <View style={styles.offlineInfoWrapper}>
          <View>
            <Text style={[computedStyles.title, styles.title]}>{lineState.bottomTitle}</Text>
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
          containerStyle={styles.offlineStartStopButton}
        />
      </Animated.View>
    );
  }

  return (
    <Animated.View entering={FadeIn.duration(animationDuration)} exiting={FadeOut.duration(animationDuration)}>
      <View style={styles.onlineInfoWrapper}>
        <View style={styles.onlineCarImageContainer}>
          <TariffsCarImage tariff={primaryTariff.name} style={styles.miniCarImage} />
        </View>
        <Text style={styles.onlineBasicTariffText}>{t(primaryTariff.name)}</Text>
        <View style={styles.onlinePreferencesButtonContainer}>
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
      </View>
      <Text style={[computedStyles.onlineStatusText, styles.onlineStatusText]}>
        {t('ride_Ride_BottomWindow_onlineTitle')}
      </Text>
      {/* //TODO: Add a component which render "remains to work" time  */}
      <Button
        text={lineState.buttonText}
        mode={lineState.buttonMode}
        onPress={() => bottomWindowRef.current?.openWindow()}
        containerStyle={styles.onlineStartStopButton}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  onlineStatusText: {
    fontFamily: 'Inter Medium',
    alignSelf: 'center',
    marginBottom: 12,
  },
  tariffsCarImageContainer: {
    paddingHorizontal: 16,
    position: 'absolute',
    top: -130,
    width: '100%',
    height: 200,
  },
  miniCarImage: {
    width: '100%',
    height: 36,
  },
  bigCarImage: {
    width: '100%',
    height: 120,
    marginBottom: 24,
  },
  offlineInfoWrapper: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 28,
    paddingHorizontal: 24,
  },
  onlineInfoWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 24,
    gap: 12,
  },
  onlineCarImageContainer: {
    flex: 1,
  },
  onlineBasicTariffText: {
    flex: 1,
    textAlign: 'center',
    fontFamily: 'Inter Medium',
  },
  onlinePreferencesButtonContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  title: {
    fontFamily: 'Inter Medium',
    fontSize: 18,
    textAlign: 'center',
  },
  card: {
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
  },
  offlineStartStopButton: {
    paddingHorizontal: 24,
  },
  onlineStartStopButton: {
    paddingHorizontal: 24,
  },
});

export default VisiblePart;
