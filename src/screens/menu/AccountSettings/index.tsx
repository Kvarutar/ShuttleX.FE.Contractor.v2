import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
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

// import { updateRequirementDocuments } from '../../../core/auth/redux/docs';
import { profilePhotoSelector } from '../../../core/auth/redux/docs/selectors';
import { contractorInfoSelector } from '../../../core/contractor/redux/selectors';
import { resetAccountSettingsVerification } from '../../../core/menu/redux/accountSettings';
import {
  accountSettingsErrorSelector,
  isAccountSettingsLoadingSelector,
  isAccountSettingsVerificationDoneSelector,
} from '../../../core/menu/redux/accountSettings/selectors';
import { changeAccountContactData } from '../../../core/menu/redux/accountSettings/thunks';
import { useAppDispatch } from '../../../core/redux/hooks';
import { RootStackParamList } from '../../../Navigate/props';
import Menu from '../../ride/Menu';
import { PhotoBlockProps } from './types';

//TODO: uncoment all changeName related code when we need changeName popup///////
const AccountSettings = (): JSX.Element => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'AccountSettings'>>();
  const { t } = useTranslation();

  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const dispatch = useAppDispatch();
  const contractorInfo = useSelector(contractorInfoSelector);
  const isVerificationDone = useSelector(isAccountSettingsVerificationDoneSelector);
  const changeDataError = useSelector(accountSettingsErrorSelector);
  const isLoading = useSelector(isAccountSettingsLoadingSelector);

  useFocusEffect(
    useCallback(() => {
      dispatch(resetAccountSettingsVerification());
    }, [dispatch]),
  );

  const handleOpenVerification = async (mode: 'phone' | 'email', newValue: string) => {
    if (!isLoading && !changeDataError) {
      try {
        await dispatch(
          changeAccountContactData({
            method: mode,
            data: { oldData: contractorInfo?.[mode] ?? '', newData: newValue },
          }),
        ).unwrap();
        // If there is an error, then try catch will catch it and the next line will not be executed
        navigation.navigate('AccountVerificateCode', { mode, newValue });
      } catch (_) {}
    }
  };

  // const handleProfileDataSave = (profileData: AccountProfileDataProps) => {
  //   dispatch(updateProfileData(profileData));
  // };

  const onUploadPhoto = () => {
    navigation.navigate('ProfilePhoto');
  };

  // const onNameChanged = () => {
  //   dispatch(
  //     updateRequirementDocuments({ passport: [], driversLicense: [], vehicleRegistration: [], vehicleInsurance: [] }),
  //   );
  // };

  return (
    <>
      <SafeAreaView containerStyle={styles.wrapper}>
        <MenuHeader
          onMenuPress={() => setIsMenuVisible(true)}
          onNotificationPress={() => navigation.navigate('Notifications')}
        >
          <Text>{t('ride_Menu_navigationAccountSettings')}</Text>
        </MenuHeader>

        <AccountSettingsScreen
          handleOpenVerification={handleOpenVerification}
          isVerificationDone={isVerificationDone}
          // onProfileDataSave={handleProfileDataSave}
          profile={{
            fullName: contractorInfo.name ?? '',
            email: contractorInfo?.email ?? '',
            phone: contractorInfo?.phone ?? '',
          }}
          // onNameChanged={onNameChanged}
          // isContractor={true}
          photoBlock={<PhotoBlock onUploadPhoto={onUploadPhoto} />}
          // barBlock={<BarBlock onUpdateDocument={() => navigation.navigate('Docs')} />}
        />
      </SafeAreaView>
      {isMenuVisible && <Menu onClose={() => setIsMenuVisible(false)} />}
    </>
  );
};

// const BarBlock = ({ onUpdateDocument }: { onUpdateDocument: () => void }) => {
//   const { t } = useTranslation();
//   const isAllFilled = useSelector(isAllDocumentsFilledSelector);

//   return (
//     <Bar style={styles.bar} mode={BarModes.Default} onPress={onUpdateDocument}>
//       <Text style={styles.barText}>{t('AccountSettings_barUpdate')}</Text>
//       {isAllFilled ? <ArrowInPrimaryColorIcon /> : <WarningIcon />}
//     </Bar>
//   );
// };

const PhotoBlock = ({ onUploadPhoto }: PhotoBlockProps) => {
  //TODO decide where shoud we get the image
  const photo = useSelector(profilePhotoSelector);

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
        <MenuUserImage2 url={photo ?? ''} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    gap: 24,
    paddingTop: 8,
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
