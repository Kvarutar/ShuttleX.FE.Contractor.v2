import { useEffect } from 'react';

import { useAppDispatch } from '../core/redux/hooks';
import { signalRThunks, updateSignalRAccessToken } from '../core/redux/signalr';
import { InitialSetupProps } from './types';

const InitialSetup = ({ children }: InitialSetupProps) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    (async () => {
      // TODO: use actual access token
      dispatch(updateSignalRAccessToken('access token'));
      await dispatch(signalRThunks.connect());
    })();
  }, [dispatch]);

  return children;
};
export default InitialSetup;
