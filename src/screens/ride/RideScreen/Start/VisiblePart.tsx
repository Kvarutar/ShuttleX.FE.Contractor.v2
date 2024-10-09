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
  useTariffsIcons,
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
  const tariffsIconsData = useTariffsIcons();

  const contractorStatus = useSelector(contractorStatusSelector);
  const tariffs = useSelector(tariffsSelector);
  const primaryTariff: TariffInfo = useSelector(primaryTariffSelector) || tariffs[0];

  const IconComponent = tariffsIconsData[primaryTariff?.name]?.icon;

  const contractorStatusIsOffline = contractorStatus === 'offline';

  const computedStyles = StyleSheet.create({
    headerWrapper: {
      paddingLeft: sizes.paddingHorizontal + 6,
    },
    statusText: {
      color: colors.textPrimaryColor,
    },
  });

  if (isOpened) {
    return (
      <Animated.View entering={FadeIn.duration(animationDuration)}>
        <View style={styles.bigCarImageContainer}>
          <IconComponent style={styles.bigCarImage} />
        </View>
      </Animated.View>
    );
  }

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
  //TODO: Check image sizes on smaller and bigger devices
  bigCarImageContainer: {
    position: 'absolute',
    top: -100,
    width: '75%',
    height: 130,
    alignSelf: 'center',
  },
  bigCarImage: {
    width: '100%',
    aspectRatio: 2.5,
    height: undefined,
    resizeMode: 'contain',
  },
  card: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  startStopButton: {
    paddingHorizontal: 16,
  },
});

export default VisiblePart;
