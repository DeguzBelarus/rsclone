import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import { WritableDraft } from 'immer/dist/internal';
import jwtDecode from 'jwt-decode';

import {
  CurrentLanguageType,
  IAuthResponse,
  ILoginRequestData,
  IRegistrationRequestData,
  ITokenDecodeData,
  Nullable,
  RequestStatus,
  Undefinable,
} from 'types/types';
import { requestData, requestMethods } from './dataAPI';

interface MainState {
  isAuthorized: boolean;
  userId: Nullable<number>;
  userEmail: Nullable<string>;
  userNickname: Nullable<string>;
  userRole: Nullable<string>;
  currentLanguage: CurrentLanguageType;
  authMessage: Nullable<string>;
  userRequestStatus: RequestStatus;
}

const initialState: MainState = {
  isAuthorized: false,
  userId: null,
  userEmail: null,
  userNickname: null,
  userRole: null,
  currentLanguage: 'en',
  authMessage: null,
  userRequestStatus: 'idle',
};

// thunks
// authorization thunks
// registration thunk
export const registrationUserAsync = createAsyncThunk(
  'user/registration',
  async (data: IRegistrationRequestData): Promise<Nullable<IAuthResponse>> => {
    const registrationURL = '/api/user/registration';
    const createUserResponse: Undefinable<Response> = await requestData(
      registrationURL,
      requestMethods.post,
      JSON.stringify(data)
    );
    if (createUserResponse) {
      if (createUserResponse?.ok) {
        const createUserResponseData: IAuthResponse = await createUserResponse.json();
        return createUserResponseData;
      }
    }
    return null;
  }
);

// login thunk
export const loginUserAsync = createAsyncThunk(
  'user/login',
  async (data: ILoginRequestData): Promise<Nullable<IAuthResponse>> => {
    const loginURL = '/api/user/login';
    const loginUserResponse: Undefinable<Response> = await requestData(
      loginURL,
      requestMethods.post,
      JSON.stringify(data)
    );
    if (loginUserResponse) {
      if (loginUserResponse?.ok) {
        const loginUserResponseData: IAuthResponse = await loginUserResponse.json();
        return loginUserResponseData;
      }
    }
    return null;
  }
);

// auth check thunk
export const authCheckUserAsync = createAsyncThunk(
  'user/auth-check',
  async (token: string): Promise<Nullable<IAuthResponse>> => {
    const authCheckURL = '/api/user/authcheck';
    const authCheckResponse: Undefinable<Response> = await requestData(
      authCheckURL,
      requestMethods.get,
      undefined,
      token
    );
    if (authCheckResponse) {
      if (authCheckResponse?.ok) {
        const authCheckResponseData: IAuthResponse = await authCheckResponse.json();
        return authCheckResponseData;
      }
    }
    return null;
  }
);

export const mainSlice = createSlice({
  name: 'main',
  initialState,
  reducers: {
    setCurrentLanguage(
      state: WritableDraft<MainState>,
      { payload }: PayloadAction<CurrentLanguageType>
    ) {
      state.currentLanguage = payload;
    },
    setAuthMessage(state: WritableDraft<MainState>, { payload }: PayloadAction<Nullable<string>>) {
      state.authMessage = payload;
    },
    setUserId(state: WritableDraft<MainState>, { payload }: PayloadAction<Nullable<number>>) {
      state.userId = payload;
    },
    setUserEmail(state: WritableDraft<MainState>, { payload }: PayloadAction<Nullable<string>>) {
      state.userEmail = payload;
    },
    setUserNickname(state: WritableDraft<MainState>, { payload }: PayloadAction<Nullable<string>>) {
      state.userNickname = payload;
    },
    setUserRole(state: WritableDraft<MainState>, { payload }: PayloadAction<Nullable<string>>) {
      state.userRole = payload;
    },
    setIsAuthorized(state: WritableDraft<MainState>, { payload }: PayloadAction<boolean>) {
      state.isAuthorized = payload;
    },
  },
  extraReducers: (builder) => {
    builder

      // create a new user
      .addCase(registrationUserAsync.pending, (state) => {
        state.userRequestStatus = 'loading';
      })
      .addCase(registrationUserAsync.fulfilled, (state, { payload }) => {
        state.userRequestStatus = 'idle';

        if (payload) {
          if (payload.token) {
            state.authMessage = payload.message;
            const tokenDecodeData: ITokenDecodeData = jwtDecode(payload.token);
            state.userId = tokenDecodeData.id;
            state.userEmail = tokenDecodeData.email;
            state.userNickname = tokenDecodeData.nickname;
            state.userRole = tokenDecodeData.role;
            state.isAuthorized = true;
          } else {
            state.authMessage = payload.message;
          }
        }
      })
      .addCase(registrationUserAsync.rejected, (state, { error }) => {
        state.userRequestStatus = 'failed';
        console.error('\x1b[40m\x1b[31m\x1b[1m', error.message);
      })

      // login user
      .addCase(loginUserAsync.pending, (state) => {
        state.userRequestStatus = 'loading';
      })
      .addCase(loginUserAsync.fulfilled, (state, { payload }) => {
        state.userRequestStatus = 'idle';

        if (payload) {
          if (payload.token) {
            state.authMessage = payload.message;
            const tokenDecodeData: ITokenDecodeData = jwtDecode(payload.token);
            state.userId = tokenDecodeData.id;
            state.userEmail = tokenDecodeData.email;
            state.userNickname = tokenDecodeData.nickname;
            state.userRole = tokenDecodeData.role;
            state.isAuthorized = true;
          } else {
            state.authMessage = payload.message;
          }
        }
      })
      .addCase(loginUserAsync.rejected, (state, { error }) => {
        state.userRequestStatus = 'failed';
        console.error('\x1b[40m\x1b[31m\x1b[1m', error.message);
      })

      // check of user authorization
      .addCase(authCheckUserAsync.pending, (state) => {
        state.userRequestStatus = 'loading';
      })
      .addCase(authCheckUserAsync.fulfilled, (state, { payload }) => {
        state.userRequestStatus = 'idle';

        if (payload) {
          if (payload.token) {
            state.authMessage = payload.message;
            const tokenDecodeData: ITokenDecodeData = jwtDecode(payload.token);
            state.userId = tokenDecodeData.id;
            state.userEmail = tokenDecodeData.email;
            state.userNickname = tokenDecodeData.nickname;
            state.userRole = tokenDecodeData.role;
            state.isAuthorized = true;
          } else {
            state.authMessage = payload.message;
          }
        }
      })
      .addCase(authCheckUserAsync.rejected, (state, { error }) => {
        state.userRequestStatus = 'failed';
        console.error('\x1b[40m\x1b[31m\x1b[1m', error.message);
      });
  },
});

export const {
  actions: {
    setCurrentLanguage,
    setAuthMessage,
    setUserNickname,
    setUserEmail,
    setUserId,
    setUserRole,
    setIsAuthorized,
  },
} = mainSlice;

export const getIsAuthorized = ({ main: { isAuthorized } }: RootState) => isAuthorized;
export const getUserId = ({ main: { userId } }: RootState) => userId;
export const getUserEmail = ({ main: { userEmail } }: RootState) => userEmail;
export const getUserNickname = ({ main: { userNickname } }: RootState) => userNickname;
export const getUserRole = ({ main: { userRole } }: RootState) => userRole;
export const getCurrentLanguage = ({ main: { currentLanguage } }: RootState) => currentLanguage;
export const getAuthMessage = ({ main: { authMessage } }: RootState) => authMessage;

export const { reducer } = mainSlice;
