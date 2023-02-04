import React, { ChangeEvent, FormEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useAppSelector, useAppDispatch } from 'app/hooks';
import { Action, ThunkDispatch } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { Button, Card, CardActions, CardContent, TextField } from '@mui/material';
import { Link } from 'react-router-dom';

import { EMAIL_PATTERN, NICKNAME_PATTERN, PASSWORD_PATTERN } from 'consts';
import useLanguage from 'hooks/useLanguage';
import { lng } from 'hooks/useLanguage/types';
import { AuthMessage } from 'components/AuthMessage/AuthMessage';
import {
  getCurrentLanguage,
  registrationUserAsync,
  getAuthMessage,
  setAuthMessage,
} from 'app/mainSlice';
import styles from './RegisterPage.module.scss';

export const RegisterPage = () => {
  const dispatch = useAppDispatch();
  const thunkDispatch = useDispatch<ThunkDispatch<RootState, unknown, Action<string>>>();
  const currentLanguage = useAppSelector(getCurrentLanguage);

  const language = useLanguage();

  const authMessage = useAppSelector(getAuthMessage);
  const [nicknameValue, setNicknameValue] = useState('');
  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [repeatPasswordValue, setRepeatPasswordValue] = useState('');
  const [nicknameError, setNicknameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [repeatPasswordError, setRepeatPasswordError] = useState(false);
  const [touched, setTouched] = useState(false);

  const isValid = () =>
    touched && !(nicknameError || emailError || passwordError || repeatPasswordError);

  function handleNicknameChange(event: ChangeEvent<HTMLInputElement>) {
    setNicknameValue(event.target.value);
    setNicknameError(!NICKNAME_PATTERN.test(event.target.value));
    setTouched(true);
  }

  function handleEmailChange(event: ChangeEvent<HTMLInputElement>) {
    setEmailValue(event.target.value);
    setEmailError(!EMAIL_PATTERN.test(event.target.value));
    setTouched(true);
  }

  function handlePasswordChange(event: ChangeEvent<HTMLInputElement>) {
    setPasswordValue(event.target.value);
    setPasswordError(!PASSWORD_PATTERN.test(event.target.value));
    setTouched(true);
  }

  function handleRepeatPasswordChange(event: ChangeEvent<HTMLInputElement>) {
    setRepeatPasswordValue(event.target.value);
    setRepeatPasswordError(passwordValue !== event.target.value);
    setTouched(true);
  }

  function validateAll() {
    setNicknameError(!NICKNAME_PATTERN.test(nicknameValue));
    setEmailError(!EMAIL_PATTERN.test(emailValue));
    setPasswordError(!PASSWORD_PATTERN.test(passwordValue));
    setRepeatPasswordError(passwordValue !== repeatPasswordValue);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    validateAll();
    if (!isValid()) return;

    dispatch(setAuthMessage(null));
    const userData = {
      nickname: nicknameValue.trim(),
      email: emailValue.trim(),
      password: passwordValue,
      lang: currentLanguage,
    };
    await thunkDispatch(registrationUserAsync(userData));
  }
  return (
    <div className={styles.register}>
      {authMessage ? <AuthMessage /> : null}
      <Card className={styles.card}>
        <form onSubmit={handleSubmit} noValidate>
          <CardContent className={styles.content}>
            <h3>{language(lng.registerWelcome)}</h3>
            <TextField
              value={nicknameValue}
              label={language(lng.nickname)}
              required
              error={nicknameError}
              onChange={handleNicknameChange}
              helperText={nicknameError ? language(lng.nicknameHint) : ' '}
            />
            <TextField
              value={emailValue}
              label={language(lng.email)}
              required
              error={emailError}
              onChange={handleEmailChange}
              helperText={emailError ? language(lng.emailHint) : ' '}
              inputProps={{ inputMode: 'email' }}
            />
            <TextField
              type="password"
              value={passwordValue}
              label={language(lng.password)}
              required
              error={passwordError}
              onChange={handlePasswordChange}
              helperText={passwordError ? language(lng.passwordHint) : ' '}
            />
            <TextField
              type="password"
              value={repeatPasswordValue}
              label={language(lng.repeatPassword)}
              required
              error={repeatPasswordError}
              onChange={handleRepeatPasswordChange}
              helperText={repeatPasswordError ? language(lng.repeatPasswordHint) : ' '}
            />
          </CardContent>
          <CardActions sx={{ justifyContent: 'right' }}>
            <Button>
              <Link to="/login" onClick={() => dispatch(setAuthMessage(null))}>
                {language(lng.login)}
              </Link>
            </Button>
            <Button type="submit" variant="contained">
              {language(lng.register)}
            </Button>
          </CardActions>
        </form>
      </Card>
    </div>
  );
};
