import React, { ChangeEvent, FormEvent, useRef, useState } from 'react';
import styles from './RegisterPage.module.scss';
import { Button, Card, CardActions, CardContent, TextField } from '@mui/material';
import { EMAIL_PATTERN } from 'consts';

export const RegisterPage = () => {
  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [repeatPasswordValue, setRepeatPasswordValue] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [repeatPasswordError, setRepeatPasswordError] = useState(false);

  const isValid = () => !(emailError || passwordError || repeatPasswordError);

  function handleEmailChange(event: ChangeEvent<HTMLInputElement>) {
    setEmailValue(event.target.value);
    setEmailError(!EMAIL_PATTERN.test(event.target.value));
  }

  function handlePasswordChange(event: ChangeEvent<HTMLInputElement>) {
    setPasswordValue(event.target.value);
    setPasswordError(event.target.value === '');
  }

  function handleRepeatPasswordChange(event: ChangeEvent<HTMLInputElement>) {
    setRepeatPasswordValue(event.target.value);
    setRepeatPasswordError(passwordValue !== event.target.value);
  }

  function validateAll() {
    setEmailError(!EMAIL_PATTERN.test(emailValue));
    setPasswordError(passwordValue === '');
    setRepeatPasswordError(passwordValue !== repeatPasswordValue);
  }

  function submitHandle(event: FormEvent) {
    event.preventDefault();
    validateAll();
    if (!isValid()) return;

    const userData = {
      email: emailValue,
      password: passwordValue,
    };
    console.log(userData);
  }
  return (
    <div className={styles.register}>
      <Card sx={{ padding: '1rem' }}>
        <form onSubmit={submitHandle} noValidate>
          <CardContent className={styles.content}>
            <div>Please enter your credentials to log in</div>
            <TextField
              value={emailValue}
              label="Email"
              required
              error={emailError}
              onChange={handleEmailChange}
              helperText={emailError ? 'Please enter a valid email address' : ' '}
              inputProps={{ inputMode: 'email', pattern: EMAIL_PATTERN }}
            />
            <TextField
              type="password"
              value={passwordValue}
              label="Password"
              required
              error={passwordError}
              onChange={handlePasswordChange}
              helperText={passwordError ? 'Please enter a password' : ' '}
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
