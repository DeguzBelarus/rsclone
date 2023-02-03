import React, { ChangeEvent, FormEvent, useState } from 'react';
import { useAppSelector } from 'app/hooks';
import { useDispatch } from 'react-redux';
import { Action, ThunkDispatch } from '@reduxjs/toolkit';
import { RootState, store } from '../../app/store';
import { Button, Card, CardActions, CardContent, TextField } from '@mui/material';
import { Link } from 'react-router-dom';
import { CurrentLanguageType } from 'types/types';
import { loginUserAsync, getCurrentLanguage } from 'app/mainSlice';
import { EMAIL_PATTERN } from 'consts';
import styles from './AuthPage.module.scss';
import { useAlert } from 'components/AlertProvider';

export const AuthPage = () => {
  const thunkDispatch = useDispatch<ThunkDispatch<RootState, unknown, Action<string>>>();
  const alert = useAlert();

  const currentLanguage: CurrentLanguageType = useAppSelector(getCurrentLanguage);
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
    };
    const loginRequestData = { ...userData, lang: currentLanguage };
    await thunkDispatch(loginUserAsync(loginRequestData));

    const state = store.getState();
    if (state.main.isAuthorized) {
      alert.success('You have been successfully logged in');
    } else {
      alert.error('Wrong username or password. Try again!');
    }
  }

  return (
    <div className={styles.auth}>
      <Card className={styles.card}>
        <form onSubmit={handleSubmit} noValidate>
          <CardContent className={styles.content}>
            <h3>Please enter your credentials to log in</h3>
            <TextField
              value={emailValue}
              label="Email"
              required
              error={emailError}
              onChange={handleEmailChange}
              helperText={emailError ? 'Please enter a valid email address' : ' '}
              inputProps={{ inputMode: 'email' }}
            />
            <TextField
              type="password"
              value={passwordValue}
              label="Password"
              required
              error={passwordError}
              onChange={handlePasswordChange}
              helperText={passwordError ? 'Please enter your password' : ' '}
            />
          </CardContent>
          <CardActions sx={{ justifyContent: 'right' }}>
            <Button>
              <Link to="/register">Register </Link>
            </Button>
            <Button type="submit" variant="contained">
              Login
            </Button>
          </CardActions>
        </form>
      </Card>
    </div>
  );
};
