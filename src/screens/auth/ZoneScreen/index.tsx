import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Platform, Pressable, SafeAreaView, StyleSheet, View } from 'react-native';
import {
  Bar,
  BarModes,
  Button,
  RoundButton,
  ShortArrowIcon,
  ShortArrowSmallIcon,
  sizes,
  Text,
  TextInput,
  useTheme,
} from 'shuttlex-integration';

import { zones } from './mockData';
import { ZoneScreenProps } from './props';

//TODO: Back button not work, fix it
//TODO: Form of send zones not work, fix it

const ZoneScreen = ({ navigation }: ZoneScreenProps): JSX.Element => {
  const { colors } = useTheme();

  const { t } = useTranslation();

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
  });

  return (
    <SafeAreaView style={[styles.wrapper, computedStyles.wrapper]}>
      <View style={[styles.container, computedStyles.container]}>
        <View>
          <View style={styles.zoneHeader}>
            <RoundButton onPress={() => navigation.goBack}>
              <ShortArrowIcon />
            </RoundButton>
            <Text style={styles.zoneHeaderTitleText}>{t('auth_Zone_headerTitle')}</Text>
          </View>
          <View style={styles.zoneBody}>
            <Text style={styles.zoneBodyText}>{t('auth_Zone_selectAreaDescription')}</Text>

            <TextInput
              style={styles.zoneBodyTextInput}
              placeholder={t('auth_Zone_textInputPlaceholder')}
              value={zone}
            />

            <Text style={styles.zoneBodyText}>{t('auth_Zone_zoneListDescription')}</Text>

            <FlatList
              data={data}
              renderItem={({ item }) => (
                <Pressable style={styles.zoneList}>
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
              )}
              keyExtractor={item => item.id}
            />
          </View>
        </View>
        <Button text={t('auth_Zone_buttonNext')} onPress={() => navigation.navigate('SignUpPhoneCode')} />
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
  zoneHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 80,
    marginBottom: 32,
  },
  zoneHeaderTitleText: {
    fontFamily: 'Inter Medium',
  },
  zoneBody: {
    marginTop: 30,
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
});

export default ZoneScreen;
