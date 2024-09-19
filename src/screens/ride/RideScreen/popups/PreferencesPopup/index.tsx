import { useEffect, useRef } from 'react';
import { ListRenderItem, StyleSheet, View } from 'react-native';
import {
  Bar,
  BarModes,
  BottomWindowWithGesture,
  BottomWindowWithGestureRef,
  ProfileIconMini,
  RoundCheckIcon1,
  TariffsCarImage,
  Text,
  useTheme,
} from 'shuttlex-integration';

import { revertTariffFieldById } from '../../../../../core/contractor/redux';
import { TariffInfo } from '../../../../../core/contractor/redux/types';
import { useAppDispatch } from '../../../../../core/redux/hooks';
import HiddenPart from './HiddenPart';
import { PreferencesPopupProps } from './props';

// TODO: Add logic with preferences when work with it
// Uncomment it for working with preferences
// type PreferenceModeType = {
//   barMode?: BarModes;
//   pressable?: boolean;
// };

const TariffPreferencesPopup = ({ onClose, setIsPreferencesPopupVisible }: PreferencesPopupProps) => {
  const { colors } = useTheme();

  const bottomWindowRef = useRef<BottomWindowWithGestureRef>(null);

  const dispatch = useAppDispatch();

  // Uncomment if for working with preferences
  // const preferencesTexts = {
  //   CashPayment: 'ride_Ride_PreferencesPopup_cashPayment',
  //   CryptoPayment: 'ride_Ride_PreferencesPopup_cryptoPayment',
  // };

  useEffect(() => {
    bottomWindowRef.current?.openWindow();
  }, []);

  const onTariffPressHandler = (tariff: TariffInfo) => {
    if (!tariff.isPrimary) {
      dispatch(revertTariffFieldById({ tariffId: tariff.id, field: 'isSelected' }));
    }
  };

  const renderTariffs: ListRenderItem<TariffInfo> = ({ item, index }: { item: TariffInfo; index: number }) => {
    const isSelected = item.isSelected;
    const isAvailable = item.isAvailable;

    const computedStyles = StyleSheet.create({
      bar: {
        marginBottom: 0,
      },
      tariffInfo: {
        color: colors.textSecondaryColor,
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
          <TariffsCarImage tariff={item.name} style={styles.img} />
          <View>
            <Text>{item.name}</Text>
            <View style={styles.tariffInfoContainer}>
              <ProfileIconMini />
              {/* TODO: Add info about car seats when it state will be added */}
              <Text style={[styles.tariffInfo, computedStyles.tariffInfo]}>1-6</Text>
            </View>
          </View>
        </View>
        {isSelected && <RoundCheckIcon1 />}
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
      ref={bottomWindowRef}
      hiddenPart={<HiddenPart onClose={onClose} renderTariffs={renderTariffs} />}
    />
  );
};

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  preferenceContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  img: {
    marginRight: 24,
    width: 130,
  },
  tariffInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tariffInfo: {
    fontFamily: 'Inter Medium',
    fontSize: 14,
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
