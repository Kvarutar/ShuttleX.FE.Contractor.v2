import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import {
  AccountSettingsRef,
  AccountSettingsScreen,
  AccountSettingsVerificationMethod,
  Button,
  ButtonShapes,
  ButtonSizes,
  CircleButtonModes,
  ConfirmDeleteAccountPopup,
  DeleteAccountPopup,
  isIncorrectFieldsError,
  MenuHeader,
  MenuUserImage2,
  SafeAreaView,
  SignOutPopup,
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
  const accountSettingsRef = useRef<AccountSettingsRef>(null);

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'AccountSettings'>>();
  const { t } = useTranslation();

  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const dispatch = useAppDispatch();
  const contractorInfo = useSelector(contractorInfoSelector);
  const verifiedStatus = useSelector(accountSettingsVerifyStatusSelector);
  const changeDataError = useSelector(accountSettingsChangeDataErrorSelector);
  const isChangeDataLoading = useSelector(isAccountSettingsChangeDataLoadingSelector);
  const [errorField, setErrorField] = useState<string>('');

  const [isSignOutPopupVisible, setIsSignOutPopupVisible] = useState(false);
  const [isDeleteAccountPopupVisible, setIsDeleteAccountPopupVisible] = useState(false);
  const [isConfirmDeleteAccountPopupVisible, setIsConfirmDeleteAccountPopupVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      dispatch(resetAccountSettingsVerification());
    }, [dispatch]),
  );

  useEffect(() => {
    if (changeDataError && isIncorrectFieldsError(changeDataError)) {
      if (Array.isArray(changeDataError.body)) {
        changeDataError.body.forEach(item => {
          accountSettingsRef.current?.showErrors({ [item.field]: item.message });
        });
      } else if (changeDataError.body.message) {
        accountSettingsRef.current?.showErrors({
          [errorField === 'phone' ? 'newphone' : 'newemail']: changeDataError.body.message,
        });
      }
    }
  }, [changeDataError, errorField]);

  const handleOpenVerification = async (
    mode: 'phone' | 'email',
    newValue: string,
    method: AccountSettingsVerificationMethod,
  ): Promise<boolean | void> => {
    setErrorField(mode);
    let oldData: string | undefined;
    switch (mode) {
      case 'phone':
        //TODO change it when back will synchronize profile
        oldData = verifiedStatus.phone;
        break;
      case 'email':
        oldData = verifiedStatus.email;
        break;
    }

    switch (method) {
      case 'change':
        try {
          await dispatch(changeAccountContactData({ mode, data: { oldData, newData: newValue } })).unwrap();
          navigation.navigate('AccountVerificateCode', { mode, newValue, method });
          return true;
        } catch (error) {
          return false;
        }

      case 'verify':
        try {
          await dispatch(requestAccountSettingsChangeDataVerificationCode({ mode, data: oldData }));
          navigation.navigate('AccountVerificateCode', { mode, method });
          return true;
        } catch (error) {
          return false;
        }
      case 'delete':
        await dispatch(requestAccountSettingsChangeDataVerificationCode({ mode, data: oldData ?? '' }));
        navigation.navigate('AccountVerificateCode', { mode, method });
        break;
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
        <MenuHeader onMenuPress={() => setIsMenuVisible(true)} style={styles.menuHeader}>
          <Text>{t('ride_Menu_navigationAccountSettings')}</Text>
        </MenuHeader>

        <AccountSettingsScreen
          ref={accountSettingsRef}
          setIsSignOutPopupVisible={setIsSignOutPopupVisible}
          setIsDeleteAccountPopupVisible={setIsDeleteAccountPopupVisible}
          handleOpenVerification={handleOpenVerification}
          isChangeDataLoading={isChangeDataLoading}
          verifiedStatus={verifiedStatus}
          // onProfileDataSave={handleProfileDataSave}
          profile={{
            fullName: contractorInfo.name ?? '',
            //TODO change it when back will synchronize profile
            email: verifiedStatus.email ?? '',
            phone: verifiedStatus.phone ?? '',
          }}
          // onNameChanged={onNameChanged}
          // isContractor={true}
          photoBlock={<PhotoBlock onUploadPhoto={onUploadPhoto} />}
          // barBlock={<BarBlock onUpdateDocument={() => navigation.navigate('Docs')} />}
        />
      </SafeAreaView>
      {isSignOutPopupVisible && (
        <SignOutPopup setIsSignOutPopupVisible={setIsSignOutPopupVisible} onSignOut={() => dispatch(signOut())} />
      )}
      {isDeleteAccountPopupVisible && (
        <DeleteAccountPopup
          setIsDeleteAccountPopupVisible={setIsDeleteAccountPopupVisible}
          onPressYes={() => setIsConfirmDeleteAccountPopupVisible(true)}
        />
      )}
      {isConfirmDeleteAccountPopupVisible && (
        <ConfirmDeleteAccountPopup
          handleOpenVerification={handleOpenVerification}
          setIsConfirmDeleteAccountPopupVisible={setIsConfirmDeleteAccountPopupVisible}
          userData={{ phone: verifiedStatus.phone, email: verifiedStatus.email }}
        />
      )}
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
  menuHeader: {
    zIndex: -1,
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
