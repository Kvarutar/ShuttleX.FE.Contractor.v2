import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import {
  BigHeader,
  Button,
  ButtonShapes,
  ButtonSizes,
  CircleButtonModes,
  CustomKeyboardAvoidingView,
  SafeAreaView,
  ScrollViewWithCustomScroll,
  ShortArrowIcon,
  SquareButtonModes,
  TextInput,
} from 'shuttlex-integration';

import { saveDocPaymentData } from '../../../core/auth/redux/docs/thunks';
import { PaymentDataForm } from '../../../core/auth/redux/docs/types';
import { useAppDispatch } from '../../../core/redux/hooks';
import { RootStackParamList } from '../../../Navigate/props';

const onlyDigits = (str: string) => str.replace(/[^0-9]/g, '');
const onlyLettersAndSpaces = (str: string) => str.replace(/[^\p{L}\s]/gu, '');

//TODO: add logic for send card
const PaymentDocScreen = (): JSX.Element => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Verification'>>();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const [paymentDataForm, setPaymentDataForm] = useState<PaymentDataForm>({
    firstName: '',
    surname: '',
    taxNumber: '',
  });

  const [errors, setErrors] = useState<PaymentDataForm>({
    firstName: '',
    surname: '',
    taxNumber: '',
  });

  const [isCardSuccessfullyAdded, setIsCardSuccessfullyAdded] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateField = (field: keyof PaymentDataForm, value: string): string => {
    switch (field) {
      case 'firstName':
      case 'surname':
        if (value.length < 2) {
          return t('docs_PaymentDoc_errorMinCharacters', { min: 2 });
        }
        break;
      case 'taxNumber':
        if (value.length !== 10) {
          return t('docs_PaymentDoc_errorExactDigits', { count: 10 });
        }
        break;
    }
    return '';
  };

  const handleChange = (field: keyof PaymentDataForm, value: string) => {
    const filteredValue = field === 'taxNumber' ? onlyDigits(value) : onlyLettersAndSpaces(value);

    setPaymentDataForm(prev => ({ ...prev, [field]: filteredValue }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleAddCard = () => {
    //TODO: add logic for add card
    setIsCardSuccessfullyAdded(true);
  };

  const handleSubmit = () => {
    setIsSubmitted(true);

    const newErrors: PaymentDataForm = {
      firstName: validateField('firstName', paymentDataForm.firstName),
      surname: validateField('surname', paymentDataForm.surname),
      taxNumber: validateField('taxNumber', paymentDataForm.taxNumber),
    };

    setErrors(newErrors);

    if (Object.values(newErrors).every(isError => !isError)) {
      dispatch(saveDocPaymentData(paymentDataForm));
      navigation.goBack();
    }
  };

  const hasError = Object.values(errors).some(Boolean);
  const isSomeFieldEmpty = Object.values(paymentDataForm).some(value => value.trim() === '');

  const isSaveButtonDisabled = hasError || isSomeFieldEmpty;

  const addCardButtonMode = (): SquareButtonModes => {
    const isError = isSubmitted && !isCardSuccessfullyAdded;

    if (isError) {
      return SquareButtonModes.Mode4;
    }
    if (isCardSuccessfullyAdded) {
      return SquareButtonModes.Mode1;
    }

    return SquareButtonModes.Mode5;
  };

  return (
    <CustomKeyboardAvoidingView>
      <SafeAreaView>
        <Button
          onPress={navigation.goBack}
          shape={ButtonShapes.Circle}
          mode={CircleButtonModes.Mode2}
          size={ButtonSizes.S}
        >
          <ShortArrowIcon />
        </Button>
        <ScrollViewWithCustomScroll contentContainerStyle={styles.scrollContainer}>
          <BigHeader
            containerStyle={styles.bigHeader}
            windowTitle={t('docs_PaymentDoc_headerTitle')}
            firstHeaderTitle={t('docs_PaymentDoc_explanationFirstTitle')}
            secondHeaderTitle={t('docs_PaymentDoc_explanationSecondTitle')}
            description={t('docs_PaymentDoc_explanationDescription')}
          />

          <View style={styles.content}>
            <TextInput
              placeholder={t('docs_PaymentDoc_namePlaceholder')}
              value={paymentDataForm.firstName}
              onChangeText={value => handleChange('firstName', value)}
              error={{ isError: isSubmitted && errors.firstName !== '', message: errors.firstName }}
            />
            <TextInput
              placeholder={t('docs_PaymentDoc_surnamePlaceholder')}
              value={paymentDataForm.surname}
              onChangeText={value => handleChange('surname', value)}
              error={{ isError: isSubmitted && errors.surname !== '', message: errors.surname }}
            />
            <TextInput
              placeholder={t('docs_PaymentDoc_taxPlaceholder')}
              value={paymentDataForm.taxNumber}
              onChangeText={value => handleChange('taxNumber', value)}
              error={{ isError: isSubmitted && errors.taxNumber !== '', message: errors.taxNumber }}
              maxLength={10}
              onlyDigits
            />
            <Button
              text={t('docs_PaymentDoc_addCard')}
              mode={addCardButtonMode()}
              textStyle={styles.buttonText}
              onPress={handleAddCard}
            />
          </View>
        </ScrollViewWithCustomScroll>

        <Button
          disabled={isSaveButtonDisabled}
          text={t('docs_PaymentDoc_saveButton')}
          style={styles.nextButton}
          mode={isSaveButtonDisabled ? SquareButtonModes.Mode5 : SquareButtonModes.Mode1}
          textStyle={styles.buttonText}
          onPress={handleSubmit}
        />
      </SafeAreaView>
    </CustomKeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 24,
  },
  bigHeader: {
    marginTop: 18,
  },
  content: {
    flex: 1,
    marginTop: 22,
    gap: 8,
  },
  nextButton: {
    marginTop: 8,
  },
  buttonText: {
    fontSize: 17,
  },
});

export default PaymentDocScreen;
