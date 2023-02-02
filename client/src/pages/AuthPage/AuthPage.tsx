import React, { ChangeEvent, FormEvent, useState } from 'react';
import styles from './AuthPage.module.scss';
import { Button, Card, CardActions, CardContent, TextField } from '@mui/material';
import { Link } from 'react-router-dom';
import { EMAIL_PATTERN } from 'consts';

export const AuthPage = () => {
  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  function handleEmailChange(event: ChangeEvent<HTMLInputElement>) {
    setEmailValue(event.target.value);
    setEmailError(!EMAIL_PATTERN.test(event.target.value));
  }

  function handlePasswordChange(event: ChangeEvent<HTMLInputElement>) {
    setPasswordValue(event.target.value);
    setPasswordError(event.target.value === '');
  }
  function submitHandle(event: FormEvent) {
    event.preventDefault();
  }
  return (
    <div className={styles.auth}>
      <Card sx={{ padding: '1rem' }}>
        <form onSubmit={submitHandle}>
          <CardContent className={styles.content}>
            <div>Please enter your credentials to log in</div>
            <TextField
              value={emailValue}
              label="Email"
              required
              error={emailError}
              onChange={handleEmailChange}
              helperText={emailError ? 'Please enter a correct email address' : ' '}
              inputProps={{ inputMode: 'email', pattern: EMAIL_PATTERN.toString() }}
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
