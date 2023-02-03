import React, { ChangeEvent, FormEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Action, ThunkDispatch } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { Button, Card, CardActions, CardContent, TextField } from '@mui/material';
import { Link } from 'react-router-dom';
import { getCurrentLanguage, loginUserAsync } from 'app/mainSlice';
import { EMAIL_PATTERN } from 'consts';
import styles from './AuthPage.module.scss';
import useLanguage from 'hooks/useLanguage';
import { useAppSelector } from 'app/hooks';
import { lng } from 'hooks/useLanguage/types';

export const AuthPage = () => {
  const thunkDispatch = useDispatch<ThunkDispatch<RootState, unknown, Action<string>>>();
  const currentLanguage = useAppSelector(getCurrentLanguage);

  const language = useLanguage();

  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [touched, setTouched] = useState(false);

  const isValid = () => touched && !(emailError || passwordError);

  function handleEmailChange(event: ChangeEvent<HTMLInputElement>) {
    setEmailValue(event.target.value);
    setEmailError(!EMAIL_PATTERN.test(event.target.value));
    setTouched(true);
  }

  function handlePasswordChange(event: ChangeEvent<HTMLInputElement>) {
    setPasswordValue(event.target.value);
    setPasswordError(event.target.value === '');
    setTouched(true);
  }

  function validateAll() {
    setEmailError(!EMAIL_PATTERN.test(emailValue));
    setPasswordError(passwordValue === '');
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    validateAll();
    if (!isValid()) return;

    const userData = {
      email: emailValue.trim(),
      password: passwordValue,
      lang: currentLanguage,
    };

    await thunkDispatch(loginUserAsync(userData));
  }

  return (
    <div className={styles.auth}>
      <Card className={styles.card}>
        <form onSubmit={handleSubmit} noValidate>
          <CardContent className={styles.content}>
            <h3>{language(lng.loginWelcome)}</h3>
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
          </CardContent>
          <CardActions sx={{ justifyContent: 'right' }}>
            <Button>
              <Link to="/register">{language(lng.register)}</Link>
            </Button>
            <Button type="submit" variant="contained">
              {language(lng.login)}
            </Button>
          </CardActions>
        </form>
      </Card>
    </div>
  );
};
