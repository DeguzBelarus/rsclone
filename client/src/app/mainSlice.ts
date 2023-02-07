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
  AlertMessage,
  CurrentColorTheme,
  IGetOneUserRequestData,
  IGetOneUserResponse,
  IDeleteUserRequestData,
  IDeleteUserResponse,
  IUpdateUserResponse,
  RoleType,
  IUpdateUserRequestData,
} from 'types/types';
import { requestData, requestMethods } from './dataAPI';
import { setLocalStorageData } from './storage';

interface MainState {
  token: Nullable<string>;
  isAuthorized: boolean;
  userId: Nullable<number>;
  userEmail: Nullable<string>;
  userNickname: Nullable<string>;
  userRole: Nullable<RoleType>;
  userAge: Nullable<number>;
  userCountry: Nullable<string>;
  userCity: Nullable<string>;
  userFirstName: Nullable<string>;
  userLastName: Nullable<string>;
  avatarSrc: Nullable<string>;
  foundUsers: Array<ITokenDecodeData>;
  guestUserData: Nullable<ITokenDecodeData>;
  currentLanguage: CurrentLanguageType;
  currentColorTheme: CurrentColorTheme;
  usersOnline: Array<string>;
  isLoginNotificationSent: boolean;
  alert: Nullable<AlertMessage>;
  userRequestStatus: RequestStatus;
}

const initialState: MainState = {
  token: null,
  isAuthorized: false,
  userId: null,
  userEmail: null,
  userNickname: null,
  userRole: null,
  userAge: null,
  userCountry: null,
  userCity: null,
  userFirstName: null,
  userLastName: null,
  avatarSrc: null,
  foundUsers: [],
  guestUserData: null,
  currentLanguage: 'en',
  currentColorTheme: 'white',
  usersOnline: [],
  isLoginNotificationSent: false,
  alert: null,
  userRequestStatus: 'idle',
};

const userReset = (state: WritableDraft<MainState>) => {
  state.token = null;
  state.isAuthorized = false;
  state.userId = null;
  state.userEmail = null;
  state.userNickname = null;
  state.userRole = null;
  state.userAge = null;
  state.userCountry = null;
  state.userCity = null;
  state.userFirstName = null;
  state.userLastName = null;
  state.avatarSrc = null;
  state.foundUsers = [];
  state.guestUserData = null;
  setLocalStorageData({ token: undefined });
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

// get user information thunks
// get specified user info
export const getOneUserInfoAsync = createAsyncThunk(
  'user/get-one',
  async (data: IGetOneUserRequestData): Promise<Nullable<IGetOneUserResponse>> => {
    const params = new URLSearchParams();
    params.set('lang', data.requestData.lang);

    const getOneUserURL = `/api/user/${data.requestData.id}?${params}`;
    const getOneUserResponse: Undefinable<Response> = await requestData(
      getOneUserURL,
      requestMethods.get,
      undefined,
      data.token
    );
    if (getOneUserResponse) {
      const getOneUserResponseData: IGetOneUserResponse = await getOneUserResponse.json();
      return getOneUserResponseData;
    }
    return null;
  }
);

// user settings thunks
// update specified user
export const updateUserAsync = createAsyncThunk(
  'user/update',
  async (
    data: IUpdateUserRequestData
  ): Promise<Nullable<IUpdateUserResponse | IGetOneUserResponse>> => {
    const updateUserURL = `/api/user/${data.requestData.get('id')}/update`;
    const updateUserResponse: Undefinable<Response> = await requestData(
      updateUserURL,
      requestMethods.put,
      data.requestData,
      data.token
    );
    if (updateUserResponse?.ok) {
      const params = new URLSearchParams();
      params.set('lang', String(data.requestData.get('lang')));

      let getOneUserURL: string;
      if (Number(data.requestData.get('id')) === data.ownId) {
        getOneUserURL = `/api/user/${data.ownId}?${params}`;
      } else {
        getOneUserURL = `/api/user/${data.requestData.get('id')}?${params}`;
      }
      const getOneUserResponse: Undefinable<Response> = await requestData(
        getOneUserURL,
        requestMethods.get,
        undefined,
        data.token
      );
      if (getOneUserResponse) {
        const updateUserResponseData: IUpdateUserResponse = await updateUserResponse.json();
        const getOneUserResponseData: IGetOneUserResponse = await getOneUserResponse.json();
        getOneUserResponseData.ownId = data.ownId;
        getOneUserResponseData.statusCode = getOneUserResponse.status;
        getOneUserResponseData.message = updateUserResponseData.message;
        return getOneUserResponseData;
      }
    } else {
      if (updateUserResponse) {
        const updateUserResponseData: IUpdateUserResponse = await updateUserResponse.json();
        updateUserResponseData.statusCode = updateUserResponse.status;
        return updateUserResponseData;
      }
    }
    return null;
  }
);

// delete specified user
export const deleteUserAsync = createAsyncThunk(
  'user/delete',
  async (data: IDeleteUserRequestData): Promise<Nullable<IDeleteUserResponse>> => {
    const params = new URLSearchParams();
    params.set('lang', data.requestData.lang);

    const deleteUserURL = `/api/user/${data.requestData.id}/delete?${params}`;
    const deleteUserResponse: Undefinable<Response> = await requestData(
      deleteUserURL,
      requestMethods.delete,
      undefined,
      data.token
    );
    if (deleteUserResponse) {
      const deleteUserResponseData: IDeleteUserResponse = await deleteUserResponse.json();
      deleteUserResponseData.statusCode = deleteUserResponse.status;
      deleteUserResponseData.ownId = data.requestData.ownId;
      return deleteUserResponseData;
    }
    return null;
  }
);

export const mainSlice = createSlice({
  name: 'main',
  initialState,
  reducers: {
    setToken(state: WritableDraft<MainState>, { payload }: PayloadAction<Nullable<string>>) {
      state.token = payload;
    },
    setCurrentLanguage(
      state: WritableDraft<MainState>,
      { payload }: PayloadAction<CurrentLanguageType>
    ) {
      state.currentLanguage = payload;
      setLocalStorageData({ currentLanguage: payload });
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
    setUserRole(state: WritableDraft<MainState>, { payload }: PayloadAction<Nullable<RoleType>>) {
      state.userRole = payload;
    },
    setIsAuthorized(state: WritableDraft<MainState>, { payload }: PayloadAction<boolean>) {
      state.isAuthorized = payload;
      if (!payload) setLocalStorageData({ token: undefined });
    },
    setUserAge(state: WritableDraft<MainState>, { payload }: PayloadAction<Nullable<number>>) {
      state.userAge = payload;
    },
    setUserCountry(state: WritableDraft<MainState>, { payload }: PayloadAction<Nullable<string>>) {
      state.userCountry = payload;
    },
    setUserCity(state: WritableDraft<MainState>, { payload }: PayloadAction<Nullable<string>>) {
      state.userCity = payload;
    },
    setUserFirstName(
      state: WritableDraft<MainState>,
      { payload }: PayloadAction<Nullable<string>>
    ) {
      state.userFirstName = payload;
    },
    setUserLastName(state: WritableDraft<MainState>, { payload }: PayloadAction<Nullable<string>>) {
      state.userLastName = payload;
    },
    setAvatarSrc(state: WritableDraft<MainState>, { payload }: PayloadAction<Nullable<string>>) {
      state.avatarSrc = payload;
    },
    setFoundUsers(
      state: WritableDraft<MainState>,
      { payload }: PayloadAction<Array<ITokenDecodeData>>
    ) {
      state.foundUsers = payload;
    },
    setCurrentColorTheme(
      state: WritableDraft<MainState>,
      { payload }: PayloadAction<CurrentColorTheme>
    ) {
      state.currentColorTheme = payload;
    },
    setGuestUserData(
      state: WritableDraft<MainState>,
      { payload }: PayloadAction<Nullable<ITokenDecodeData>>
    ) {
      state.guestUserData = payload;
    },
    setUsersOnline(state: WritableDraft<MainState>, { payload }: PayloadAction<Array<string>>) {
      state.usersOnline = payload;
    },
    setIsLoginNotificationSent(
      state: WritableDraft<MainState>,
      { payload }: PayloadAction<boolean>
    ) {
      state.isLoginNotificationSent = payload;
    },
    setUserRequestStatus(
      state: WritableDraft<MainState>,
      { payload }: PayloadAction<RequestStatus>
    ) {
      state.userRequestStatus = payload;
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
            state.token = payload.token;
            setLocalStorageData({ token: payload.token });
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
            state.token = payload.token;
            setLocalStorageData({ token: payload.token });
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
            state.token = payload.token;
            setLocalStorageData({ token: payload.token });
          }
        }
      })
      .addCase(authCheckUserAsync.rejected, (state, { error }) => {
        state.userRequestStatus = 'failed';
        console.error('\x1b[40m\x1b[31m\x1b[1m', error.message);
      })

      // get specified user authorization
      .addCase(getOneUserInfoAsync.pending, (state) => {
        state.userRequestStatus = 'loading';
      })
      .addCase(getOneUserInfoAsync.fulfilled, (state, { payload }) => {
        state.userRequestStatus = 'idle';

        if (payload) {
          if (payload.userData) {
            if (payload.userData.id !== state.userId) {
              state.guestUserData = payload.userData;
            } else {
              if (state.userId !== payload.userData.id) {
                state.userId = payload.userData.id;
              }
              if (state.userEmail !== payload.userData.email) {
                state.userEmail = payload.userData.email;
              }
              if (state.userNickname !== payload.userData.nickname) {
                state.userNickname = payload.userData.nickname;
              }
              if (state.userRole !== payload.userData.role) {
                state.userRole = payload.userData.role;
              }
              if (payload.userData.age) {
                state.userAge = payload.userData.age;
              }
              if (payload.userData.country) {
                state.userCountry = payload.userData.country;
              }
              if (payload.userData.city) {
                state.userCity = payload.userData.city;
              }
              if (payload.userData.firstName) {
                state.userFirstName = payload.userData.firstName;
              }
              if (payload.userData.lastName) {
                state.userLastName = payload.userData.lastName;
              }
              if (payload.userData.avatar) {
                state.avatarSrc = payload.userData.avatar;
              }
            }
          }
        }
      })
      .addCase(getOneUserInfoAsync.rejected, (state, { error }) => {
        state.userRequestStatus = 'failed';
        console.error('\x1b[40m\x1b[31m\x1b[1m', error.message);
      })

      // update user
      .addCase(updateUserAsync.pending, (state) => {
        state.userRequestStatus = 'loading';
      })
      .addCase(updateUserAsync.fulfilled, (state, { payload }) => {
        state.userRequestStatus = 'idle';

        if (payload) {
          const successUpdatePayload: IGetOneUserResponse = payload;
          const failUpdatePayload: IUpdateUserResponse = payload;
          if (payload.statusCode === 200) {
            if (successUpdatePayload.userData) {
              if (state.userId !== successUpdatePayload.ownId) {
                state.guestUserData = successUpdatePayload.userData;
              } else {
                if (state.userId !== successUpdatePayload.userData.id) {
                  state.userId = successUpdatePayload.userData.id;
                }
                if (state.userEmail !== successUpdatePayload.userData.email) {
                  state.userEmail = successUpdatePayload.userData.email;
                }
                if (state.userNickname !== successUpdatePayload.userData.nickname) {
                  state.userNickname = successUpdatePayload.userData.nickname;
                }
                if (state.userRole !== successUpdatePayload.userData.role) {
                  state.userRole = successUpdatePayload.userData.role;
                }
                if (successUpdatePayload.userData.age) {
                  state.userAge = successUpdatePayload.userData.age;
                }
                if (successUpdatePayload.userData.country) {
                  state.userCountry = successUpdatePayload.userData.country;
                }
                if (successUpdatePayload.userData.city) {
                  state.userCity = successUpdatePayload.userData.city;
                }
                if (successUpdatePayload.userData.firstName) {
                  state.userFirstName = successUpdatePayload.userData.firstName;
                }
                if (successUpdatePayload.userData.lastName) {
                  state.userLastName = successUpdatePayload.userData.lastName;
                }
                if (successUpdatePayload.userData.avatar !== undefined) {
                  state.avatarSrc = successUpdatePayload.userData.avatar;
                }
              }

              state.alert = {
                message: payload.message,
                severity: 'success',
              };
            } else {
              state.alert = {
                message: failUpdatePayload.message,
                severity: 'error',
              };
            }
          }
        }
      })
      .addCase(updateUserAsync.rejected, (state, { error }) => {
        state.userRequestStatus = 'failed';
        console.error('\x1b[40m\x1b[31m\x1b[1m', error.message);
      })

      // delete user
      .addCase(deleteUserAsync.pending, (state) => {
        state.userRequestStatus = 'loading';
      })
      .addCase(deleteUserAsync.fulfilled, (state, { payload }) => {
        state.userRequestStatus = 'idle';

        if (payload) {
          if (payload.statusCode === 200) {
            if (state.userId === payload.ownId) {
              userReset(state);
            }

            state.alert = {
              message: payload.message,
              severity: 'success',
            };
          }
        }
      })
      .addCase(deleteUserAsync.rejected, (state, { error }) => {
        state.userRequestStatus = 'failed';
        console.error('\x1b[40m\x1b[31m\x1b[1m', error.message);
      });
  },
});

export const {
  actions: {
    setToken,
    setCurrentLanguage,
    setAlert,
    setUserNickname,
    setUserEmail,
    setUserId,
    setUserRole,
    setIsAuthorized,
    setUserAge,
    setUserCountry,
    setUserCity,
    setUserFirstName,
    setUserLastName,
    setAvatarSrc,
    setFoundUsers,
    setCurrentColorTheme,
    setGuestUserData,
    setUsersOnline,
    setIsLoginNotificationSent,
  },
} = mainSlice;

export const getToken = ({ main: { token } }: RootState) => token;
export const getIsAuthorized = ({ main: { isAuthorized } }: RootState) => isAuthorized;
export const getUserId = ({ main: { userId } }: RootState) => userId;
export const getUserEmail = ({ main: { userEmail } }: RootState) => userEmail;
export const getUserNickname = ({ main: { userNickname } }: RootState) => userNickname;
export const getUserAge = ({ main: { userAge } }: RootState) => userAge;
export const getUserCountry = ({ main: { userCountry } }: RootState) => userCountry;
export const getUserCity = ({ main: { userCity } }: RootState) => userCity;
export const getUserFirstName = ({ main: { userFirstName } }: RootState) => userFirstName;
export const getUserLastName = ({ main: { userLastName } }: RootState) => userLastName;
export const getAvatarSrc = ({ main: { avatarSrc } }: RootState) => avatarSrc;
export const getFoundUsers = ({ main: { foundUsers } }: RootState) => foundUsers;
export const getGuestUserData = ({ main: { guestUserData } }: RootState) => guestUserData;
export const getUserRole = ({ main: { userRole } }: RootState) => userRole;
export const getUsersOnline = ({ main: { usersOnline } }: RootState) => usersOnline;
export const getIsLoginNotificationSent = ({ main: { isLoginNotificationSent } }: RootState) =>
  isLoginNotificationSent;
export const getCurrentLanguage = ({ main: { currentLanguage } }: RootState) => currentLanguage;
export const getCurrentColorTheme = ({ main: { currentColorTheme } }: RootState) =>
  currentColorTheme;
export const getAlert = ({ main: { alert } }: RootState) => alert;
export const getUserRequestStatus = ({ main: { userRequestStatus } }: RootState) =>
  userRequestStatus;

export const { reducer } = mainSlice;
