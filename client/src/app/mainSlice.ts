import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import { WritableDraft } from 'immer/dist/internal';
import jwtDecode from 'jwt-decode';

import {
  CurrentLanguageType,
  IAuthResponse,
  ILoginRequestData,
  IRegistrationRequestData,
  IFullUserData,
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
  IGetUsersRequestData,
  ISearchUsersResponse,
  ITokenDecodeData,
  IAuthCheckRequestData,
  IPostModel,
  IMessageModel,
  ICreatePostRequestData,
  ICreatePostResponse,
} from 'types/types';
import { requestData, requestMethods } from './dataAPI';
import { setLocalStorageData } from './storage';

interface MainState {
  posts: Array<IPostModel>;
  currentPost: Nullable<IPostModel>;
  messages: Array<IMessageModel>;
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
  foundUsers: Nullable<ISearchUsersResponse>;
  guestUserData: Nullable<IFullUserData>;
  currentLanguage: CurrentLanguageType;
  currentColorTheme: CurrentColorTheme;
  usersOnline: Array<string>;
  isLoginNotificationSent: boolean;
  alert: Nullable<AlertMessage>;
  userRequestStatus: RequestStatus;
}

const initialState: MainState = {
  posts: [],
  currentPost: null,
  messages: [],
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
  foundUsers: null,
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
  state.foundUsers = null;
  state.guestUserData = null;
  state.isLoginNotificationSent = false;
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
      if (!createUserResponse.ok) {
        const createUserResponseData: IAuthResponse = await createUserResponse.json();
        return createUserResponseData;
      } else {
        const params = new URLSearchParams();
        params.set('lang', data.lang);

        const createUserResponseData: IAuthResponse = await createUserResponse.json();
        if (createUserResponseData.token) {
          const tokenDecodeData: ITokenDecodeData = jwtDecode(createUserResponseData.token);

          const getOneUserURL = `/api/user/${tokenDecodeData.id}?${params}`;
          const getOneUserResponse: Undefinable<Response> = await requestData(
            getOneUserURL,
            requestMethods.get,
            undefined,
            createUserResponseData.token
          );
          if (getOneUserResponse) {
            const getOneUserResponseData: IGetOneUserResponse = await getOneUserResponse.json();
            getOneUserResponseData.token = createUserResponseData.token;
            getOneUserResponseData.message = createUserResponseData.message;
            return getOneUserResponseData;
          }
        }
      }
    }
    return null;
  }
);

// login thunk
export const loginUserAsync = createAsyncThunk(
  'user/login',
  async (data: ILoginRequestData): Promise<Nullable<IAuthResponse | IGetOneUserResponse>> => {
    const loginURL = '/api/user/login';
    const loginUserResponse: Undefinable<Response> = await requestData(
      loginURL,
      requestMethods.post,
      JSON.stringify(data)
    );
    if (loginUserResponse) {
      if (!loginUserResponse.ok) {
        const loginUserResponseData: IAuthResponse = await loginUserResponse.json();
        return loginUserResponseData;
      } else {
        const params = new URLSearchParams();
        params.set('lang', data.lang);

        const loginUserResponseData: IAuthResponse = await loginUserResponse.json();
        if (loginUserResponseData.token) {
          const tokenDecodeData: ITokenDecodeData = jwtDecode(loginUserResponseData.token);

          const getOneUserURL = `/api/user/${tokenDecodeData.id}?${params}`;
          const getOneUserResponse: Undefinable<Response> = await requestData(
            getOneUserURL,
            requestMethods.get,
            undefined,
            loginUserResponseData.token
          );
          if (getOneUserResponse) {
            const getOneUserResponseData: IGetOneUserResponse = await getOneUserResponse.json();
            getOneUserResponseData.token = loginUserResponseData.token;
            getOneUserResponseData.message = loginUserResponseData.message;
            return getOneUserResponseData;
          }
        }
      }
    }
    return null;
  }
);

// auth check thunk
export const authCheckUserAsync = createAsyncThunk(
  'user/auth-check',
  async (data: IAuthCheckRequestData): Promise<Nullable<IAuthResponse | IGetOneUserResponse>> => {
    const authCheckURL = '/api/user/authcheck';
    const authCheckResponse: Undefinable<Response> = await requestData(
      authCheckURL,
      requestMethods.get,
      undefined,
      data.token
    );
    if (authCheckResponse) {
      if (!authCheckResponse.ok) {
        const authCheckResponseData: IAuthResponse = await authCheckResponse.json();
        return authCheckResponseData;
      } else {
        const params = new URLSearchParams();
        params.set('lang', data.lang);

        const authCheckResponseData: IAuthResponse = await authCheckResponse.json();
        if (authCheckResponseData.token) {
          const tokenDecodeData: ITokenDecodeData = jwtDecode(authCheckResponseData.token);

          const getOneUserURL = `/api/user/${tokenDecodeData.id}?${params}`;
          const getOneUserResponse: Undefinable<Response> = await requestData(
            getOneUserURL,
            requestMethods.get,
            undefined,
            data.token
          );
          if (getOneUserResponse) {
            const getOneUserResponseData: IGetOneUserResponse = await getOneUserResponse.json();
            getOneUserResponseData.token = authCheckResponseData.token;
            getOneUserResponseData.message = authCheckResponseData.message;
            return getOneUserResponseData;
          }
        }
      }
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

// get users by search key info
export const getUsersAsync = createAsyncThunk(
  'user/get-all',
  async (data: IGetUsersRequestData): Promise<Nullable<ISearchUsersResponse>> => {
    const params = new URLSearchParams();
    params.set('lang', data.lang);
    params.set('searchKey', data.searchKey);

    const getUsersURL = `/api/user/?${params}`;
    const getUsersResponse: Undefinable<Response> = await requestData(
      getUsersURL,
      requestMethods.get,
      undefined,
      undefined
    );
    if (getUsersResponse) {
      const getUsersResponseData: ISearchUsersResponse = await getUsersResponse.json();
      return getUsersResponseData;
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

// posts thunks
// create a new post
export const createPostAsync = createAsyncThunk(
  'post/create',
  async (
    data: ICreatePostRequestData
  ): Promise<Nullable<ICreatePostResponse | IGetOneUserResponse>> => {
    const createPostURL = `/api/post/${data.ownId}/creation`;
    const createPostResponse: Undefinable<Response> = await requestData(
      createPostURL,
      requestMethods.post,
      data.requestData,
      data.token
    );
    if (createPostResponse) {
      if (!createPostResponse.ok) {
        const createPostResponseData: ICreatePostResponse = await createPostResponse.json();
        createPostResponseData.statusCode = createPostResponse.status;
        return createPostResponseData;
      } else {
        const params = new URLSearchParams();
        params.set('lang', String(data.requestData.get('lang')));

        const getOneUserURL = `/api/user/${data.ownId}?${params}`;
        const getOneUserResponse: Undefinable<Response> = await requestData(
          getOneUserURL,
          requestMethods.get,
          undefined,
          data.token
        );
        if (getOneUserResponse) {
          const createPostResponseData: ICreatePostResponse = await createPostResponse.json();
          const getOneUserResponseData: IGetOneUserResponse = await getOneUserResponse.json();
          getOneUserResponseData.message = createPostResponseData.message;
          return getOneUserResponseData;
        }
      }
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
      { payload }: PayloadAction<Nullable<ISearchUsersResponse>>
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
      { payload }: PayloadAction<Nullable<IFullUserData>>
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
    setPosts(state: WritableDraft<MainState>, { payload }: PayloadAction<Array<IPostModel>>) {
      state.posts = payload;
    },
    setMessages(state: WritableDraft<MainState>, { payload }: PayloadAction<Array<IMessageModel>>) {
      state.messages = payload;
    },
    setCurrentPost(
      state: WritableDraft<MainState>,
      { payload }: PayloadAction<Nullable<IPostModel>>
    ) {
      state.currentPost = payload;
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
            const fullUserData = payload as IGetOneUserResponse;
            const tokenDecodeData: ITokenDecodeData = jwtDecode(payload.token);
            state.userId = tokenDecodeData.id;
            state.userEmail = tokenDecodeData.email;
            state.userNickname = tokenDecodeData.nickname;
            state.userRole = tokenDecodeData.role;
            state.isAuthorized = true;
            state.token = payload.token;
            setLocalStorageData({ token: payload.token });
            if (fullUserData.userData?.age !== undefined) {
              state.userAge = fullUserData.userData.age;
            }
            if (fullUserData.userData?.country !== undefined) {
              state.userCountry = fullUserData.userData.country;
            }
            if (fullUserData.userData?.city !== undefined) {
              state.userCity = fullUserData.userData.city;
            }
            if (fullUserData.userData?.avatar !== undefined) {
              state.avatarSrc = fullUserData.userData.avatar;
            }
            if (fullUserData.userData?.firstName !== undefined) {
              state.userFirstName = fullUserData.userData.firstName;
            }
            if (fullUserData.userData?.lastName !== undefined) {
              state.userLastName = fullUserData.userData.lastName;
            }
            if (fullUserData.userData?.posts !== undefined) {
              state.posts = fullUserData.userData.posts;
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
            const fullUserData = payload as IGetOneUserResponse;
            if (fullUserData.userData?.id !== undefined) {
              state.userId = fullUserData.userData.id;
            }
            if (fullUserData.userData?.email !== undefined) {
              state.userEmail = fullUserData.userData.email;
            }
            if (fullUserData.userData?.nickname !== undefined) {
              state.userNickname = fullUserData.userData.nickname;
            }
            if (fullUserData.userData?.role !== undefined) {
              state.userRole = fullUserData.userData.role;
            }
            state.isAuthorized = true;
            state.token = payload.token;
            setLocalStorageData({ token: payload.token });
            if (fullUserData.userData?.age !== undefined) {
              state.userAge = fullUserData.userData.age;
            }
            if (fullUserData.userData?.country !== undefined) {
              state.userCountry = fullUserData.userData.country;
            }
            if (fullUserData.userData?.city !== undefined) {
              state.userCity = fullUserData.userData.city;
            }
            if (fullUserData.userData?.avatar !== undefined) {
              state.avatarSrc = fullUserData.userData.avatar;
            }
            if (fullUserData.userData?.firstName !== undefined) {
              state.userFirstName = fullUserData.userData.firstName;
            }
            if (fullUserData.userData?.lastName !== undefined) {
              state.userLastName = fullUserData.userData.lastName;
            }
            if (fullUserData.userData?.posts !== undefined) {
              state.posts = fullUserData.userData.posts;
            }
          }
        }
      })
      .addCase(authCheckUserAsync.rejected, (state, { error }) => {
        state.userRequestStatus = 'failed';
        console.error('\x1b[40m\x1b[31m\x1b[1m', error.message);
      })

      // get users by search key info
      .addCase(getUsersAsync.pending, (state) => {
        state.userRequestStatus = 'loading';
      })
      .addCase(getUsersAsync.fulfilled, (state, { payload }) => {
        state.userRequestStatus = 'idle';

        if (payload) {
          state.foundUsers = payload;
        }
      })
      .addCase(getUsersAsync.rejected, (state, { error }) => {
        state.userRequestStatus = 'failed';
        console.error('\x1b[40m\x1b[31m\x1b[1m', error.message);
      })

      // get specified user data
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
              if (payload.userData?.posts !== undefined) {
                state.posts = payload.userData.posts;
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
              if (state.userId !== successUpdatePayload.ownId && successUpdatePayload.userData) {
                state.guestUserData = successUpdatePayload.userData;
              } else {
                if (successUpdatePayload.userData.email !== undefined) {
                  state.userEmail = successUpdatePayload.userData.email;
                }
                if (successUpdatePayload.userData.nickname !== undefined) {
                  state.userNickname = successUpdatePayload.userData.nickname;
                }
                if (successUpdatePayload.userData.role !== undefined) {
                  state.userRole = successUpdatePayload.userData.role;
                }
                if (successUpdatePayload.userData.age !== undefined) {
                  state.userAge = successUpdatePayload.userData.age;
                }
                if (successUpdatePayload.userData.country !== undefined) {
                  state.userCountry = successUpdatePayload.userData.country;
                }
                if (successUpdatePayload.userData.city !== undefined) {
                  state.userCity = successUpdatePayload.userData.city;
                }
                if (successUpdatePayload.userData.firstName !== undefined) {
                  state.userFirstName = successUpdatePayload.userData.firstName;
                }
                if (successUpdatePayload.userData.lastName !== undefined) {
                  state.userLastName = successUpdatePayload.userData.lastName;
                }
                if (successUpdatePayload.userData.avatar !== undefined) {
                  state.avatarSrc = successUpdatePayload.userData.avatar;
                }
                if (successUpdatePayload.userData.posts !== undefined) {
                  state.posts = successUpdatePayload.userData.posts;
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
      })

      // create a new post
      .addCase(createPostAsync.pending, (state) => {
        state.userRequestStatus = 'loading';
      })
      .addCase(createPostAsync.fulfilled, (state, { payload }) => {
        state.userRequestStatus = 'idle';

        if (payload) {
          const successCreationPostData = payload as IGetOneUserResponse;
          if (
            (payload.statusCode === 201 || payload.statusCode === 200) &&
            successCreationPostData.userData?.posts
          ) {
            state.posts = successCreationPostData.userData.posts;
          }
          state.alert = {
            message: payload.message,
            severity:
              payload.statusCode === 201 || payload.statusCode === 200 ? 'success' : 'error',
          };
        }
      })
      .addCase(createPostAsync.rejected, (state, { error }) => {
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
    setUserRequestStatus,
    setMessages,
    setPosts,
    setCurrentPost,
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
export const getPosts = ({ main: { posts } }: RootState) => posts;
export const getCurrentPost = ({ main: { currentPost } }: RootState) => currentPost;
export const getMessages = ({ main: { messages } }: RootState) => messages;

export const { reducer } = mainSlice;
