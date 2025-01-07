import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import {
  BarModes,
  Button,
  ButtonShapes,
  CircleButtonModes,
  FlatListWithCustomScroll,
  SafeAreaView,
  ShortArrowIcon,
  SquareButtonModes,
} from 'shuttlex-integration';

import { zonesSelector } from '../../../core/auth/redux/docs/selectors';
import { fetchDocsTemplates } from '../../../core/auth/redux/docs/thunks';
import { ZoneAPIResponse } from '../../../core/auth/redux/docs/types';
import { useAppDispatch } from '../../../core/redux/hooks';
import { RootStackParamList } from '../../../Navigate/props';
import VerificationHeader from '../VerificationScreen/VerificationHeader';
import VerificationStepBar from '../VerificationScreen/VerificationStepBar';

const getTopLevelZones = (zones: ZoneAPIResponse[]): ZoneAPIResponse[] =>
  zones.filter(zone => zone.parentZoneId === null);

const ZoneScreen = (): JSX.Element => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Zone'>>();

  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const allZones = useSelector(zonesSelector);

  const [currentZones, setCurrentZones] = useState<ZoneAPIResponse[]>([]);
  const [zoneToSelect, setZoneToSelect] = useState<ZoneAPIResponse | null>(null);

  useEffect(() => {
    setCurrentZones(getTopLevelZones(allZones));
  }, [allZones]);

  const onSubmit = () => {
    if (zoneToSelect) {
      dispatch(fetchDocsTemplates(zoneToSelect.id));
    }
    navigation.navigate('Verification');
  };

  const handlePressOnZone = (zone: ZoneAPIResponse) => {
    if (zoneToSelect?.id === zone.id) {
      setZoneToSelect(null);
      return;
    }
    const childZones = allZones.filter(tmZone => zone.childZoneIds?.includes(tmZone.id));

    if (childZones.length === 0) {
      setZoneToSelect(zone);
      return;
    }

    setCurrentZones(childZones);
  };

  const handleBackPress = () => {
    if (currentZones[0].parentZoneId) {
      setCurrentZones(getTopLevelZones(allZones));
    } else {
      navigation.goBack();
    }
  };

  // TODO: Will be added in the future
  // const onPropositionButtonPress = () => {
  //   Alert.alert(t('verification_Zone_alertTitle'), t('verification_Zone_alertMessage'));
  //   setIsVisiblePropositionWindow(false);
  // };
  // const computedStyles = StyleSheet.create({
  //   propositionButton: {
  //     backgroundColor: colors.backgroundPrimaryColor,
  //     borderColor: colors.borderColor,
  //   },
  //   propositionButtonText: {
  //     color: colors.textSecondaryColor,
  //   },
  // });
  // const HiddenPart = (
  //   <>
  //     <VerificationHeader
  //       containerStyle={styles.propositionVerificationHeader}
  //       windowTitle={t('verification_Zone_propositionHeaderTitle')}
  //       firstHeaderTitle={t('verification_Zone_propositionExplanationFirstTitle')}
  //       secondHeaderTitle={t('verification_Zone_propositionExplanationSecondTitle')}
  //       description={t('verification_Zone_propositionExplanationDescription')}
  //     />
  //     <TextInput
  //       onChangeText={setPropositionCity}
  //       value={propositionCity}
  //       placeholder={t('verification_Zone_propositionInputPlaceholder')}
  //     />
  //     <Button
  //       text={t('verification_Zone_propositionButton')}
  //       style={styles.propositionCompleteButton}
  //       textStyle={styles.buttonText}
  //       onPress={onPropositionButtonPress}
  //     />
  //   </>
  // );

  const renderItem = ({ item }: { item: ZoneAPIResponse }) => (
    <VerificationStepBar
      text={item.name ?? ''}
      isSelected={zoneToSelect?.id === item.id}
      onPress={() => handlePressOnZone(item)}
      barMode={BarModes.Default}
    />
  );

  return (
    <SafeAreaView>
      <Button onPress={handleBackPress} shape={ButtonShapes.Circle} mode={CircleButtonModes.Mode2}>
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
          items={currentZones}
          renderItem={renderItem}
          withShadow
        />
      </View>
      <Button
        disabled={!zoneToSelect}
        text={t('verification_Zone_buttonNext')}
        style={styles.nextButton}
        mode={!zoneToSelect ? SquareButtonModes.Mode5 : SquareButtonModes.Mode1}
        textStyle={styles.buttonText}
        onPress={onSubmit}
      />

      {/*  TODO: Will be added in the future*/}
      {/*<Button*/}
      {/*  text={t('verification_Zone_buttonProposition')}*/}
      {/*  style={[styles.propositionButton, computedStyles.propositionButton]}*/}
      {/*  mode={SquareButtonModes.Mode5}*/}
      {/*  textStyle={[styles.propositionButtonText, computedStyles.propositionButtonText]}*/}
      {/*  onPress={() => setIsVisiblePropositionWindow(true)}*/}
      {/*/>*/}
      {/*{isVisiblePropositionWindow && (*/}
      {/*  <BottomWindowWithGesture withShade opened={isVisiblePropositionWindow} hiddenPart={HiddenPart} />*/}
      {/*)}*/}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  verificationHeader: {
    marginTop: 18,
  },
  zoneBody: {
    flex: 1,
    marginTop: 40,
  },
  zoneList: {
    gap: 8,
  },
  nextButton: {
    marginTop: 8,
  },
  buttonText: {
    fontSize: 17,
  },
  // TODO: Will be added in the future
  // propositionVerificationHeader: {
  //   marginTop: 18,
  //   marginBottom: 20,
  // },
  // propositionCompleteButton: {
  //   marginTop: 100,
  // },
  // propositionButtonText: {
  //   fontFamily: 'Inter Medium',
  //   fontSize: 17,
  // },
  // propositionButton: {
  //   borderWidth: 1,
  //   marginTop: 20,
  // },
});

export default ZoneScreen;
