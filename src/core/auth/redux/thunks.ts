import { AxiosResponse } from 'axios';
import Keychain from 'react-native-keychain';
import { getNetworkErrorInfo, getTokens, saveTokens } from 'shuttlex-integration';

import { createAppAsyncThunk } from '../../redux/hooks';
import { setIsLoggedIn } from '.';
import {
  SignInAPIRequest,
  SignInPayload,
  SignOutAPIRequest,
  SignUpAPIRequest,
  SignUpPayload,
  VerifyCodeAPIRequest,
  VerifyCodeAPIResponse,
  VerifyCodePayload,
} from './types';

const formatePhone = (phone: string) => {
  return phone.replace(/[^+\d]/g, '');
};

export const signIn = createAppAsyncThunk<void, SignInPayload>(
  'auth/signIn',
  async (payload, { rejectWithValue, authAxios }) => {
    const { method, data } = payload;

    const requestData = method === 'phone' ? { phone: formatePhone(data) } : { email: data };
    const methodUrlPart = method === 'phone' ? 'sms' : 'email';

    try {
      //TODO: do firebase init
      //const deviceId = await getNotificationToken();
      const deviceId = 'string';

      await authAxios.post<SignInAPIRequest, void>(`/sign-in/${methodUrlPart}`, {
        ...requestData,
        deviceId,
      });
    } catch (error) {
      const { code, body, status } = getNetworkErrorInfo(error);
      return rejectWithValue({
        code,
        body,
        status,
      });
    }
  },
);

export const signUp = createAppAsyncThunk<void, SignUpPayload>(
  'auth/signUp',
  async (payload, { rejectWithValue, dispatch, authAxios }) => {
    try {
      await authAxios.post<SignUpAPIRequest, void>('/sign-up', {
        ...payload,
        phone: formatePhone(payload.phone),
      });

      await dispatch(
        signIn({ method: payload.method, data: payload.method === 'phone' ? payload.phone : payload.email }),
      );
    } catch (error) {
      const { code, body, status } = getNetworkErrorInfo(error);
      return rejectWithValue({
        code,
        body,
        status,
      });
    }
  },
);

export const signOut = createAppAsyncThunk<void, void>(
  'auth/signOut',
  async (_, { rejectWithValue, authAxios, dispatch }) => {
    //TODO: do firebase init
    //const deviceId = await getNotificationToken();
    const deviceId = 'string';
    const { refreshToken } = await getTokens();

    try {
      await Keychain.resetGenericPassword();

      if (refreshToken !== null) {
        await authAxios.post<SignOutAPIRequest>('/sign-out', {
          refreshToken,
          deviceId,
          allOpenSessions: false,
        });
      }

      dispatch(setIsLoggedIn(false));
    } catch (error) {
      const { code, body, status } = getNetworkErrorInfo(error);
      return rejectWithValue({
        code,
        body,
        status,
      });
    }
  },
);

export const verifyCode = createAppAsyncThunk<void, VerifyCodePayload>(
  'auth/verifyCode',
  async (payload, { rejectWithValue, authAxios }) => {
    //TODO: do firebase init
    //const deviceId = await getNotificationToken();
    const deviceId = 'string';

    let bodyPart;

    if (payload.method === 'phone') {
      bodyPart = { phone: formatePhone(payload.body) };
    } else if (payload.method === 'email') {
      bodyPart = { email: payload.body };
    }

    const methodUrlPart = payload.method === 'phone' ? 'sms' : 'email';

    try {
      const response = await authAxios.post<VerifyCodeAPIRequest, AxiosResponse<VerifyCodeAPIResponse>>(
        `/verify-code/${methodUrlPart}`,
        {
          ...bodyPart,
          code: payload.code,
          deviceId,
        },
      );

      await saveTokens({
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
      });
    } catch (error) {
      const { code, body, status } = getNetworkErrorInfo(error);
      return rejectWithValue({
        code,
        body,
        status,
      });
    }
  },
);
