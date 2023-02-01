import React, { ChangeEvent, FormEvent, useState } from 'react';
import styles from './AuthPage.module.scss';
import { Button, Card, CardActions, CardContent, TextField } from '@mui/material';
import { Link } from 'react-router-dom';

const EMAIL_PATTERN = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,4}$/;

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
              error={emailError}
              required
              onChange={handleEmailChange}
              inputProps={{ inputMode: 'email', pattern: EMAIL_PATTERN.toString() }}
            />
            <TextField
              type="password"
              value={passwordValue}
              error={passwordError}
              onChange={handlePasswordChange}
              label="Password"
              required
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
