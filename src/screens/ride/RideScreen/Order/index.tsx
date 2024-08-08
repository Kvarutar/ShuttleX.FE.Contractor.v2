import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { BottomWindowWithGesture, SwipeButton, SwipeButtonModes } from 'shuttlex-integration';
import { BottomWindowWithGestureRef } from 'shuttlex-integration/lib/typescript/src/shared/molecules/BottomWindowWithGesture/props';

import { useAppDispatch } from '../../../../core/redux/hooks';
import { twoHighestPriorityAlertsSelector } from '../../../../core/ride/redux/alerts/selectors';
import { endTrip } from '../../../../core/ride/redux/trip';
import { tripStatusSelector } from '../../../../core/ride/redux/trip/selectors';
import AlertInitializer from '../../../../shared/AlertInitializer';
import HiddenPart from './HiddenPart';
import VisiblePart from './VisiblePart';

const Order = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const [isOpened, setIsOpened] = useState(false);
  const bottomWindowRef = useRef<BottomWindowWithGestureRef>(null);
  const tripStatus = useSelector(tripStatusSelector);
  const alerts = useSelector(twoHighestPriorityAlertsSelector);

  useEffect(() => {
    bottomWindowRef.current?.closeWindow();
  }, [tripStatus]);

  const onCancelTrip = () => {
    dispatch(endTrip());
  };

  return (
    <BottomWindowWithGesture
      alerts={alerts.map(alertData => (
        <AlertInitializer
          key={alertData.id}
          id={alertData.id}
          priority={alertData.priority}
          type={alertData.type}
          options={'options' in alertData ? alertData.options : undefined}
        />
      ))}
      visiblePart={<VisiblePart isOpened={isOpened} />}
      hiddenPart={<HiddenPart />}
      hiddenPartContainerStyles={styles.bottomWindowHiddenContainer}
      setIsOpened={setIsOpened}
      ref={bottomWindowRef}
      hiddenPartButton={
        <SwipeButton
          mode={SwipeButtonModes.Decline}
          onSwipeEnd={onCancelTrip}
          text={t('ride_Ride_Order_cancelRideButton')}
        />
      }
    />
  );
};

const styles = StyleSheet.create({
  bottomWindowHiddenContainer: {
    gap: 30,
  },
});

export default Order;
