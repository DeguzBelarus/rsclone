export const NICKNAME_PATTERN = /^.{3,}$/;
export const EMAIL_PATTERN = /^\w+[.]?\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,4}$/;
export const PASSWORD_PATTERN = /^.{8,}$/;
export const PASSWORD_OR_EMPTY_PATTERN = /^.{8,}$|^$/;

export const AGE_PATTERN = /^[0-9]{1,2}$|^$/;

export const COUNTRY_PATTERN = /^.{3,}$|^$/;
export const CITY_PATTERN = /^.{3,}$|^$/;
export const FIRST_NAME_PATTERN = /^.{3,}$|^$/;
export const LAST_NAME_PATTERN = /^.{3,}$|^$/;

export const POST_TITLE_PATTERN = /^.+$/;
export const POST_BODY_PATTERN = /^.+$/s;

export const ALERT_AUTO_HIDE_DURATION = 4000;

export const LANGUAGES = ['en', 'ru'];
export const LANGUAGE_NAMES = ['English', 'Русский'];

export const USER_ROLE_ADMIN = 'ADMIN';

export const MAX_USERS_TO_DISPLAY = 10;

export const APP_TITLE = 'RS Social';

export const USER_PREFFERED_LANGUAGE = navigator.language.startsWith('ru') ? 'ru' : 'en';

export const USER_PREFERRED_COLOR_MODE = matchMedia('(prefers-color-scheme: dark)').matches
  ? 'dark'
  : 'light';
