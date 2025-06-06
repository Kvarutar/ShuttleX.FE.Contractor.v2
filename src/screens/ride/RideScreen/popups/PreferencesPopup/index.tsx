import { useEffect, useState } from 'react';
import { ListRenderItem, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import {
  BaggageIcon,
  Bar,
  BarModes,
  BottomWindowWithGesture,
  ProfileIconMini,
  RoundCheckIcon3,
  Text,
  useTariffsIcons,
  useTheme,
} from 'shuttlex-integration';

import { sortedTariffsSelector } from '../../../../../core/contractor/redux/selectors';
import { TariffInfoFromAPI } from '../../../../../core/contractor/redux/types';
import HiddenPart from './HiddenPart';
import { PreferencesPopupProps } from './props';

const formatSeatsAmount = (value: number) => {
  if (value === 1) {
    return '1';
  }
  return `1-${value}`;
};

// TODO: Add logic with preferences when work with it
// Uncomment it for working with preferences
// type PreferenceModeType = {
//   barMode?: BarModes;
//   pressable?: boolean;
// };

const TariffPreferencesPopup = ({
  onClose,
  setIsPreferencesPopupVisible,
  preferencesBottomWindowRef,
}: PreferencesPopupProps) => {
  const { colors } = useTheme();
  const tariffsIconsData = useTariffsIcons();

  const tariffsSorted = useSelector(sortedTariffsSelector);
  const [localTariffsSorted, setLocalTariffsSorted] = useState<TariffInfoFromAPI[]>(tariffsSorted);

  // Uncomment if for working with preferences
  // const preferencesTexts = {
  //   CashPayment: 'ride_Ride_PreferencesPopup_cashPayment',
  //   CryptoPayment: 'ride_Ride_PreferencesPopup_cryptoPayment',
  // };

  useEffect(() => {
    preferencesBottomWindowRef.current?.openWindow();
  }, [preferencesBottomWindowRef]);

  useEffect(() => {
    setLocalTariffsSorted(tariffsSorted);
  }, [tariffsSorted]);

  const onTariffPressHandler = (tariff: TariffInfoFromAPI) => {
    if (!tariff.isPrimary) {
      setLocalTariffsSorted(prevState =>
        prevState.map(t => (t.id === tariff.id ? { ...t, isSelected: !t.isSelected } : t)),
      );
    }
  };

  const renderTariffs: ListRenderItem<TariffInfoFromAPI> = ({
    item,
    index,
  }: {
    item: TariffInfoFromAPI;
    index: number;
  }) => {
    const IconComponent = tariffsIconsData[item.name].icon;

    const isSelected = item.isSelected;
    const isAvailable = item.isAvailable;

    const computedStyles = StyleSheet.create({
      bar: {
        marginBottom: 0,
      },
      tariffInfoText: {
        color: colors.textQuadraticColor,
      },
      roundCheckIcon: {
        borderColor: colors.borderColor,
      },
      roundCheckIconColors: {
        backgroundColor: colors.backgroundPrimaryColor,
      },
    });

    return (
      <Bar
        mode={isAvailable ? BarModes.Active : BarModes.Disabled}
        style={[styles.bar, computedStyles.bar]}
        key={index}
        onPress={() => (isAvailable ? onTariffPressHandler(item) : {})}
      >
        <View style={styles.preferenceContent}>
          <IconComponent style={styles.tariffImage} />
          <View style={styles.tariffInfoAndCheckIconContainer}>
            <View style={styles.tariffTitleAndInfoContainer}>
              <Text style={styles.itemTitle}>{tariffsIconsData[item.name].text}</Text>
              <View style={styles.tariffInfoContainer}>
                <View style={styles.tariffSeatsAndBaggageContainer}>
                  <ProfileIconMini />
                  <Text style={[styles.tariffInfoText, computedStyles.tariffInfoText]}>
                    {formatSeatsAmount(item.maxSeatsCount)}
                  </Text>
                </View>
                <View style={styles.tariffSeatsAndBaggageContainer}>
                  <BaggageIcon />
                  <Text style={[styles.tariffInfoText, computedStyles.tariffInfoText]}>{item.maxLuggagesCount}</Text>
                </View>
              </View>
            </View>
            {isSelected ? (
              <View style={styles.roundCheckIconContainer}>
                <RoundCheckIcon3 />
              </View>
            ) : (
              isAvailable && (
                <View style={styles.roundCheckIconContainer}>
                  <View style={[styles.roundCheckIcon, computedStyles.roundCheckIcon]}>
                    <RoundCheckIcon3 outerColor={computedStyles.roundCheckIconColors.backgroundColor} />
                  </View>
                </View>
              )
            )}
          </View>
        </View>
      </Bar>
    );
  };
  // Uncomment this function for working with preferences
  // const onPressPreferencesHandler = (preference: PreferenceInfo) => {
  //   dispatch(revertPreferenceFieldById({ preferenceId: preference.id, field: 'isSelected' }));
  // };

  // const renderPreferences: ListRenderItem<PreferenceInfo> = ({
  //   item,
  //   index,
  // }: {
  //   item: PreferenceInfo;
  //   index: number;
  // }) => {
  //   const preferenceModes: Record<any, PreferenceModeType> = {
  //     preffered: {
  //       barMode: BarModes.Active,
  //       pressable: true,
  //     },
  //     unavailable: {
  //       barMode: BarModes.Disabled,
  //     },
  //     default: {
  //       pressable: true,
  //     },
  //   };

  //   const isSelected = item.isSelected;
  //   const isUnavailable = !item.isAvailable;

  //   let preferenceMode = preferenceModes.default;

  //   const computedStyles = StyleSheet.create({
  //     bar: {
  //       marginBottom: 0,
  //     },
  //     tariffInfo: {
  //       color: colors.textSecondaryColor,
  //     },
  //     plusIcon: {
  //       color: colors.iconPrimaryColor,
  //     },
  //   });

  //   if (isSelected) {
  //     preferenceMode = preferenceModes.preffered;
  //   } else if (isUnavailable) {
  //     preferenceMode = preferenceModes.unavailable;
  //   }

  //   return (
  //     <Bar
  //       mode={preferenceMode.barMode}
  //       style={[styles.bar, computedStyles.bar]}
  //       key={index}
  //       onPress={() => (preferenceMode.pressable ? onPressPreferencesHandler(item) : {})}
  //     >
  //       <View style={styles.preferenceContent}>
  //         <Text style={styles.preferencesText}>{t(preferencesTexts[item.name])}</Text>
  //       </View>
  //       {isSelected && <RoundCheckIcon1 />}
  //       {isUnavailable && (
  //         <Pressable style={styles.plusIconContainer}>
  //           <PlusIcon style={styles.plusIcon} color={computedStyles.plusIcon.color} />
  //         </Pressable>
  //       )}
  //     </Bar>
  //   );
  // };

  return (
    <BottomWindowWithGesture
      withHiddenPartScroll={false}
      setIsOpened={setIsPreferencesPopupVisible}
      ref={preferencesBottomWindowRef}
      hiddenPart={
        <HiddenPart onClose={onClose} renderTariffs={renderTariffs} localTariffsSorted={localTariffsSorted} />
      }
    />
  );
};

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 17,
    paddingHorizontal: 16,
  },
  preferenceContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 23,
  },
  tariffImage: {
    width: undefined,
    height: 45,
    aspectRatio: 2.5,
    resizeMode: 'contain',
  },
  tariffInfoAndCheckIconContainer: {
    flex: 2,
    flexDirection: 'row',
  },
  tariffTitleAndInfoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  itemTitle: {
    fontFamily: 'Inter Medium',
    fontSize: 17,
    lineHeight: 22,
    marginBottom: 8,
  },
  tariffInfoContainer: {
    flexDirection: 'row',
    gap: 14,
  },
  tariffSeatsAndBaggageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tariffInfoText: {
    fontFamily: 'Inter Medium',
    fontSize: 14,
    lineHeight: 22,
  },
  roundCheckIconContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  roundCheckIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 36,
    height: 36,
    borderWidth: 1,
    borderRadius: 100,
  },
  preferencesText: {
    paddingVertical: 12,
  },
  plusIconContainer: {
    backgroundColor: 'white',
    width: 18,
    height: 18,
    borderRadius: 100,
    marginHorizontal: 8,
    padding: 4,
  },
  plusIcon: {
    height: '100%',
    width: '100%',
  },
});

export default TariffPreferencesPopup;
