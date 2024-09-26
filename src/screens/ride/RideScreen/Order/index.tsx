import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { BottomWindowWithGesture, SwipeButton, SwipeButtonModes } from 'shuttlex-integration';
import { BottomWindowWithGestureRef } from 'shuttlex-integration/lib/typescript/src/shared/molecules/BottomWindowWithGesture/props';

import { useAppDispatch } from '../../../../core/redux/hooks';
import { twoHighestPriorityAlertsSelector } from '../../../../core/ride/redux/alerts/selectors';
import { endTrip } from '../../../../core/ride/redux/trip';
import { orderSelector, tripStatusSelector } from '../../../../core/ride/redux/trip/selectors';
import { TripStatus } from '../../../../core/ride/redux/trip/types';
import AlertInitializer from '../../../../shared/AlertInitializer';
import PassengerRating from '../popups/PassengerRatingPopup';
import HiddenPart from './HiddenPart';
import VisiblePart from './VisiblePart';

const Order = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const bottomWindowRef = useRef<BottomWindowWithGestureRef>(null);

  const tripStatus = useSelector(tripStatusSelector);
  const alerts = useSelector(twoHighestPriorityAlertsSelector);
  const order = useSelector(orderSelector);

  useEffect(() => {
    bottomWindowRef.current?.closeWindow();
  }, [tripStatus]);

  const onCancelTrip = () => {
    dispatch(endTrip());
  };

  return (
    <>
      <BottomWindowWithGesture
        withHiddenPartScroll={false}
        alerts={alerts.map(alertData => (
          <AlertInitializer
            key={alertData.id}
            id={alertData.id}
            priority={alertData.priority}
            type={alertData.type}
            options={'options' in alertData ? alertData.options : undefined}
          />
        ))}
        visiblePart={<VisiblePart />}
        hiddenPart={<HiddenPart />}
        visiblePartStyle={styles.bottomWindowVisiblePartStyle}
        hiddenPartContainerStyle={styles.bottomWindowHiddenContainer}
        ref={bottomWindowRef}
        hiddenPartButton={
          <SwipeButton
            mode={SwipeButtonModes.Decline}
            onSwipeEnd={onCancelTrip}
            text={t('ride_Ride_Order_cancelRideButton')}
          />
        }
      />
      {tripStatus === TripStatus.Rating && order && <PassengerRating />}
    </>
  );
};

const styles = StyleSheet.create({
  bottomWindowHiddenContainer: {
    gap: 8,
  },
  bottomWindowVisiblePartStyle: {
    paddingBottom: 24,
  },
});

export default Order;
