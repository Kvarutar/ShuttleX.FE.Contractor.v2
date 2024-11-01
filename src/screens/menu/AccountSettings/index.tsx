import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, LayoutChangeEvent, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import {
  AccountSettingsScreen,
  Button,
  ButtonShapes,
  ButtonSizes,
  CircleButtonModes,
  MenuHeader,
  MenuUserImage2,
  SafeAreaView,
  sizes,
  Text,
  UploadPhotoIcon,
} from 'shuttlex-integration';

import { profilePhotoSelector } from '../../../core/auth/redux/docs/selectors';
import { contractorIdSelector, profileSelector } from '../../../core/contractor/redux/selectors';
import { getProfile, updateProfileData } from '../../../core/contractor/redux/thunks';
import { resetVerification } from '../../../core/menu/redux/accountSettings';
import { isVerificationDoneSelector } from '../../../core/menu/redux/accountSettings/selectors';
import { useAppDispatch } from '../../../core/redux/hooks';
import { RootStackParamList } from '../../../Navigate/props';
import Menu from '../../ride/Menu';
import { AccountProfileDataProps, PhotoBlockProps } from './types';

const windowSizes = Dimensions.get('window');
const isPhoneSmall = windowSizes.height < 700;

const AccountSettings = (): JSX.Element => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { t } = useTranslation();

  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const dispatch = useAppDispatch();
  const profile = useSelector(profileSelector);
  const profilePhoto = useSelector(profilePhotoSelector);
  const isVerificationDone = useSelector(isVerificationDoneSelector);
  const contractorId = useSelector(contractorIdSelector);

  const computedStyles = StyleSheet.create({
    wrapper: {
      gap: isPhoneSmall ? 0 : 24,
      paddingTop: isPhoneSmall ? 0 : 8,
    },
  });

  useFocusEffect(
    useCallback(() => {
      dispatch(resetVerification());
    }, [dispatch]),
  );
  useEffect(() => {
    dispatch(getProfile({ contractorId }));
  }, [dispatch, contractorId]);

  useEffect(() => {
    dispatch(updateProfileData({ contractorId, updatedData: { imageUri: profilePhoto?.uri } }));
  }, [dispatch, navigation, profilePhoto?.uri, contractorId]);

  const handleOpenVerification = () => {
    navigation.navigate('AccountVerificateCode');
  };
  const handleProfileDataSave = (profileData: AccountProfileDataProps) => {
    dispatch(updateProfileData({ contractorId, updatedData: profileData }));
  };

  const onUploadPhoto = () => {
    navigation.navigate('ProfilePhoto');
  };

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
          handleOpenVerification={handleOpenVerification}
          isVerificationDone={isVerificationDone}
          onProfileDataSave={handleProfileDataSave}
          profile={{
            fullName: profile?.fullName ?? '',
            email: profile?.email ?? '',
            phone: profile?.phone ?? '',
          }}
          photoBlock={<PhotoBlock onUploadPhoto={onUploadPhoto} />}
        />
      </SafeAreaView>
      {isMenuVisible && <Menu onClose={() => setIsMenuVisible(false)} />}
    </>
  );
};

const PhotoBlock = ({ onUploadPhoto }: PhotoBlockProps) => {
  const profile = useSelector(profileSelector);

  const [imageHeight, setImageHeight] = useState(0);

  const computedStyles = StyleSheet.create({
    icon: {
      bottom: -(imageHeight - 64) / 2,
    },
  });

  const handleImageLayout = (event: LayoutChangeEvent) => {
    setImageHeight(event.nativeEvent.layout.height);
  };

  return (
    <View style={styles.profilePhotoBox}>
      <Button
        onPress={onUploadPhoto}
        style={[computedStyles.icon, styles.icon]}
        mode={CircleButtonModes.Mode2}
        size={ButtonSizes.M}
        shape={ButtonShapes.Circle}
      >
        <UploadPhotoIcon />
      </Button>
      <View onLayout={handleImageLayout}>
        <MenuUserImage2 url={profile?.imageUri} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 0,
  },
  headerStyle: {
    paddingHorizontal: sizes.paddingHorizontal,
  },
  icon: {
    position: 'absolute',
    right: sizes.paddingHorizontal,
  },
  profilePhotoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  bar: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  barText: {
    fontSize: 17,
    fontFamily: 'Inter Medium',
  },
});
export default AccountSettings;
