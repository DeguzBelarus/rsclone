import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import { WritableDraft } from 'immer/dist/internal';
import jwtDecode from 'jwt-decode';

import {
  CurrentLanguageType,
  IAuthResponse,
  ILocalStorageSaveData,
  ILoginRequestData,
  IRegistrationRequestData,
  ITokenDecodeData,
  Nullable,
  RequestStatus,
  Undefinable,
  AlertMessage,
} from 'types/types';
import { requestData, requestMethods } from './dataAPI';

interface MainState {
  isAuthorized: boolean;
  userId: Nullable<number>;
  userEmail: Nullable<string>;
  userNickname: Nullable<string>;
  userRole: Nullable<string>;
  currentLanguage: CurrentLanguageType;
  alert: Nullable<AlertMessage>;
  userRequestStatus: RequestStatus;
}

const initialState: MainState = {
  isAuthorized: false,
  userId: null,
  userEmail: null,
  userNickname: null,
  userRole: null,
  currentLanguage: 'en',
  alert: null,
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
      const createUserResponseData: IAuthResponse = await createUserResponse.json();
      return createUserResponseData;
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
      const loginUserResponseData: IAuthResponse = await loginUserResponse.json();
      return loginUserResponseData;
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
      const authCheckResponseData: IAuthResponse = await authCheckResponse.json();
      return authCheckResponseData;
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
    setAlert(state: WritableDraft<MainState>, { payload }: PayloadAction<Nullable<AlertMessage>>) {
      state.alert = payload;
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
            const tokenDecodeData: ITokenDecodeData = jwtDecode(payload.token);
            state.userId = tokenDecodeData.id;
            state.userEmail = tokenDecodeData.email;
            state.userNickname = tokenDecodeData.nickname;
            state.userRole = tokenDecodeData.role;
            state.isAuthorized = true;

            const save: Nullable<string> = localStorage.getItem('rsclone-save');
            if (save) {
              const saveData: ILocalStorageSaveData = JSON.parse(save);
              saveData.token = payload.token;
              localStorage.setItem('rsclone-save', JSON.stringify(saveData));
            } else {
              const saveData: ILocalStorageSaveData = { token: payload.token };
              localStorage.setItem('rsclone-save', JSON.stringify(saveData));
            }
            state.alert = { message: payload.message, severity: 'success' };
          }
          state.alert = { message: payload.message, severity: payload.token ? 'success' : 'error' };
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
            const tokenDecodeData: ITokenDecodeData = jwtDecode(payload.token);
            state.userId = tokenDecodeData.id;
            state.userEmail = tokenDecodeData.email;
            state.userNickname = tokenDecodeData.nickname;
            state.userRole = tokenDecodeData.role;
            state.isAuthorized = true;

            const save: Nullable<string> = localStorage.getItem('rsclone-save');
            if (save) {
              const saveData: ILocalStorageSaveData = JSON.parse(save);
              saveData.token = payload.token;
              localStorage.setItem('rsclone-save', JSON.stringify(saveData));
            } else {
              const saveData: ILocalStorageSaveData = { token: payload.token };
              localStorage.setItem('rsclone-save', JSON.stringify(saveData));
            }
          }
          state.alert = { message: payload.message, severity: payload.token ? 'success' : 'error' };
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
            const tokenDecodeData: ITokenDecodeData = jwtDecode(payload.token);
            state.userId = tokenDecodeData.id;
            state.userEmail = tokenDecodeData.email;
            state.userNickname = tokenDecodeData.nickname;
            state.userRole = tokenDecodeData.role;
            state.isAuthorized = true;

            const save: Nullable<string> = localStorage.getItem('rsclone-save');
            if (save) {
              const saveData: ILocalStorageSaveData = JSON.parse(save);
              saveData.token = payload.token;
              localStorage.setItem('rsclone-save', JSON.stringify(saveData));
            } else {
              const saveData: ILocalStorageSaveData = { token: payload.token };
              localStorage.setItem('rsclone-save', JSON.stringify(saveData));
            }
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
    setAlert,
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
export const getAlert = ({ main: { alert } }: RootState) => alert;

export const { reducer } = mainSlice;
