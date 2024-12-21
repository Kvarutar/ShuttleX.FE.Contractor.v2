import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
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
import { signOut } from '../../../core/auth/redux/thunks';
import { contractorAvatarSelector, contractorInfoSelector } from '../../../core/contractor/redux/selectors';
import { resetAccountSettingsVerification } from '../../../core/menu/redux/accountSettings';
import {
  accountSettingsChangeDataErrorSelector,
  accountSettingsVerifyErrorSelector,
  accountSettingsVerifyStatusSelector,
  isAccountSettingsChangeDataLoadingSelector,
} from '../../../core/menu/redux/accountSettings/selectors';
import {
  changeAccountContactData,
  requestAccountSettingsChangeDataVerificationCode,
} from '../../../core/menu/redux/accountSettings/thunks';
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
  const verifiedStatus = useSelector(accountSettingsVerifyStatusSelector);
  const changeDataError = useSelector(accountSettingsChangeDataErrorSelector);
  const verifyDataError = useSelector(accountSettingsVerifyErrorSelector);

  const isChangeDataLoading = useSelector(isAccountSettingsChangeDataLoadingSelector);

  useEffect(() => {
    dispatch(resetAccountSettingsVerification());
  }, [changeDataError, verifyDataError, dispatch]);

  const handleOpenVerification = async (mode: 'phone' | 'email', newValue: string, method: 'change' | 'verify') => {
    if (!isChangeDataLoading && !changeDataError) {
      let oldData: string | undefined;
      switch (mode) {
        case 'phone':
          //TODO change it when back will synchronize profile
          oldData = verifiedStatus.phoneInfo;
          break;
        case 'email':
          oldData = verifiedStatus.emailInfo;
          break;
      }
      switch (method) {
        case 'change':
          try {
            await dispatch(changeAccountContactData({ mode, data: { oldData, newData: newValue } })).unwrap();
            // If there is an error, then try catch will catch it and the next line will not be executed
            navigation.navigate('AccountVerificateCode', { mode, newValue, method });
          } catch (_) {}
          break;

        case 'verify':
          await dispatch(requestAccountSettingsChangeDataVerificationCode({ mode, data: oldData }));
          navigation.navigate('AccountVerificateCode', { mode, method });
          break;
      }
    }
  };

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
        <MenuHeader onMenuPress={() => setIsMenuVisible(true)}>
          <Text>{t('ride_Menu_navigationAccountSettings')}</Text>
        </MenuHeader>

        <AccountSettingsScreen
          onSignOut={() => dispatch(signOut())}
          handleOpenVerification={handleOpenVerification}
          isChangeDataLoading={isChangeDataLoading}
          verifiedStatus={verifiedStatus}
          // onProfileDataSave={handleProfileDataSave}
          profile={{
            fullName: contractorInfo.name ?? '',
            //TODO change it when back will synchronize profile
            email: verifiedStatus.emailInfo ?? '',
            phone: verifiedStatus.phoneInfo ?? '',
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
  const photo = useSelector(contractorAvatarSelector);

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
        <MenuUserImage2 url={photo} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    gap: 24,
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
