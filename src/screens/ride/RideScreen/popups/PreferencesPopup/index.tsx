import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, ListRenderItem, Pressable, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import {
  Bar,
  BarModes,
  BlueCheck1,
  Button,
  FlatListWithCustomScroll,
  Popup,
  TariffsCarImage,
  TariffType,
  Text,
} from 'shuttlex-integration';

import { preferredTariffsSelector, unavailableTariffsSelector } from '../../../../../core/redux/contractor/selectors';
import { sendSelectedTariffs } from '../../../../../core/redux/contractor/thunks';
import { useAppDispatch } from '../../../../../core/redux/hooks';
import { PreferencesPopupProps } from './props';

const windowHeight = Dimensions.get('window').height;

type TariffModeType = {
  barMode: BarModes;
  onPressHandler?: (tariff: TariffType) => void;
};

const tariffs = ['BasicX', 'BasicXL', 'ComfortX', 'PremiumX', 'PremiumXL', 'TeslaX'];

const TariffPreferencesPopup = ({ onClose }: PreferencesPopupProps) => {
  const dispatch = useAppDispatch();
  const unavailableTariffs = useSelector(unavailableTariffsSelector);
  const { t } = useTranslation();

  const [selectedPrefferedTariffs, setSelectedPrefferedTariffs] = useState<TariffType[]>([
    ...useSelector(preferredTariffsSelector),
  ]);

  const onPressHandler = (tariff: TariffType) => {
    setSelectedPrefferedTariffs(prev => {
      let temp = [...prev];

      if (temp.indexOf(tariff) === -1) {
        temp.push(tariff);
      } else {
        temp = temp.filter(el => el !== tariff);
      }

      return temp;
    });
  };

  const renderTarifs: ListRenderItem<TariffType> = ({ item, index }: { item: TariffType; index: number }) => {
    const tariffModes: Record<any, TariffModeType> = {
      preffered: {
        barMode: BarModes.Active,
        onPressHandler: onPressHandler,
      },
      unavailable: {
        barMode: BarModes.Disabled,
      },
      default: {
        barMode: BarModes.Default,
        onPressHandler: onPressHandler,
      },
    };

    const isPrefferedTariff = selectedPrefferedTariffs.includes(item);
    const isUnavailableTariff = unavailableTariffs.includes(item);

    let tariffMode = tariffModes.default;

    const computedStyles = StyleSheet.create({
      bar: {
        marginBottom: 0,
      },
    });

    if (isPrefferedTariff) {
      tariffMode = tariffModes.preffered;
      computedStyles.bar = {
        marginBottom: 2,
      };
    } else if (isUnavailableTariff) {
      tariffMode = tariffModes.unavailable;
      computedStyles.bar = {
        marginBottom: 2,
      };
    }

    return (
      <Pressable key={index} onPress={() => tariffMode.onPressHandler?.(item)}>
        <Bar mode={tariffMode.barMode} style={[styles.bar, computedStyles.bar]}>
          <View style={styles.preferenceContent}>
            <TariffsCarImage tariff={item} style={styles.img} />
            <Text>{item}</Text>
          </View>
          {isPrefferedTariff && <BlueCheck1 />}
        </Bar>
      </Pressable>
    );
  };

  const onConfirmHandler = async () => {
    await dispatch(sendSelectedTariffs(selectedPrefferedTariffs));
    onClose();
  };

  return (
    <Popup bottomWindowStyle={styles.popup} onCloseButtonPress={onClose}>
      <FlatListWithCustomScroll
        wrapperStyle={styles.flatListWrapper}
        contentContainerStyle={styles.contentContainerStyle}
        renderItem={renderTarifs}
        items={tariffs}
      />
      <Button
        text={t('ride_Ride_RidePreferences_confirmButton')}
        containerStyle={styles.button}
        onPress={onConfirmHandler}
      />
    </Popup>
  );
};

const styles = StyleSheet.create({
  preferenceContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  popup: {
    maxHeight: windowHeight * 0.7,
  },
  barStyle: {
    top: 0,
  },
  bar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  img: {
    marginRight: 24,
  },
  contentContainerStyle: {
    gap: 16,
  },
  button: {
    marginTop: 30,
  },
  flatListWrapper: {
    flex: 0,
    flexShrink: 1,
  },
});

export default TariffPreferencesPopup;
