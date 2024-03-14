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

import { setPreferredTariffs } from '../../../../../core/redux/contractor';
import { preferredTariffsSelector, unavailableTariffsSelector } from '../../../../../core/redux/contractor/selectors';
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

    if (isPrefferedTariff) {
      tariffMode = tariffModes.preffered;
    } else if (isUnavailableTariff) {
      tariffMode = tariffModes.unavailable;
    }

    return (
      <Pressable key={index} onPress={() => tariffMode.onPressHandler?.(item)}>
        <Bar mode={tariffMode.barMode} style={styles.bar}>
          <View style={styles.preferenceContent}>
            <TariffsCarImage tariff={item} style={styles.img} />
            <Text>{item}</Text>
          </View>
          {isPrefferedTariff && <BlueCheck1 />}
        </Bar>
      </Pressable>
    );
  };

  const onConfirmHandler = () => {
    dispatch(setPreferredTariffs(selectedPrefferedTariffs));
    onClose();
  };

  return (
    <Popup onCloseButtonPress={onClose}>
      <View style={styles.preferenceWrapper}>
        <FlatListWithCustomScroll
          renderItem={renderTarifs}
          items={tariffs}
          contentContainerStyle={styles.contentContainerStyle}
          barStyle={styles.barStyle}
        />
        <Button
          text={t('ride_Ride_RidePreferences_confirmButton')}
          containerStyle={styles.button}
          onPress={onConfirmHandler}
        />
      </View>
    </Popup>
  );
};

const styles = StyleSheet.create({
  preferenceContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  barStyle: {
    top: 0,
  },
  preferenceWrapper: {
    maxHeight: windowHeight * 0.6,
    position: 'relative',
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
});

export default TariffPreferencesPopup;
