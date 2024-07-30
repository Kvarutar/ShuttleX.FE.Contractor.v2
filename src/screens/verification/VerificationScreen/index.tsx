import { t } from 'i18next';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import {
  Bar,
  BarModes,
  BlueCheck1,
  RoundButton,
  RoundButtonMode,
  SafeAreaView,
  ShortArrowSmallIcon,
  sizes,
  Text,
  useTheme,
} from 'shuttlex-integration';

import { contractorZoneSelector, profileSelector } from '../../../core/contractor/redux/selectors';
import { VerificationScreenProps } from './props';

const VerificationScreen = ({ navigation }: VerificationScreenProps) => {
  const { colors } = useTheme();

  const profile = useSelector(profileSelector);

  const computedStyles = StyleSheet.create({
    description: {
      color: colors.textSecondaryColor,
    },
  });

  const isZoneSelected = useSelector(contractorZoneSelector) !== null;

  return (
    <SafeAreaView>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('verification_Verification_headerTitle')}</Text>
      </View>
      <Bar>
        <Text style={styles.title}>{t('verification_Verification_explanationTitle', { name: profile?.name })}</Text>
        <Text style={[styles.description, computedStyles.description]}>
          {t('verification_Verification_explanationDescription')}
        </Text>
      </Bar>
      <View style={styles.content}>
        <Pressable onPress={() => navigation.navigate('Zone')}>
          <Bar mode={isZoneSelected ? BarModes.Active : BarModes.Default} style={styles.bar}>
            <Text style={styles.contentText}>{t('verification_Verification_stepOne')}</Text>

            {isZoneSelected ? (
              <BlueCheck1 />
            ) : (
              <RoundButton roundButtonStyle={styles.roundButton} onPress={() => navigation.navigate('Zone')}>
                <ShortArrowSmallIcon />
              </RoundButton>
            )}
          </Bar>
        </Pressable>
        <Pressable onPress={() => navigation.navigate('Docs')}>
          <Bar mode={isZoneSelected ? BarModes.Default : BarModes.Disabled} style={styles.bar}>
            <Text style={styles.contentText}>{t('verification_Verification_stepTwo')}</Text>

            <RoundButton
              roundButtonStyle={styles.roundButton}
              mode={isZoneSelected ? RoundButtonMode.Active : RoundButtonMode.Disabled}
            >
              <ShortArrowSmallIcon />
            </RoundButton>
          </Bar>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 14,
    marginBottom: sizes.paddingVertical,
  },
  headerTitle: {
    fontFamily: 'Inter Medium',
    fontSize: 18,
  },
  headerDummy: {
    width: 50,
  },
  title: {
    fontFamily: 'Inter Medium',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
  roundButton: {
    height: 28,
    width: 28,
  },
  content: {
    marginTop: 40,
    gap: 16,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  contentText: {
    fontFamily: 'Inter Medium',
  },
});

export default VerificationScreen;
