import { useNavigation, useNavigationState } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { Linking, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import {
  Bar,
  BarModes,
  formatCurrency,
  MenuBase,
  MenuNavigation,
  Skeleton,
  Text,
  useTheme,
} from 'shuttlex-integration';

// TODO Uncomment all code whe we need it
// import CrownIcon from 'shuttlex-integration';
import {
  contractorAvatarSelector,
  contractorInfoErrorSelector,
  contractorInfoSelector,
  isContractorInfoLoadingSelector,
  isTariffsInfoLoadingSelector,
  primaryTariffSelector,
  tariffsInfoErrorSelector,
} from '../../../core/contractor/redux/selectors';
import { RootStackParamList } from '../../../Navigate/props';
import { MenuProps } from './props';

const Menu = ({ onClose }: MenuProps) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { t } = useTranslation();

  const contractorInfo = useSelector(contractorInfoSelector);
  const contractorAvatar = useSelector(contractorAvatarSelector);

  const isContractorInfoLoading = useSelector(isContractorInfoLoadingSelector);

  const currentRoute = useNavigationState(state => state.routes[state.index].name);

  const menuNavigation: MenuNavigation = {
    ride: {
      navFunc: () => {
        navigation.navigate('Ride');
        onClose();
      },
      title: t('ride_Menu_navigationRide'),
    },

    // TODO Uncomment all code whe we need it

    // statistics: {
    //   navFunc: () => {
    //     navigation.navigate('Ride');
    //     //TODO Create statistics page
    //     onClose();
    //   },
    //   title: t('ride_Menu_navigationStatistics'),
    // },
    subscription: {
      navFunc: () => {
        // navigation.navigate('Ride');
        // //TODO Create subscription page
        Linking.openURL('https://www.shuttlex.com/contractor.html');
        onClose();
      },
      title: t('ride_Menu_navigationSubscription'),
    },
    //Dont need it now
    // wallet: {
    //   navFunc: () => {
    //     navigation.navigate('Wallet');
    //     onClose();
    //   },
    //   title: t('ride_Menu_navigationWallet'),
    // },
    accountSettings: {
      navFunc: () => {
        navigation.navigate('AccountSettings');
        onClose();
      },
      title: t('ride_Menu_navigationAccountSettings'),
    },
    help: {
      navFunc: () => {
        // navigation.navigate('Ride');
        // //TODO Create help page
        // onClose();
      },
      title: t('ride_Menu_navigationHelp'),
    },
  };

  return (
    <MenuBase
      onClose={onClose}
      additionalContent={<AdditionalContent />}
      userImageUri={contractorAvatar ?? undefined}
      userName={contractorInfo?.name}
      menuNavigation={menuNavigation}
      currentRoute={currentRoute}
      isContractorMenu
      // label={<LevelLabel />}
      loading={{
        avatar: isContractorInfoLoading,
        username: isContractorInfoLoading,
      }}
    />
  );
};

// TODO Uncomment all code whe we need it

// const LevelLabel = () => {
//   const { t } = useTranslation();
//   const { colors } = useTheme();

//   const computedStyles = StyleSheet.create({
//     label: {
//       borderColor: colors.backgroundSecondaryColor,
//       backgroundColor: colors.backgroundPrimaryColor,
//     },
//   });
//   return (
//     <View style={[styles.label, computedStyles.label]}>
// <CrownIcon />
//       {/* TODO add dynamic level variable */}
//       <Text style={[styles.labelText, { color: colors.textQuadraticColor }]}>{t('ride_Menu_level', { level: 4 })}</Text>
//     </View>
//   );
// };

const AdditionalContent = () => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const contractorInfo = useSelector(contractorInfoSelector);
  const primaryTariff = useSelector(primaryTariffSelector);

  const contractorInfoIsLoading = useSelector(isContractorInfoLoadingSelector);
  const tariffsInfoIsLoading = useSelector(isTariffsInfoLoadingSelector);

  const contractorInfoIsError = useSelector(contractorInfoErrorSelector);
  const tariffsInfoIsError = useSelector(tariffsInfoErrorSelector);

  const computedStyles = {
    balanceTitle: {
      color: colors.textQuadraticColor,
    },
  };

  if (contractorInfoIsLoading || tariffsInfoIsLoading) {
    return (
      <View style={styles.balance}>
        <Skeleton skeletonContainerStyle={styles.skeletonAdditionalContentContainer} skeletonsAmount={2} />
      </View>
    );
  }

  if (contractorInfoIsError || tariffsInfoIsError || !primaryTariff) {
    return;
  }

  return (
    <View style={styles.balance}>
      <Bar mode={BarModes.Disabled} style={styles.textWrapper}>
        <Text style={[styles.balanceTitle, computedStyles.balanceTitle]}>{t('ride_Menu_additionalEarned')}</Text>
        <Text style={styles.balanceTotal}>
          {formatCurrency(primaryTariff.currencyCode, contractorInfo.earnedToday)}
        </Text>
      </Bar>

      <Bar mode={BarModes.Disabled} style={styles.textWrapper}>
        <Text style={[styles.balanceTitle, computedStyles.balanceTitle]}>{t('ride_Menu_additionalPrevious')}</Text>
        <Text style={styles.balanceTotal}>
          {formatCurrency(primaryTariff.currencyCode, contractorInfo.previousOrderEarned)}
        </Text>
      </Bar>
    </View>
  );
};

const styles = StyleSheet.create({
  skeletonAdditionalContentContainer: {
    flex: 1,
    height: 75,
    borderRadius: 12,
  },
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
