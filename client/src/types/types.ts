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
  lang: string;
}

export interface IGetOneUserRequestData {
  requestData: {
    lang: string;
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
    lang: string;
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

export interface IRegistrationRequestData extends ILoginRequestData {
  nickname: string;
}

export interface IAuthResponse {
  token?: string;
  message: string;
}

export interface ITokenDecodeData {
  id: number;
  email: string;
  nickname: string;
  role: RoleType;
  age?: Nullable<number>;
  country?: Nullable<string>;
  city?: Nullable<string>;
  avatar?: Nullable<string>;
  firstName?: Nullable<string>;
  lastName?: Nullable<string>;
}

export interface IGetOneUserResponse {
  userData?: ITokenDecodeData;
  message: string;
  statusCode?: number;
  ownId: number;
}

export interface IDeleteUserResponse {
  message?: string;
  statusCode?: number;
  ownId: number;
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
