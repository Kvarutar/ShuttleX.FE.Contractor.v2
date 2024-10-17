import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, StyleSheet } from 'react-native';
import { AddCardScreen, BottomWindowWithGesture, BottomWindowWithGestureRef, Card } from 'shuttlex-integration';

import { addAvailablePaymentMethod } from '../../../../../core/menu/redux/wallet/thunks';
import { useAppDispatch } from '../../../../../core/redux/hooks';
import { AddCardPopupProps } from './types';

const windowHeight = Dimensions.get('window').height;

const AddCardPopup = ({ setIsAddCardPopupVisible, setIsPaymentsVariantsVisible }: AddCardPopupProps): JSX.Element => {
  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const bottomWindowRef = useRef<BottomWindowWithGestureRef>(null);

  useEffect(() => {
    bottomWindowRef.current?.openWindow();
  }, []);

  const onCardSave = async (cardData: Card) => {
    await dispatch(addAvailablePaymentMethod({ cardData }));
    bottomWindowRef.current?.closeWindow();
    setIsAddCardPopupVisible(false);
    setIsPaymentsVariantsVisible(false);
  };

  const computedStyles = StyleSheet.create({
    hiddenPartContainerStyle: {
      height: windowHeight * 0.8,
    },
  });

  return (
    <BottomWindowWithGesture
      ref={bottomWindowRef}
      withShade
      hiddenPartContainerStyle={computedStyles.hiddenPartContainerStyle}
      setIsOpened={setIsAddCardPopupVisible}
      hiddenPart={
        <AddCardScreen
          onCardSave={onCardSave}
          withExpireAndCVV={false}
          firstTitle={t('menu_AddCardPopup_firstTitle')}
          secondTitle={t('menu_AddCardPopup_secondTitle')}
        />
      }
    />
  );
};

export default AddCardPopup;
