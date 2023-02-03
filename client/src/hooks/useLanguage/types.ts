import { CurrentLanguageType } from 'types/types';

export enum lng {
  email,
  emailHint,
  password,
  passwordHint,
  register,
  login,
  loginWelcome,
  loginSuccess,
  loginError,
}

export type LangaugeData = {
  [key in CurrentLanguageType]: { [key in lng]: string };
};
