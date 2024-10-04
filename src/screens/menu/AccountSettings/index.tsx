import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { AccountSettingsScreen, MenuHeader, SafeAreaView, sizes, Text } from 'shuttlex-integration';

import { updateProfile } from '../../../core/contractor/redux';
import { profileSelector } from '../../../core/contractor/redux/selectors';
import { type Profile } from '../../../core/contractor/redux/types';
import { useAppDispatch } from '../../../core/redux/hooks';
import Menu from '../../ride/Menu';
import { AccountSettingsScreenProps } from './props';

const windowSizes = Dimensions.get('window');
const isPhoneSmall = windowSizes.height < 700;

const AccountSettings = ({ navigation }: AccountSettingsScreenProps): JSX.Element => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const { t } = useTranslation();

  const dispatch = useAppDispatch();
  const profile = useSelector(profileSelector);

  const handleProfileDataSave = (profileData: Profile) => {
    dispatch(updateProfile(profileData));
  };

  const computedStyles = StyleSheet.create({
    wrapper: {
      gap: isPhoneSmall ? 0 : 24,
      paddingTop: isPhoneSmall ? 0 : 8,
    },
  });
  return (
    <>
      <SafeAreaView containerStyle={[styles.wrapper, computedStyles.wrapper]}>
        <View style={styles.headerStyle}>
          <MenuHeader
            onMenuPress={() => setIsMenuVisible(true)}
            onNotificationPress={() => navigation.navigate('Notifications')}
          >
            <Text>{t('ride_Menu_navigationAccountSettings')}</Text>
          </MenuHeader>
        </View>
        <AccountSettingsScreen
          onProfileDataSave={handleProfileDataSave}
          profile={{
            fullName: profile?.fullName ?? '',
            email: profile?.email ?? '',
            phone: profile?.phone ?? '',
            imageUri: profile?.imageUri ?? '',
          }}
        />
      </SafeAreaView>
      {isMenuVisible && <Menu onClose={() => setIsMenuVisible(false)} />}
    </>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 0,
  },
  headerStyle: {
    paddingHorizontal: sizes.paddingHorizontal,
  },
});
export default AccountSettings;
