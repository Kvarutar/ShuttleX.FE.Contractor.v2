import { useNavigationState } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { Bar, MenuBase, MenuNavigation, Separator, Text, useTheme } from 'shuttlex-integration';

import { extendedProfileSelector } from '../../../core/contractor/redux/selectors';
import { MenuProps } from './props';

const Menu = ({ onClose, navigation }: MenuProps) => {
  const { t } = useTranslation();

  const profile = useSelector(extendedProfileSelector);

  const currentRoute = useNavigationState(state => state.routes[state.index].name);

  const menuNavigation: MenuNavigation = {
    ride: {
      navFunc: () => {
        navigation.navigate('Ride');
        onClose();
      },
      title: t('ride_Menu_navigationMyRide'),
    },
    activity: {
      navFunc: () => {
        navigation.navigate('Ride');
        //TODO Create activity page
        onClose();
      },
      title: t('ride_Menu_navigationActivity'),
    },
    wallet: {
      navFunc: () => {
        navigation.navigate('Wallet');
        onClose();
      },
      title: t('ride_Menu_navigationWallet'),
    },
    promocodes: {
      navFunc: () => {
        navigation.navigate('Ride');
        //TODO Create Promocodes page
        onClose();
      },
      title: t('ride_Menu_navigationPromocodes'),
    },
    becomeDriver: {
      navFunc: () => {
        navigation.navigate('Ride');
        //TODO go to page becomeDriver
        onClose();
      },
      title: t('ride_Menu_navigationBecomeDriver'),
    },
    settings: {
      navFunc: () => {
        navigation.navigate('Ride');
        //TODO Create settings page
        onClose();
      },
      title: t('ride_Menu_navigationSettings'),
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
    />
  );
};

const AdditionalContent = () => {
  const { colors } = useTheme();

  const computedStyles = {
    balanceTitle: {
      color: colors.textSecondaryColor,
    },
  };

  return (
    <Bar style={styles.balance}>
      <View style={styles.textWrapper}>
        <Text style={[styles.balanceTitle, computedStyles.balanceTitle]}>Earned</Text>
        <Text style={styles.balanceTotal}>$682.40</Text>
      </View>
      <Separator mode="vertical" style={styles.separator} />
      <View style={styles.textWrapper}>
        <Text style={[styles.balanceTitle, computedStyles.balanceTitle]}>Previous</Text>
        <Text style={styles.balanceTotal}>$12.10</Text>
      </View>
    </Bar>
  );
};

const styles = StyleSheet.create({
  balance: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  balanceTitle: {
    fontFamily: 'Inter Medium',
    fontSize: 12,
    flexShrink: 1,
  },
  balanceTotal: {
    fontFamily: 'Inter Medium',
  },
  separator: {
    flex: 0,
  },
  textWrapper: {
    flexShrink: 1,
  },
  unreadMarker: {
    width: 29,
    height: 29,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadNotificationsText: {
    fontFamily: 'Inter Medium',
    fontSize: 14,
  },
});

export default Menu;
