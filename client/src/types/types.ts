import { Dispatch, SetStateAction } from 'react';

// types
export type Nullable<T> = T | null;
export type Undefinable<T> = T | undefined;
export type RequestStatus = 'idle' | 'loading' | 'failed';
export type VoidMethod = () => void;
export type CurrentLanguageType = 'en' | 'ru';

// event handler type
export type eventHandler<T, K = void> = (event: T, param?: K) => void;

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
  role: string;
}

export interface ILocalStorageSaveData {
  token?: string;
}

export type ReactSetState<S> = Dispatch<SetStateAction<S>>;
