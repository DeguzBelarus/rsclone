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
  },

  ru: {
    [lng.email]: 'Электронная почта',
    [lng.emailHint]: 'Введите валидный адрес',
    [lng.password]: 'Пароль',
    [lng.passwordHint]: 'Введите пароль',
    [lng.register]: 'Регистрация',
    [lng.login]: 'Войти',
    [lng.loginWelcome]: 'Введите ваши данные для входа',
    [lng.loginSuccess]: 'Вы успешно вошли!',
    [lng.loginError]: 'Неправильный адрес электронной почты или пароль!',
  },
};

export default LANGUAGE_DATA;
