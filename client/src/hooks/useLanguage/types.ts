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

  nickname,
  nicknameHint,
  repeatPassword,
  repeatPasswordHint,

  registerWelcome,
  registerSuccess,
  registerError,

  languageSelect,
  userMessages,
  userAddPost,

  settings,
  logout,

  addPhoto,
  deletePhoto,

  age,
  ageHint,
  country,
  countryHint,
  city,
  cityHint,
  firstName,
  firstNameHint,
  lastName,
  lastNameHint,
  newPassword,

  update,
}

export type LangaugeData = {
  [key in CurrentLanguageType]: { [key in lng]: string };
};
