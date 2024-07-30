import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, Pressable, SafeAreaView, StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import {
  Bar,
  BarModes,
  Button,
  FlatListWithCustomScroll,
  RoundButton,
  ShortArrowIcon,
  ShortArrowSmallIcon,
  sizes,
  Text,
  useTheme,
} from 'shuttlex-integration';

import { setContractorZone } from '../../../core/contractor/redux';
import { useAppDispatch } from '../../../core/redux/hooks';
import { zones } from './mockData';
import { ZoneScreenProps } from './props';

//TODO: Back button not work, fix it
//TODO: Form of send zones not work, fix it

const ZoneScreen = ({ navigation }: ZoneScreenProps): JSX.Element => {
  const { colors } = useTheme();

  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const [data, setData] = useState(zones);
  const [zone, setZone] = useState('');

  const computedStyles = StyleSheet.create({
    wrapper: {
      backgroundColor: colors.backgroundPrimaryColor,
    },
    container: {
      paddingVertical: Platform.OS === 'android' ? sizes.paddingVertical : 0,
    },
    signUpLabel: {
      color: colors.primaryColor,
    },
    placeholderZone: {
      color: colors.textSecondaryColor,
    },
  });

  const isLastZone = data.length === 0;

  const onSubmit = () => {
    dispatch(setContractorZone(zone));
    navigation.navigate('Verification');
  };

  //TODO: add type to zone items
  // @ts-expect-error Parameter 'item' implicitly has an 'any' type.ts(7006)
  const renderItem = ({ item }) => (
    <Pressable style={styles.zoneList} key={item.id}>
      <Bar mode={BarModes.Active} style={styles.zoneListBar}>
        <Text style={styles.zoneBodyText}>{item.name}</Text>

        <RoundButton
          onPress={() => {
            setData(item.next);
            setZone(item.name);
          }}
          roundButtonStyle={styles.zoneRoundButton}
        >
          <ShortArrowSmallIcon />
        </RoundButton>
      </Bar>
    </Pressable>
  );

  return (
    <SafeAreaView style={[styles.wrapper, computedStyles.wrapper]}>
      <View style={[styles.container, computedStyles.container]}>
        <View style={styles.zoneWrapper}>
          <View style={styles.zoneHeader}>
            <RoundButton onPress={navigation.goBack}>
              <ShortArrowIcon />
            </RoundButton>
            <Text style={styles.headerTitle}>{t('verification_Zone_headerTitle')}</Text>
          </View>
          <View style={styles.zoneBody}>
            <Text style={styles.zoneBodyText}>{t('verification_Zone_selectAreaDescription')}</Text>
            <Bar style={styles.zoneBodyTextInput}>
              <Text style={zone === '' ? computedStyles.placeholderZone : {}}>
                {zone ?? t('auth_Zone_textInputPlaceholder')}
              </Text>
            </Bar>

            <Text style={styles.zoneBodyText}>{t('verification_Zone_zoneListDescription')}</Text>

            <FlatListWithCustomScroll items={data} renderItem={renderItem} withShadow />
          </View>
        </View>
        {isLastZone && (
          <Animated.View entering={FadeIn.duration(200)}>
            <Button text={t('verification_Zone_buttonNext')} style={styles.zoneButton} onPress={onSubmit} />
          </Animated.View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: sizes.paddingHorizontal,
    justifyContent: 'space-between',
  },
  zoneWrapper: {
    flex: 1,
  },
  zoneHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 80,
    marginBottom: 32,
  },
  headerTitle: {
    fontFamily: 'Inter Medium',
    fontSize: 18,
  },
  zoneBody: {
    marginTop: 30,
    flex: 1,
  },
  zoneBodyText: {
    fontFamily: 'Inter Medium',
  },
  zoneBodyTextInput: {
    marginTop: 26,
    marginBottom: 26,
  },
  zoneList: {
    marginTop: 28,
  },
  zoneListBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 30,
    paddingRight: 15,
    paddingVertical: 15,
  },
  zoneRoundButton: {
    height: 28,
    width: 28,
  },
  zoneButton: {
    marginTop: 20,
  },
});

export default ZoneScreen;
