import { LangaugeData, lng } from './types';

const LANGUAGE_DATA: LangaugeData = {
  en: {
    [lng.email]: 'Email',
    [lng.emailHint]: 'Please enter a valid email address',
    [lng.password]: 'Password',
    [lng.passwordHint]: 'Please enter your password',
    [lng.register]: 'Register',
    [lng.login]: 'Log in',
    [lng.loginWelcome]: 'Please enter your credentials to log in',
    [lng.loginSuccess]: 'You have been successfully logged in',
    [lng.loginError]: 'Wrong email or password. Try again!',

    [lng.nickname]: 'Nickname',
    [lng.nicknameHint]: 'At least 3 characters long',
    [lng.repeatPassword]: 'Repeat password',
    [lng.repeatPasswordHint]: 'The passwords should match',

    [lng.registerWelcome]: 'Create a new account',
    [lng.registerSuccess]: 'You have been registered',
    [lng.registerError]: 'Regisration error. Try again later!',

    [lng.languageSelect]: 'App language',
  },

  ru: {
    [lng.email]: 'Электронная почта',
    [lng.emailHint]: 'Введите валидный адрес',
    [lng.password]: 'Пароль',
    [lng.passwordHint]: 'Минимальная длина пароля - 8 символов',
    [lng.register]: 'Регистрация',
    [lng.login]: 'Войти',
    [lng.loginWelcome]: 'Введите ваши данные для входа',
    [lng.loginSuccess]: 'Вы успешно вошли!',
    [lng.loginError]: 'Неправильный адрес электронной почты или пароль!',

    [lng.nickname]: 'Ник',
    [lng.nicknameHint]: 'Минимум 3 символа',
    [lng.repeatPassword]: 'Повторите пароль',
    [lng.repeatPasswordHint]: 'Пароли должны совпадать',

    [lng.registerWelcome]: 'Новый аккаунт',
    [lng.registerSuccess]: 'Аккаунт успешно создан!',
    [lng.registerError]: 'Ошибка при регистрации. Повторите позже!',

    [lng.languageSelect]: 'Язык приложения',
  },
};

export default LANGUAGE_DATA;
