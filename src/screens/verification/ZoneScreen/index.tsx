import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, StyleSheet, View } from 'react-native';
import {
  BarModes,
  BottomWindowWithGesture,
  Button,
  ButtonShapes,
  CircleButtonModes,
  FlatListWithCustomScroll,
  SafeAreaView,
  ShortArrowIcon,
  SquareButtonModes,
  TextInput,
  useTheme,
} from 'shuttlex-integration';

import { setContractorZone } from '../../../core/contractor/redux';
import { useAppDispatch } from '../../../core/redux/hooks';
import VerificationHeader from '../VerificationScreen/VerificationHeader';
import VerificationStepBar from '../VerificationScreen/VerificationStepBar';
import { zoneData } from './mockData';
import { Zone, ZoneScreenProps } from './props';

const ZoneScreen = ({ navigation }: ZoneScreenProps): JSX.Element => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const dispatch = useAppDispatch();

  const [isVisiblePropositionWindow, setIsVisiblePropositionWindow] = useState(false);
  const [propositionCity, setPropositionCity] = useState('');
  const [zone, setZone] = useState('');
  const [data, setData] = useState(zoneData);

  const isLastZone = data[0].next.length === 0;

  const onSubmit = () => {
    dispatch(setContractorZone(zone));
    navigation.navigate('Verification');
  };

  const handlePressOnZone = (item: Zone) => {
    if (isLastZone) {
      setZone(item.name);
      return;
    }
    setData(item.next);
  };

  const onPropositionButtonPress = () => {
    Alert.alert(t('verification_Zone_alertTitle'), t('verification_Zone_alertMessage'));
    setIsVisiblePropositionWindow(false);
  };

  const computedStyles = StyleSheet.create({
    propositionButton: {
      backgroundColor: colors.backgroundPrimaryColor,
      borderColor: colors.borderColor,
    },
    propositionButtonText: {
      color: colors.textSecondaryColor,
    },
  });

  const HiddenPart = (
    <>
      <VerificationHeader
        containerStyle={styles.propositionVerificationHeader}
        windowTitle={t('verification_Zone_propositionHeaderTitle')}
        firstHeaderTitle={t('verification_Zone_propositionExplanationFirstTitle')}
        secondHeaderTitle={t('verification_Zone_propositionExplanationSecondTitle')}
        description={t('verification_Zone_propositionExplanationDescription')}
      />
      <TextInput
        onChangeText={setPropositionCity}
        value={propositionCity}
        placeholder={t('verification_Zone_propositionInputPlaceholder')}
      />
      <Button
        text={t('verification_Zone_propositionButton')}
        style={styles.propositionCompleteButton}
        textStyle={styles.buttonText}
        onPress={onPropositionButtonPress}
      />
    </>
  );

  const renderItem = ({ item }: { item: Zone }) => (
    <VerificationStepBar
      text={item.name}
      isSelected={zone === item.name}
      onPress={() => handlePressOnZone(item)}
      barMode={BarModes.Default}
    />
  );

  return (
    <SafeAreaView>
      <Button onPress={navigation.goBack} shape={ButtonShapes.Circle} mode={CircleButtonModes.Mode2}>
        <ShortArrowIcon />
      </Button>
      <VerificationHeader
        containerStyle={styles.verificationHeader}
        windowTitle={t('verification_Zone_headerTitle')}
        firstHeaderTitle={t('verification_Zone_explanationFirstTitle')}
        secondHeaderTitle={t('verification_Zone_explanationSecondTitle')}
        description={t('verification_Zone_explanationDescription')}
      />

      <View style={styles.zoneBody}>
        <FlatListWithCustomScroll
          withScroll={true}
          contentContainerStyle={styles.zoneList}
          items={data}
          renderItem={renderItem}
          withShadow
        />
      </View>

      <Button
        text={t('verification_Zone_buttonProposition')}
        style={[styles.propositionButton, computedStyles.propositionButton]}
        mode={SquareButtonModes.Mode5}
        textStyle={[styles.propositionButtonText, computedStyles.propositionButtonText]}
        onPress={() => setIsVisiblePropositionWindow(true)}
      />
      <Button
        disabled={!zone}
        text={t('verification_Zone_buttonNext')}
        style={styles.nextButton}
        mode={!zone ? SquareButtonModes.Mode5 : SquareButtonModes.Mode1}
        textStyle={styles.buttonText}
        onPress={onSubmit}
      />
      {isVisiblePropositionWindow && (
        <BottomWindowWithGesture withShade opened={isVisiblePropositionWindow} hiddenPart={HiddenPart} />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  verificationHeader: {
    marginTop: 18,
  },
  propositionVerificationHeader: {
    marginTop: 18,
    marginBottom: 20,
  },
  propositionCompleteButton: {
    marginTop: 100,
  },
  zoneBody: {
    flex: 1,
    marginTop: 40,
  },
  zoneList: {
    gap: 8,
  },
  propositionButtonText: {
    fontFamily: 'Inter Medium',
    fontSize: 17,
  },
  propositionButton: {
    borderWidth: 1,
    marginTop: 20,
  },
  nextButton: {
    marginTop: 8,
  },
  buttonText: {
    fontSize: 17,
  },
});

export default ZoneScreen;
