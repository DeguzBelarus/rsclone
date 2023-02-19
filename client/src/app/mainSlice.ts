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
  IDeletePostRequestData,
  IDeletePostResponse,
  IGetOnePostRequest,
  IGetOnePostResponse,
  IGetAllPostsRequest,
  IGetAllPostsResponse,
  IUpdatePostRequest,
  IUpdatePostResponse,
  ICreateCommentRequest,
  ICreateCommentResponse,
  IDeleteCommentRequest,
  IDeleteCommentResponse,
  IUpdateCommentRequest,
  IUpdateCommentResponse,
  IUserDialog,
  IGetDialogMessagesRequest,
  IGetDialogMessagesResponse,
  ISendMessageRequest,
  ISendMessageResponse,
  IDeleteMessageRequest,
  IDeleteMessageResponse,
  OpenChats,
} from 'types/types';
import { requestData, requestMethods } from './dataAPI';
import { setLocalStorageData } from './storage';

interface MainState {
  posts: Array<IPostModel>;
  dialogs: Array<IUserDialog>;
  currentDialogMessages: Nullable<Array<IMessageModel>>;
  unreadMessagesCount: number;
  allPosts: Array<IPostModel>;
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
  chats: OpenChats;
  activeChatId: Nullable<number>;
}

const initialState: MainState = {
  posts: [],
  dialogs: [],
  currentDialogMessages: null,
  unreadMessagesCount: 0,
  allPosts: [],
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
  currentColorTheme: 'light',
  usersOnline: [],
  isLoginNotificationSent: false,
  alert: null,
  userRequestStatus: 'idle',
  chats: [],
  activeChatId: null,
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
  state.chats = [];
  state.activeChatId = null;
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
          getOneUserResponseData.statusCode = createPostResponse.status;
          return getOneUserResponseData;
        }
      }
    }
    return null;
  }
);

// delete the specified post
export const deletePostAsync = createAsyncThunk(
  'post/delete',
  async (
    data: IDeletePostRequestData
  ): Promise<Nullable<IDeleteUserResponse | IGetOneUserResponse>> => {
    const params = new URLSearchParams();
    params.set('lang', data.lang);

    const deletePostURL = `/api/post/${data.id}/delete?${params}`;
    const deletePostResponse: Undefinable<Response> = await requestData(
      deletePostURL,
      requestMethods.delete,
      undefined,
      data.token
    );
    if (deletePostResponse) {
      const deletePostResponseData: IDeletePostResponse = await deletePostResponse.json();
      if (!deletePostResponse.ok || deletePostResponse.status === 204) {
        deletePostResponseData.statusCode = deletePostResponse.status;
        return deletePostResponseData;
      } else {
        const params = new URLSearchParams();
        params.set('lang', data.lang);

        const getOneUserURL = `/api/user/${deletePostResponseData.postOwnerId}?${params}`;
        const getOneUserResponse: Undefinable<Response> = await requestData(
          getOneUserURL,
          requestMethods.get,
          undefined,
          data.token
        );
        if (getOneUserResponse) {
          const getOneUserResponseData: IGetOneUserResponse = await getOneUserResponse.json();
          getOneUserResponseData.message = deletePostResponseData.message;
          getOneUserResponseData.statusCode = deletePostResponse.status;
          return getOneUserResponseData;
        }
      }
    }
    return null;
  }
);

// get all posts data
export const getAllPostsAsync = createAsyncThunk(
  'post/get-all',
  async (data: IGetAllPostsRequest): Promise<Nullable<IGetAllPostsResponse>> => {
    const params = new URLSearchParams();
    params.set('lang', data.lang);

    const getAllPostsURL = `/api/post/?${params}`;
    const getAllPostsResponse: Undefinable<Response> = await requestData(
      getAllPostsURL,
      requestMethods.get,
      undefined,
      undefined
    );
    if (getAllPostsResponse) {
      const getAllPostsResponseData: IGetAllPostsResponse = await getAllPostsResponse.json();
      return getAllPostsResponseData;
    }
    return null;
  }
);

// get the specified post data
export const getOnePostAsync = createAsyncThunk(
  'post/get-one',
  async (data: IGetOnePostRequest): Promise<Nullable<IGetOnePostResponse>> => {
    const params = new URLSearchParams();
    params.set('lang', data.lang);

    const getOnePostURL = `/api/post/${data.id}?${params}`;
    const getOnePostResponse: Undefinable<Response> = await requestData(
      getOnePostURL,
      requestMethods.get,
      undefined,
      undefined
    );
    if (getOnePostResponse) {
      const getOnePostResponseData: IGetOnePostResponse = await getOnePostResponse.json();
      return getOnePostResponseData;
    }
    return null;
  }
);

// update the specified post
export const updatePostAsync = createAsyncThunk(
  'post/update',
  async (
    data: IUpdatePostRequest
  ): Promise<Nullable<IUpdatePostResponse | IGetOnePostResponse>> => {
    const params = new URLSearchParams();
    params.set('lang', data.lang);

    const updatePostURL = `/api/post/${data.postId}/update?${params}`;
    const updatePostResponse: Undefinable<Response> = await requestData(
      updatePostURL,
      requestMethods.put,
      JSON.stringify(data.requestData),
      data.token
    );
    if (updatePostResponse) {
      if (!updatePostResponse.ok) {
        const updatePostResponseData: IDeletePostResponse = await updatePostResponse.json();
        updatePostResponseData.statusCode = updatePostResponse.status;
        return updatePostResponseData;
      } else {
        const params = new URLSearchParams();
        params.set('lang', data.lang);

        const getOnePostURL = `/api/post/${data.postId}?${params}`;
        const getOnePostResponse: Undefinable<Response> = await requestData(
          getOnePostURL,
          requestMethods.get,
          undefined,
          undefined
        );
        if (getOnePostResponse) {
          const updatePostResponseData: IDeletePostResponse = await updatePostResponse.json();
          const getOnePostResponseData: IGetOnePostResponse = await getOnePostResponse.json();
          getOnePostResponseData.message = updatePostResponseData.message;
          getOnePostResponseData.statusCode = updatePostResponse.status;
          return getOnePostResponseData;
        }
      }
    }
    return null;
  }
);

// comments thunks
// create a new comment
export const createCommentAsync = createAsyncThunk(
  'comment/create',
  async (
    data: ICreateCommentRequest
  ): Promise<Nullable<ICreateCommentResponse | IGetOnePostResponse>> => {
    const params = new URLSearchParams();
    params.set('lang', data.lang);

    const createCommentURL = `/api/comment/${data.postId}/${data.userId}/creation?${params}`;
    const createCommentResponse: Undefinable<Response> = await requestData(
      createCommentURL,
      requestMethods.post,
      JSON.stringify(data.requestData),
      data.token
    );
    if (createCommentResponse) {
      if (!createCommentResponse.ok) {
        const createCommentResponseData: ICreatePostResponse = await createCommentResponse.json();
        createCommentResponseData.statusCode = createCommentResponse.status;
        return createCommentResponseData;
      } else {
        const params = new URLSearchParams();
        params.set('lang', data.lang);

        const getOnePostURL = `/api/post/${data.postId}?${params}`;
        const getOnePostResponse: Undefinable<Response> = await requestData(
          getOnePostURL,
          requestMethods.get,
          undefined,
          undefined
        );
        if (getOnePostResponse) {
          const createCommentResponseData: ICreatePostResponse = await createCommentResponse.json();
          const getOnePostResponseData: IGetOnePostResponse = await getOnePostResponse.json();
          getOnePostResponseData.statusCode = createCommentResponse.status;
          getOnePostResponseData.message = createCommentResponseData.message;
          return getOnePostResponseData;
        }
      }
    }
    return null;
  }
);

// delete the specified comment
export const deleteCommentAsync = createAsyncThunk(
  'comment/delete',
  async (
    data: IDeleteCommentRequest
  ): Promise<Nullable<IDeleteCommentResponse | IGetOnePostResponse>> => {
    const params = new URLSearchParams();
    params.set('lang', data.lang);

    const deleteCommentURL = `/api/comment/${data.id}/delete?${params}`;
    const deleteCommentResponse: Undefinable<Response> = await requestData(
      deleteCommentURL,
      requestMethods.delete,
      undefined,
      data.token
    );
    if (deleteCommentResponse) {
      if (!deleteCommentResponse.ok || deleteCommentResponse.status === 204) {
        const deleteCommentResponseData: IDeleteCommentResponse =
          await deleteCommentResponse.json();
        deleteCommentResponseData.statusCode = deleteCommentResponse.status;
        return deleteCommentResponseData;
      } else {
        const deleteCommentResponseData: IDeleteCommentResponse =
          await deleteCommentResponse.json();

        const params = new URLSearchParams();
        params.set('lang', data.lang);

        const getOnePostURL = `/api/post/${deleteCommentResponseData.postId}?${params}`;
        const getOnePostResponse: Undefinable<Response> = await requestData(
          getOnePostURL,
          requestMethods.get,
          undefined,
          undefined
        );
        if (getOnePostResponse) {
          const getOnePostResponseData: IGetOnePostResponse = await getOnePostResponse.json();
          getOnePostResponseData.statusCode = deleteCommentResponse.status;
          getOnePostResponseData.message = deleteCommentResponseData.message;
          return getOnePostResponseData;
        }
      }
    }
    return null;
  }
);

// update the specified comment
export const updateCommentAsync = createAsyncThunk(
  'comment/update',
  async (
    data: IUpdateCommentRequest
  ): Promise<Nullable<IUpdateCommentResponse | IGetOnePostResponse>> => {
    const params = new URLSearchParams();
    params.set('lang', data.lang);

    const updateCommentURL = `/api/comment/${data.id}/update?${params}`;
    const updateCommentResponse: Undefinable<Response> = await requestData(
      updateCommentURL,
      requestMethods.put,
      JSON.stringify(data.requestData),
      data.token
    );
    if (updateCommentResponse) {
      if (!updateCommentResponse.ok) {
        const updateCommentResponseData: IUpdateCommentResponse =
          await updateCommentResponse.json();
        updateCommentResponseData.statusCode = updateCommentResponse.status;
        return updateCommentResponseData;
      } else {
        const updateCommentResponseData: IUpdateCommentResponse =
          await updateCommentResponse.json();

        const params = new URLSearchParams();
        params.set('lang', data.lang);

        const getOnePostURL = `/api/post/${updateCommentResponseData.postId}?${params}`;
        const getOnePostResponse: Undefinable<Response> = await requestData(
          getOnePostURL,
          requestMethods.get,
          undefined,
          undefined
        );
        if (getOnePostResponse) {
          const getOnePostResponseData: IGetOnePostResponse = await getOnePostResponse.json();
          getOnePostResponseData.statusCode = updateCommentResponse.status;
          getOnePostResponseData.message = updateCommentResponseData.message;
          return getOnePostResponseData;
        }
      }
    }
    return null;
  }
);

// messages thunks
// get the specified dialog messages
export const getDialogMessagesAsync = createAsyncThunk(
  'message/get-dialog-messages',
  async (data: IGetDialogMessagesRequest): Promise<Nullable<IGetDialogMessagesResponse>> => {
    const params = new URLSearchParams();
    params.set('lang', data.lang);

    const getDialogMessagesURL = `/api/message/${data.userId}/${data.interlocutorId}/?${params}`;
    const getDialogMessagesResponse: Undefinable<Response> = await requestData(
      getDialogMessagesURL,
      requestMethods.get,
      undefined,
      data.token
    );
    if (getDialogMessagesResponse) {
      const getDialogMessagesResponseData: IGetDialogMessagesResponse =
        await getDialogMessagesResponse.json();
      return getDialogMessagesResponseData;
    }
    return null;
  }
);

// send a new message
export const sendMessageAsync = createAsyncThunk(
  'message/send',
  async (
    data: ISendMessageRequest
  ): Promise<Nullable<ISendMessageResponse | IGetOneUserResponse | IGetDialogMessagesResponse>> => {
    const params = new URLSearchParams();
    params.set('lang', data.lang);

    const sendMessageURL = `/api/message/send?${params}`;
    const sendMessageResponse: Undefinable<Response> = await requestData(
      sendMessageURL,
      requestMethods.post,
      JSON.stringify(data.requestData),
      data.token
    );
    if (sendMessageResponse) {
      if (!sendMessageResponse.ok) {
        const sendMessageResponseData: ISendMessageResponse = await sendMessageResponse.json();
        sendMessageResponseData.statusCode = sendMessageResponse.status;
        return sendMessageResponseData;
      } else {
        const params = new URLSearchParams();
        params.set('lang', data.lang);

        const getOneUserURL = `/api/user/${data.requestData.authorId}?${params}`;
        const getOneUserResponse: Undefinable<Response> = await requestData(
          getOneUserURL,
          requestMethods.get,
          undefined,
          data.token
        );

        const getDialogMessagesURL = `/api/message/${data.requestData.authorId}/${data.requestData.recipientId}/?${params}`;
        const getDialogMessagesResponse: Undefinable<Response> = await requestData(
          getDialogMessagesURL,
          requestMethods.get,
          undefined,
          data.token
        );
        if (getOneUserResponse && getDialogMessagesResponse) {
          if (!getDialogMessagesResponse.ok) {
            const getDialogMessagesResponseData: IGetDialogMessagesResponse =
              await getDialogMessagesResponse.json();
            return getDialogMessagesResponseData;
          }

          const sendMessageResponseData: ISendMessageResponse = await sendMessageResponse.json();
          const getDialogMessagesResponseData: IGetDialogMessagesResponse =
            await getDialogMessagesResponse.json();

          const getOneUserResponseData: IGetOneUserResponse = await getOneUserResponse.json();
          getOneUserResponseData.statusCode = sendMessageResponse.status;
          getOneUserResponseData.message = sendMessageResponseData.message;
          getOneUserResponseData.messages = getDialogMessagesResponseData.messages;
          return getOneUserResponseData;
        }
      }
    }
    return null;
  }
);

// delete the specified message
export const deleteMessageAsync = createAsyncThunk(
  'message/delete',
  async (
    data: IDeleteMessageRequest
  ): Promise<
    Nullable<IDeleteMessageResponse | IGetOneUserResponse | IGetDialogMessagesResponse>
  > => {
    const params = new URLSearchParams();
    params.set('lang', data.lang);

    const deleteMessageURL = `/api/message/${data.messageId}/delete?${params}`;
    const deleteMessageResponse: Undefinable<Response> = await requestData(
      deleteMessageURL,
      requestMethods.delete,
      undefined,
      data.token
    );
    if (deleteMessageResponse) {
      if (!deleteMessageResponse.ok || deleteMessageResponse.status === 204) {
        const deleteMessageResponseData: IDeleteMessageResponse =
          await deleteMessageResponse.json();
        deleteMessageResponseData.statusCode = deleteMessageResponse.status;
        return deleteMessageResponseData;
      } else {
        const params = new URLSearchParams();
        params.set('lang', data.lang);

        const getOneUserURL = `/api/user/${data.ownerId}?${params}`;
        const getOneUserResponse: Undefinable<Response> = await requestData(
          getOneUserURL,
          requestMethods.get,
          undefined,
          data.token
        );

        const getDialogMessagesURL = `/api/message/${data.ownerId}/${data.recipientId}/?${params}`;
        const getDialogMessagesResponse: Undefinable<Response> = await requestData(
          getDialogMessagesURL,
          requestMethods.get,
          undefined,
          data.token
        );
        if (getOneUserResponse && getDialogMessagesResponse) {
          if (!getDialogMessagesResponse.ok) {
            const getDialogMessagesResponseData: IGetDialogMessagesResponse =
              await getDialogMessagesResponse.json();
            return getDialogMessagesResponseData;
          }

          const deleteMessageResponseData: IDeleteMessageResponse =
            await deleteMessageResponse.json();
          const getDialogMessagesResponseData: IGetDialogMessagesResponse =
            await getDialogMessagesResponse.json();

          const getOneUserResponseData: IGetOneUserResponse = await getOneUserResponse.json();
          getOneUserResponseData.statusCode = deleteMessageResponse.status;
          getOneUserResponseData.message = deleteMessageResponseData.message;
          getOneUserResponseData.messages = getDialogMessagesResponseData.messages;
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
      setLocalStorageData({ currentTheme: payload });
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
    setAllPosts(state: WritableDraft<MainState>, { payload }: PayloadAction<Array<IPostModel>>) {
      state.allPosts = payload;
    },
    setDialogs(state: WritableDraft<MainState>, { payload }: PayloadAction<Array<IUserDialog>>) {
      state.dialogs = payload;
    },
    setCurrentDialogMessages(
      state: WritableDraft<MainState>,
      { payload }: PayloadAction<Nullable<Array<IMessageModel>>>
    ) {
      state.currentDialogMessages = payload;
    },
    setUnreadMessagesCount(state: WritableDraft<MainState>, { payload }: PayloadAction<number>) {
      state.unreadMessagesCount = payload;
    },
    setChats(state: WritableDraft<MainState>, { payload }: PayloadAction<OpenChats>) {
      state.chats = payload;
      setLocalStorageData({ activeChats: payload });
    },
    setActiveChatId(state: WritableDraft<MainState>, { payload }: PayloadAction<Nullable<number>>) {
      state.activeChatId = payload;
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
            if (fullUserData.userData?.userDialogs !== undefined) {
              state.dialogs = fullUserData.userData.userDialogs;
              state.unreadMessagesCount = fullUserData.userData.userDialogs.reduce(
                (sum, dialog) => {
                  return (sum += dialog.unreadMessages);
                },
                0
              );
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
            if (fullUserData.userData?.userDialogs !== undefined) {
              state.dialogs = fullUserData.userData.userDialogs;
              state.unreadMessagesCount = fullUserData.userData.userDialogs.reduce(
                (sum, dialog) => {
                  return (sum += dialog.unreadMessages);
                },
                0
              );
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
              if (payload.userData?.userDialogs !== undefined) {
                state.dialogs = payload.userData.userDialogs;
                state.unreadMessagesCount = payload.userData.userDialogs.reduce((sum, dialog) => {
                  return (sum += dialog.unreadMessages);
                }, 0);
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
      })

      // delete post
      .addCase(deletePostAsync.pending, (state) => {
        state.userRequestStatus = 'loading';
      })
      .addCase(deletePostAsync.fulfilled, (state, { payload }) => {
        state.userRequestStatus = 'idle';

        if (payload) {
          if (payload.statusCode === 200) {
            const successPostDeletionData = payload as IGetOneUserResponse;
            if (state.currentPost) {
              state.currentPost = null;

              if (successPostDeletionData.userData?.posts) {
                if (state.guestUserData) {
                  state.guestUserData.posts = successPostDeletionData.userData.posts;
                } else {
                  state.posts = successPostDeletionData.userData.posts;
                }
              }
            } else {
              if (successPostDeletionData.userData?.posts) {
                if (state.guestUserData) {
                  state.guestUserData.posts = successPostDeletionData.userData.posts;
                } else {
                  state.posts = successPostDeletionData.userData.posts;
                }
              }
            }

            state.alert = {
              message: successPostDeletionData.message,
              severity: 'success',
            };
          } else {
            state.alert = {
              message: payload.message,
              severity: 'error',
            };
          }
        }
      })
      .addCase(deletePostAsync.rejected, (state, { error }) => {
        state.userRequestStatus = 'failed';
        console.error('\x1b[40m\x1b[31m\x1b[1m', error.message);
      })

      // get the specified post data
      .addCase(getOnePostAsync.pending, (state) => {
        state.userRequestStatus = 'loading';
      })
      .addCase(getOnePostAsync.fulfilled, (state, { payload }) => {
        state.userRequestStatus = 'idle';

        if (payload) {
          state.currentPost = payload.postData;
        }
      })
      .addCase(getOnePostAsync.rejected, (state, { error }) => {
        state.userRequestStatus = 'failed';
        console.error('\x1b[40m\x1b[31m\x1b[1m', error.message);
      })

      // get all posts data
      .addCase(getAllPostsAsync.pending, (state) => {
        state.userRequestStatus = 'loading';
      })
      .addCase(getAllPostsAsync.fulfilled, (state, { payload }) => {
        state.userRequestStatus = 'idle';

        if (payload) {
          state.allPosts = payload.postsData;
        }
      })
      .addCase(getAllPostsAsync.rejected, (state, { error }) => {
        state.userRequestStatus = 'failed';
        console.error('\x1b[40m\x1b[31m\x1b[1m', error.message);
      })

      // update the specified post data
      .addCase(updatePostAsync.pending, (state) => {
        state.userRequestStatus = 'loading';
      })
      .addCase(updatePostAsync.fulfilled, (state, { payload }) => {
        state.userRequestStatus = 'idle';

        if (payload) {
          if (payload.statusCode !== 200) {
            const failedUpdatePayload = payload as IUpdatePostResponse;

            state.alert = {
              message: failedUpdatePayload.message,
              severity: 'error',
            };
          } else {
            const successUpdatePayload = payload as IGetOnePostResponse;

            if (state.currentPost) {
              state.currentPost = successUpdatePayload.postData;
              const modifiedPosts = state.posts.map((post) => {
                if (post.id === successUpdatePayload.postData.id) {
                  post = successUpdatePayload.postData;
                  return post;
                }
                return post;
              });
              state.posts = modifiedPosts;
            } else {
              const modifiedPosts = state.posts.map((post) => {
                if (post.id === successUpdatePayload.postData.id) {
                  post = successUpdatePayload.postData;
                  return post;
                }
                return post;
              });
              state.posts = modifiedPosts;
            }

            state.alert = {
              message: successUpdatePayload.message,
              severity: 'success',
            };
          }
        }
      })
      .addCase(updatePostAsync.rejected, (state, { error }) => {
        state.userRequestStatus = 'failed';
        console.error('\x1b[40m\x1b[31m\x1b[1m', error.message);
      })

      // create a new comment
      .addCase(createCommentAsync.pending, (state) => {
        state.userRequestStatus = 'loading';
      })
      .addCase(createCommentAsync.fulfilled, (state, { payload }) => {
        state.userRequestStatus = 'idle';

        if (payload) {
          const successCreationCommentData = payload as IGetOnePostResponse;
          const failCreationCommentData = payload as ICreateCommentResponse;
          if ((payload.statusCode === 201 || payload.statusCode === 200) && state.currentPost) {
            state.currentPost.comments = successCreationCommentData.postData.comments;

            state.alert = {
              message: successCreationCommentData.message,
              severity: 'success',
            };
          } else {
            state.alert = {
              message: failCreationCommentData.message,
              severity: 'error',
            };
          }
        }
      })
      .addCase(createCommentAsync.rejected, (state, { error }) => {
        state.userRequestStatus = 'failed';
        console.error('\x1b[40m\x1b[31m\x1b[1m', error.message);
      })

      // delete the specified comment
      .addCase(deleteCommentAsync.pending, (state) => {
        state.userRequestStatus = 'loading';
      })
      .addCase(deleteCommentAsync.fulfilled, (state, { payload }) => {
        state.userRequestStatus = 'idle';

        if (payload) {
          const successDeletionCommentData = payload as IGetOnePostResponse;
          const failDeletionCommentData = payload as IDeleteCommentResponse;
          if (payload.statusCode === 200 && state.currentPost) {
            state.currentPost.comments = successDeletionCommentData.postData.comments;

            state.alert = {
              message: successDeletionCommentData.message,
              severity: 'success',
            };
          } else {
            state.alert = {
              message: failDeletionCommentData.message,
              severity: 'error',
            };
          }
        }
      })
      .addCase(deleteCommentAsync.rejected, (state, { error }) => {
        state.userRequestStatus = 'failed';
        console.error('\x1b[40m\x1b[31m\x1b[1m', error.message);
      })

      // update the specified comment
      .addCase(updateCommentAsync.pending, (state) => {
        state.userRequestStatus = 'loading';
      })
      .addCase(updateCommentAsync.fulfilled, (state, { payload }) => {
        state.userRequestStatus = 'idle';

        if (payload) {
          const successUpdatingCommentData = payload as IGetOnePostResponse;
          const failUpdatingCommentData = payload as IUpdateCommentResponse;
          if (payload.statusCode === 200 && state.currentPost) {
            state.currentPost.comments = successUpdatingCommentData.postData.comments;

            state.alert = {
              message: successUpdatingCommentData.message,
              severity: 'success',
            };
          } else {
            state.alert = {
              message: failUpdatingCommentData.message,
              severity: 'error',
            };
          }
        }
      })
      .addCase(updateCommentAsync.rejected, (state, { error }) => {
        state.userRequestStatus = 'failed';
        console.error('\x1b[40m\x1b[31m\x1b[1m', error.message);
      })

      // get the specified dialog messages
      .addCase(getDialogMessagesAsync.pending, (state) => {
        state.userRequestStatus = 'loading';
      })
      .addCase(getDialogMessagesAsync.fulfilled, (state, { payload }) => {
        state.userRequestStatus = 'idle';

        if (payload) {
          if (payload.messages) {
            state.currentDialogMessages = payload.messages;
          }
        }
      })
      .addCase(getDialogMessagesAsync.rejected, (state, { error }) => {
        state.userRequestStatus = 'failed';
        console.error('\x1b[40m\x1b[31m\x1b[1m', error.message);
      })

      // send a new message
      .addCase(sendMessageAsync.pending, (state) => {
        state.userRequestStatus = 'loading';
      })
      .addCase(sendMessageAsync.fulfilled, (state, { payload }) => {
        state.userRequestStatus = 'idle';

        if (payload) {
          if (payload.statusCode !== 200 && payload.statusCode !== 201) {
            state.alert = {
              message: payload.message,
              severity: 'error',
            };
          } else {
            const successSendingMessageData = payload as IGetOneUserResponse;
            if (successSendingMessageData.userData?.userDialogs) {
              state.dialogs = successSendingMessageData.userData?.userDialogs;
            }
            if (state.currentDialogMessages) {
              if (successSendingMessageData.messages) {
                state.currentDialogMessages = successSendingMessageData.messages;
              }
            }

            state.alert = {
              message: successSendingMessageData.message,
              severity: 'success',
            };
          }
        }
      })
      .addCase(sendMessageAsync.rejected, (state, { error }) => {
        state.userRequestStatus = 'failed';
        console.error('\x1b[40m\x1b[31m\x1b[1m', error.message);
      })

      // delete the specified message
      .addCase(deleteMessageAsync.pending, (state) => {
        state.userRequestStatus = 'loading';
      })
      .addCase(deleteMessageAsync.fulfilled, (state, { payload }) => {
        state.userRequestStatus = 'idle';

        if (payload) {
          if (payload.statusCode !== 200) {
            state.alert = {
              message: payload.message,
              severity: 'error',
            };
          } else {
            const successDeletingMessageData = payload as IGetOneUserResponse;
            if (successDeletingMessageData.userData?.userDialogs) {
              state.dialogs = successDeletingMessageData.userData?.userDialogs;
            }
            if (state.currentDialogMessages) {
              if (successDeletingMessageData.messages) {
                state.currentDialogMessages = successDeletingMessageData.messages;
              }
            }

            state.alert = {
              message: successDeletingMessageData.message,
              severity: 'success',
            };
          }
        }
      })
      .addCase(deleteMessageAsync.rejected, (state, { error }) => {
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
    setAllPosts,
    setCurrentDialogMessages,
    setDialogs,
    setUnreadMessagesCount,
    setChats,
    setActiveChatId,
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
export const getAllPosts = ({ main: { allPosts } }: RootState) => allPosts;
export const getCurrentPost = ({ main: { currentPost } }: RootState) => currentPost;
export const getMessages = ({ main: { messages } }: RootState) => messages;
export const getDialogs = ({ main: { dialogs } }: RootState) => dialogs;
export const getCurrentDialogMessages = ({ main: { currentDialogMessages } }: RootState) =>
  currentDialogMessages;
export const getUnreadMessagesCount = ({ main: { unreadMessagesCount } }: RootState) =>
  unreadMessagesCount;
export const getChats = ({ main: { chats } }: RootState) => chats;
export const getActiveChatId = ({ main: { activeChatId } }: RootState) => activeChatId;

export const { reducer } = mainSlice;
