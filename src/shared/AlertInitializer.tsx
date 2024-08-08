import {
  FreeTimeAlert,
  InternetDisconnectedAlert,
  PaidTimeAlert,
  RideHasFinishedAlert,
  SecondRideAlert,
} from 'shuttlex-integration';

import { useAppDispatch } from '../core/redux/hooks';
import { removeAlert } from '../core/ride/redux/alerts';
import {
  AlertType,
  FreeTimeAlertOptions,
  PaidTimeAlertOptions,
  RideHasFinishedAlertOptions,
} from '../core/ride/redux/alerts/types';

const AlertInitializer = ({ id, type, options }: Omit<AlertType, 'options'> & { options?: object }): JSX.Element => {
  const dispatch = useAppDispatch();

  const removeThisAlert = () => dispatch(removeAlert({ id }));

  switch (type) {
    case 'free_time_ends': {
      const typedOptions = options as FreeTimeAlertOptions;
      return <FreeTimeAlert onClose={removeThisAlert} closeTimeout={10000} {...typedOptions} />;
    }
    case 'paid_time_starts': {
      const typedOptions = options as PaidTimeAlertOptions;
      return <PaidTimeAlert onClose={removeThisAlert} closeTimeout={10000} {...typedOptions} />;
    }
    case 'ride_has_finished': {
      const typedOptions = options as RideHasFinishedAlertOptions;
      return <RideHasFinishedAlert onClose={removeThisAlert} closeTimeout={5000} {...typedOptions} />;
    }
    case 'second_ride': {
      return <SecondRideAlert onClose={removeThisAlert} />;
    }
    case 'internet_disconnected': {
      return <InternetDisconnectedAlert isClosable={false} />;
    }
  }
};

export default AlertInitializer;
