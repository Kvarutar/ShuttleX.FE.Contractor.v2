import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { Button, FlatListWithCustomScroll, Skeleton, Text, useTheme, WINDOW_HEIGHT } from 'shuttlex-integration';

import { contractorInfoSelector, isTariffsInfoLoadingSelector } from '../../../../../core/contractor/redux/selectors';
import { sendSelectedTariffs } from '../../../../../core/contractor/redux/thunks';
import { useAppDispatch } from '../../../../../core/redux/hooks';
import { HiddenPartProps } from './props';

const HiddenPart = ({ onClose, renderTariffs, localTariffsSorted }: HiddenPartProps) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const dispatch = useAppDispatch();
  const localSelectedTariffs = localTariffsSorted.filter(localTariff => localTariff.isSelected);
  const contractorInfo = useSelector(contractorInfoSelector);
  const isTariffsInfoLoading = useSelector(isTariffsInfoLoadingSelector);

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
      maxHeight: WINDOW_HEIGHT * 0.2,
    },
    preferencesTitle: {
      color: colors.textSecondaryColor,
    },
    hiddenPartContainerStyle: {
      height: WINDOW_HEIGHT * 0.9,
    },
  });

  return (
    <View style={[styles.hiddenPartContainerStyle, computedStyles.hiddenPartContainerStyle]}>
      <Text style={[styles.filterText, computedStyles.filterText]}>{t('ride_Ride_PreferencesPopup_filter')}</Text>
      <Text style={styles.firstTitleText}>{t('ride_Ride_PreferencesPopup_firstTitle')}</Text>
      <Text style={[styles.secondTitleText, computedStyles.secondTitleText]}>
        {t('ride_Ride_PreferencesPopup_secondTitle')}
      </Text>
      <Text style={[styles.tariffsText, computedStyles.tariffsText]}>{t('ride_Ride_PreferencesPopup_tariffs')}</Text>
      {isTariffsInfoLoading ? (
        <FlatListWithCustomScroll
          wrapperStyle={styles.flatListWrapper}
          contentContainerStyle={styles.flatListContentContainer}
          renderItem={() => <Skeleton skeletonContainerStyle={styles.skeletonContainer} />}
          items={Array.from({ length: 8 })}
        />
      ) : (
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
  skeletonTariffsWrapper: {
    flex: 1,
    flexShrink: 1,
    gap: 8,
  },
  skeletonContainer: {
    height: 80,
    borderRadius: 12,
  },
  hiddenPartContainerStyle: {
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
