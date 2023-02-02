import React, { ChangeEvent, FormEvent, useState, FC } from 'react';
import { useAppSelector } from 'app/hooks';
import { useDispatch } from 'react-redux';
import { Action, ThunkDispatch } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { Button, Card, CardActions, CardContent, TextField } from '@mui/material';

import { CurrentLanguageType } from 'types/types';
import { registrationUserAsync, getCurrentLanguage } from 'app/mainSlice';
import { EMAIL_PATTERN, NICKNAME_PATTERN, PASSWORD_PATTERN } from 'consts';
import styles from './RegisterPage.module.scss';

export const RegisterPage: FC = (): JSX.Element => {
  const thunkDispatch = useDispatch<ThunkDispatch<RootState, unknown, Action<string>>>();

  const currentLanguage: CurrentLanguageType = useAppSelector(getCurrentLanguage);
  const [nicknameValue, setNicknameValue] = useState('');
  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [repeatPasswordValue, setRepeatPasswordValue] = useState('');
  const [nicknameError, setNicknameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [repeatPasswordError, setRepeatPasswordError] = useState(false);

  const isValid = () => !(nicknameError || emailError || passwordError || repeatPasswordError);

  function handleNicknameChange(event: ChangeEvent<HTMLInputElement>) {
    setNicknameValue(event.target.value);
    setNicknameError(!NICKNAME_PATTERN.test(event.target.value));
  }

  function handleEmailChange(event: ChangeEvent<HTMLInputElement>) {
    setEmailValue(event.target.value);
    setEmailError(!EMAIL_PATTERN.test(event.target.value));
  }

  function handlePasswordChange(event: ChangeEvent<HTMLInputElement>) {
    setPasswordValue(event.target.value);
    setPasswordError(!PASSWORD_PATTERN.test(event.target.value));
  }

  function handleRepeatPasswordChange(event: ChangeEvent<HTMLInputElement>) {
    setRepeatPasswordValue(event.target.value);
    setRepeatPasswordError(passwordValue !== event.target.value);
  }

  function validateAll() {
    setNicknameError(!NICKNAME_PATTERN.test(nicknameValue));
    setEmailError(!EMAIL_PATTERN.test(emailValue));
    setPasswordError(!PASSWORD_PATTERN.test(passwordValue));
    setRepeatPasswordError(passwordValue !== repeatPasswordValue);
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    validateAll();
    if (!isValid()) return;

    const userData = {
      nickname: nicknameValue.trim(),
      email: emailValue.trim(),
      password: passwordValue,
    };
    console.log(userData);
    const registrationRequestData = { ...userData, lang: currentLanguage };
    thunkDispatch(registrationUserAsync(registrationRequestData));
  }
  return (
    <div className={styles.register}>
      <Card className={styles.card}>
        <form onSubmit={handleSubmit} noValidate>
          <CardContent className={styles.content}>
            <h3>Create a new account</h3>
            <TextField
              value={nicknameValue}
              label="Nickname"
              required
              error={nicknameError}
              onChange={handleNicknameChange}
              helperText={nicknameError ? 'At least 3 characters long' : ' '}
            />
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
              helperText={passwordError ? 'At least 8 characters long' : ' '}
            />
            <TextField
              type="password"
              value={repeatPasswordValue}
              label="Repeat password"
              required
              error={repeatPasswordError}
              onChange={handleRepeatPasswordChange}
              helperText={repeatPasswordError ? 'The passwords should match' : ' '}
            />
          </CardContent>
          <CardActions sx={{ justifyContent: 'right' }}>
            <Button type="submit" variant="contained">
              Register
            </Button>
          </CardActions>
        </form>
      </Card>
    </div>
  );
};
