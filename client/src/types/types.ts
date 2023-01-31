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
