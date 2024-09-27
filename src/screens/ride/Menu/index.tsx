import { useNavigationState } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { Bar, BarModes, LevelIcon, MenuBase, MenuNavigation, Text, useTheme } from 'shuttlex-integration';

import { extendedProfileSelector } from '../../../core/contractor/redux/selectors';
import { MenuProps } from './props';

const Menu = ({ onClose, navigation }: MenuProps) => {
  const { t } = useTranslation();

  const profile = useSelector(extendedProfileSelector);

  const currentRoute = useNavigationState(state => state.routes[state.index].name);

  const menuNavigation: MenuNavigation = {
    statistics: {
      navFunc: () => {
        navigation.navigate('Ride');
        //TODO Create statistics page
        onClose();
      },
      title: t('ride_Menu_navigationStatistics'),
    },
    subscription: {
      navFunc: () => {
        navigation.navigate('Ride');
        //TODO Create subscription page
        onClose();
      },
      title: t('ride_Menu_navigationSubscription'),
    },
    wallet: {
      navFunc: () => {
        navigation.navigate('Wallet');
        onClose();
      },
      title: t('ride_Menu_navigationWallet'),
    },
    settings: {
      navFunc: () => {
        navigation.navigate('Ride');
        //TODO Create settings page
        onClose();
      },
      title: t('ride_Menu_navigationAccountSettings'),
    },
    help: {
      navFunc: () => {
        navigation.navigate('Ride');
        //TODO Create help page
        onClose();
      },
      title: t('ride_Menu_navigationHelp'),
    },
  };

  return (
    <MenuBase
      onClose={onClose}
      additionalContent={<AdditionalContent />}
      userImageUri={profile?.profileImageUri ?? undefined}
      userName={profile?.name}
      userSurname={profile?.surname}
      menuNavigation={menuNavigation}
      currentRoute={currentRoute}
      label={<LevelLabel />}
    />
  );
};
const LevelLabel = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();

  const computedStyles = StyleSheet.create({
    label: {
      borderColor: colors.backgroundSecondaryColor,
      backgroundColor: colors.backgroundPrimaryColor,
    },
  });
  return (
    <View style={[styles.label, computedStyles.label]}>
      <LevelIcon />
      <Text style={[styles.labelText, { color: colors.textQuadraticColor }]}>{t('ride_Menu_level', { level: 4 })}</Text>
    </View>
  );
};
const AdditionalContent = () => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const computedStyles = {
    balanceTitle: {
      color: colors.textQuadraticColor,
    },
  };

  return (
    <View style={styles.balance}>
      <Bar mode={BarModes.Disabled} style={styles.textWrapper}>
        <Text style={[styles.balanceTitle, computedStyles.balanceTitle]}>{t('ride_Menu_additionalEarned')}</Text>
        {/* TODO: create logic for it (from where will we get the balance) */}
        <Text style={styles.balanceTotal}>$682.40</Text>
      </Bar>
      <Bar mode={BarModes.Disabled} style={styles.textWrapper}>
        <Text style={[styles.balanceTitle, computedStyles.balanceTitle]}>{t('ride_Menu_additionalPrevious')}</Text>
        <Text style={styles.balanceTotal}>$12.10</Text>
      </Bar>
    </View>
  );
};

const styles = StyleSheet.create({
  labelText: {
    fontSize: 14,
    fontFamily: 'Inter Medium',
  },
  label: {
    borderWidth: 1,
    gap: 7,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingLeft: 10,
    paddingRight: 20,
    borderRadius: 10,
  },
  balance: {
    flexDirection: 'row',
    gap: 4,
    borderWidth: 0,
    justifyContent: 'space-between',
  },
  balanceTitle: {
    fontSize: 14,
    flexShrink: 1,
  },
  balanceTotal: {
    fontFamily: 'Inter Medium',
    fontSize: 18,
  },
  textWrapper: {
    flex: 1,
    paddingBottom: 19,
    paddingTop: 16,
    alignItems: 'center',
  },
});

export default Menu;
