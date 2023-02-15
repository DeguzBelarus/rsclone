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
  onlineAndMore,

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
  commentsHeading,
  commentsNoneMsg,

  justNow,
  ago,
  minutes1,
  minutes2,
  minutes3,
  hours1,
  hours2,
  hours3,
  yesterday,

  recording,
  recordingStart,
  recordingStop,
  recordingAccessing,
  recordingVideo,
  recordingAudio,
}

export type LangaugeData = {
  [key in CurrentLanguageType]: { [key in lng]: string };
};
