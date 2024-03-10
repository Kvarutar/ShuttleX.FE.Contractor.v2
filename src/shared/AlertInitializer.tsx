import React from 'react';
import { AlertRunsOn, FreeTimeAlert, InternetDisconnectedAlert, PaidTimeAlert } from 'shuttlex-integration';

import { useAppDispatch } from '../core/redux/hooks';
import { removeAlert } from '../core/ride/redux/alerts';
import { AlertType, FreeTimeAlertOptions, PaidTimeAlertOptions } from '../core/ride/redux/alerts/types';

const runsOn = AlertRunsOn.Contractor;

const AlertInitializer = ({ id, type, options }: Omit<AlertType, 'options'> & { options?: object }): JSX.Element => {
  const dispatch = useAppDispatch();

  const removeThisAlert = () => dispatch(removeAlert({ id }));

  switch (type) {
    case 'free_time_ends': {
      const typedOptions = options as FreeTimeAlertOptions;
      return <FreeTimeAlert runsOn={runsOn} onClose={removeThisAlert} closeTimeout={10000} {...typedOptions} />;
    }
    case 'paid_time_starts': {
      const typedOptions = options as PaidTimeAlertOptions;
      return <PaidTimeAlert onClose={removeThisAlert} closeTimeout={10000} {...typedOptions} />;
    }
    case 'internet_disconnected': {
      return <InternetDisconnectedAlert isClosable={false} />;
    }
  }
};

export default AlertInitializer;
