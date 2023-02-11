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
  userPosts,
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

  notFound,
  goToHome,

  dangerZone,
  giveUpAdmin,
  giveUpAdminMsg,
  deleteAccount,
  deleteAccountMsg,

  confirm,
  cancel,
  save,

  searchPlaceholder,
  searchWelcome,
  searchNotFound,

  admin,

  newPostTitle,
  editPostTitle,
  postTitle,
  postTitleHint,
  postBody,
  postBodyHint,
  postUploadMedia,
  postUploadMediaDelete,
}

export type LangaugeData = {
  [key in CurrentLanguageType]: { [key in lng]: string };
};
