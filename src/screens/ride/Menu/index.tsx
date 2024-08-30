import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { Bar, MenuBase, MenuNavigation, Separator, Text, useThemeV1 } from 'shuttlex-integration';

import { extendedProfileSelector } from '../../../core/contractor/redux/selectors';
import { numberOfUnreadNotificationsSelector } from '../../../core/menu/redux/notifications/selectors';
import { MenuProps } from './props';

const Menu = ({ onClose, navigation }: MenuProps) => {
  const { t } = useTranslation();

  const profile = useSelector(extendedProfileSelector);

  const menuNavigation: MenuNavigation = {
    subscription: {
      navFunc: () => {
        navigation.navigate('Ride');
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
    notifications: {
      navFunc: () => {
        navigation.navigate('Notifications');
        onClose();
      },
      title: t('ride_Menu_navigationNotifications'),
      content: <NotificationContent />,
    },
    help: {
      navFunc: () => {
        navigation.navigate('Ride');
        onClose();
      },
      title: t('ride_Menu_navigationHelp'),
    },
  };

  return (
    <MenuBase
      onClose={onClose}
      additionalContent={<AdditionalContent />}
      userImageUri={profile?.profileImageUri ?? 'placeholder'}
      userName={profile?.name}
      userSurname={profile?.surname}
      menuNavigation={menuNavigation}
    />
  );
};

const NotificationContent = () => {
  const { colors } = useThemeV1();
  const unreadNotifications = useSelector(numberOfUnreadNotificationsSelector);

  const computedStyles = StyleSheet.create({
    unreadMarker: {
      backgroundColor: colors.primaryColor,
    },
    unreadNotificationsText: {
      color: colors.backgroundPrimaryColor,
    },
  });

  if (unreadNotifications > 0) {
    return (
      <View style={[styles.unreadMarker, computedStyles.unreadMarker]}>
        <Text style={[styles.unreadNotificationsText, computedStyles.unreadNotificationsText]}>
          {unreadNotifications}
        </Text>
      </View>
    );
  } else if (unreadNotifications > 99) {
    return (
      <View style={[styles.unreadMarker, computedStyles.unreadMarker]}>
        <Text style={[styles.unreadNotificationsText, computedStyles.unreadNotificationsText]}>99+</Text>
      </View>
    );
  }
  return <></>;
};

const AdditionalContent = () => {
  const { colors } = useThemeV1();

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
