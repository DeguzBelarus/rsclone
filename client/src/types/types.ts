// types
export type Nullable<T> = T | null;
export type Undefinable<T> = T | undefined;
export type RequestStatus = 'idle' | 'loading' | 'failed';
export type VoidMethod = () => void;
export type CurrentLanguageType = 'en' | 'ru';
export type CurrentColorTheme = 'white' | 'dark';
export type RoleType = 'USER' | 'ADMIN';
export type UpdateUserType = 'info' | 'avatar' | 'role';

// event handler type
export type EventHandler<T, K = void> = (event: T, param?: K) => void;

// interfaces
export interface IRequestMethods {
  get: string;
  post: string;
  delete: string;
  put: string;
  patch: string;
}

export interface ILoginRequestData {
  email: string;
  password: string;
  lang: CurrentLanguageType;
}

export interface IAuthCheckRequestData {
  lang: CurrentLanguageType;
  token: string;
}

export interface IGetOneUserRequestData {
  requestData: {
    lang: CurrentLanguageType;
    id: number;
  };
  token: string;
}

export interface IGetUsersRequestData {
  lang: string;
  searchKey: string;
}

export interface IDeleteUserRequestData {
  requestData: {
    lang: CurrentLanguageType;
    id: number;
    ownId: number;
  };
  token: string;
}

export interface IUpdateUserRequestData {
  requestData: FormData;
  token: string;
  type: UpdateUserType;
  ownId: number;
}

export interface ICreatePostRequestData {
  requestData: FormData;
  token: string;
  ownId: number;
}

export interface IDeletePostRequestData {
  lang: CurrentLanguageType;
  id: number;
  ownId: number;
  token: string;
}

export interface IRegistrationRequestData extends ILoginRequestData {
  nickname: string;
}

export interface IAuthResponse {
  token?: string;
  message: string;
}

export interface ICreatePostResponse {
  message: string;
  statusCode?: number;
  ownId: number;
}

export interface ITokenDecodeData {
  id: number;
  email: string;
  nickname: string;
  role: RoleType;
  token?: string;
}

export interface IGetOneUserResponse {
  userData?: IFullUserData;
  message: string;
  statusCode?: number;
  ownId: number;
  token?: string;
}

export interface IDeleteUserResponse {
  message?: string;
  statusCode?: number;
  ownId: number;
}

export interface IDeletePostResponse {
  message: string;
  statusCode?: number;
  ownId: number;
  postOwnerId?: number;
}

export interface IUpdateUserResponse {
  message: string;
  statusCode?: number;
  ownId: number;
}

export interface IFoundUserData {
  id: number;
  nickname: string;
  firstName: Nullable<string>;
  lastName: Nullable<string>;
  city: Nullable<string>;
  country: Nullable<string>;
  avatarSrc: Nullable<string>;
  role: string;
}

export interface ISearchUsersResponse {
  count: number;
  searchResult: Array<IFoundUserData>;
  message: string;
}
export interface ILocalStorageSaveData {
  token?: string;
  currentLanguage?: CurrentLanguageType;
}

export interface AlertMessage {
  message?: Nullable<string>;
  severity?: 'success' | 'error';
  persist?: boolean;
}

export interface IPostModel {
  id?: number;
  date: string;
  editDate?: string;
  postHeading: string;
  postText: string;
  media: string | File;
  userId: number;
}

export interface IGetOnePostRequest {
  id: number;
  lang: CurrentLanguageType;
}

export interface IGetOnePostResponse {
  postData: IPostModel;
  message: string;
}

export interface ICommentModel {
  id?: number;
  date: string;
  editDate?: string;
  commentText: string;
  authorNickname: string;
}

export interface IMessageModel {
  id?: number;
  date: string;
  messageText: string;
  authorNickname: string;
  recipientId: number;
  recipientNickname: string;
  isRead: boolean;
}

export interface IFullUserData extends ITokenDecodeData {
  age?: Nullable<number>;
  country?: Nullable<string>;
  city?: Nullable<string>;
  avatar?: Nullable<string>;
  firstName?: Nullable<string>;
  lastName?: Nullable<string>;
  posts?: Array<IPostModel>;
}
