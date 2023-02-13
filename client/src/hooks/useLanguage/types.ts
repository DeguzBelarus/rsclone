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
  userNotFound,

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
  close,
  save,
  clear,

  searchPlaceholder,
  searchWelcome,
  searchNotFound,

  admin,
  online,
  offline,

  newPostTitle,
  editPostTitle,
  postTitle,
  postTitleHint,
  postBody,
  postBodyHint,
  postUploadMedia,
  postUploadMediaDelete,

  postDelete,
  postDeleteMsg,
  postEdit,
  postCopyLink,
  postCopyLinkSuccess,
  postOpen,
  postNotFound,

  commentWrite,
  commentPublish,
  commentEdit,
  commentDelete,

  justNow,
  minutesAgo,
  hoursAgo,
  yesterday,
}

export type LangaugeData = {
  [key in CurrentLanguageType]: { [key in lng]: string };
};
