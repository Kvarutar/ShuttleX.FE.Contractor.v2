import { useTranslation } from 'react-i18next';
import { Dimensions, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { Button, FlatListWithCustomScroll, Text, useTheme } from 'shuttlex-integration';

import { contractorInfoSelector } from '../../../../../core/contractor/redux/selectors';
import { sendSelectedTariffs } from '../../../../../core/contractor/redux/thunks';
import { useAppDispatch } from '../../../../../core/redux/hooks';
import { HiddenPartProps } from './props';

const windowHeight = Dimensions.get('window').height;

const HiddenPart = ({ onClose, renderTariffs, isTariffsLoaded, localTariffsSorted }: HiddenPartProps) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const dispatch = useAppDispatch();
  const localSelectedTariffs = localTariffsSorted.filter(localTariff => localTariff.isSelected);
  const contractorInfo = useSelector(contractorInfoSelector);

  //TODO: Uncomment this constant when we need to add preferences
  // const preferences = useSelector(preferencesSelector);
  // const selectedPreferences = useSelector(selectedPreferencesSelector);

  const onConfirmHandler = async () => {
    await dispatch(sendSelectedTariffs({ selectedTariffs: localSelectedTariffs, contractorId: contractorInfo.id }));
    // await dispatch(sendSelectedPreferences({ selectedPreferences, contractorId }));
    onClose();
  };

  const computedStyles = StyleSheet.create({
    filterText: {
      color: colors.textTitleColor,
    },
    secondTitleText: {
      color: colors.textQuadraticColor,
    },
    tariffsText: {
      color: colors.textSecondaryColor,
    },
    preferencesContainer: {
      backgroundColor: colors.backgroundPrimaryColor,
    },
    preferencesTitle: {
      color: colors.textSecondaryColor,
    },
  });

  return (
    <View style={styles.hiddenPartContainerStyle}>
      <Text style={[styles.filterText, computedStyles.filterText]}>{t('ride_Ride_PreferencesPopup_filter')}</Text>
      <Text style={styles.firstTitleText}>{t('ride_Ride_PreferencesPopup_firstTitle')}</Text>
      <Text style={[styles.secondTitleText, computedStyles.secondTitleText]}>
        {t('ride_Ride_PreferencesPopup_secondTitle')}
      </Text>
      <Text style={[styles.tariffsText, computedStyles.tariffsText]}>{t('ride_Ride_PreferencesPopup_tariffs')}</Text>
      {/* TODO: Rewtire with skeletons */}
      {isTariffsLoaded && (
        <FlatListWithCustomScroll
          wrapperStyle={styles.flatListWrapper}
          contentContainerStyle={styles.flatListContentContainer}
          renderItem={renderTariffs}
          items={localTariffsSorted}
        />
      )}
      {/* TODO: Uncomment these components when we need to add preferences */}
      {/* <View style={[styles.preferencesContainer, computedStyles.preferencesContainer]}>
        <Text style={[styles.preferencesTitle, computedStyles.preferencesTitle]}>
          {t('ride_Ride_PreferencesPopup_preferences')}
        </Text>
        <FlatListWithCustomScroll
          wrapperStyle={styles.flatListWrapper}
          contentContainerStyle={styles.flatListContentContainer}
          renderItem={renderPreferences}
          items={preferences}
        />
      </View> */}
      <Button
        text={t('ride_Ride_PreferencesPopup_confirmButton')}
        containerStyle={styles.button}
        onPress={onConfirmHandler}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  hiddenPartContainerStyle: {
    height: windowHeight * 0.9,
    paddingBottom: 34,
  },
  filterText: {
    paddingTop: 12,
    fontFamily: 'Inter Bold',
    fontSize: 14,
    marginBottom: 12,
  },
  firstTitleText: {
    fontFamily: 'Inter Bold',
    fontSize: 34,
    lineHeight: 34,
    letterSpacing: -1.53,
  },
  secondTitleText: {
    fontFamily: 'Inter Bold',
    fontSize: 34,
    marginBottom: 24,
    lineHeight: 34,
    letterSpacing: -1.53,
  },
  tariffsText: {
    fontFamily: 'Inter Medium',
    fontSize: 14,
    marginBottom: 12,
  },
  // These styles for preferences
  preferencesContainer: {
    paddingTop: 22,
    maxHeight: windowHeight * 0.2,
  },
  preferencesTitle: {
    fontFamily: 'Inter Medium',
    fontSize: 14,
    marginBottom: 22,
  },
  flatListContentContainer: {
    gap: 8,
  },
  button: {
    marginTop: 30,
  },
  flatListWrapper: {
    flex: 1,
    flexShrink: 1,
  },
});

export default HiddenPart;
