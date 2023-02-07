import React, { FormEvent, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { Button, Card, CardActions, CardContent, TextField } from '@mui/material';
import { Link } from 'react-router-dom';

import { EMAIL_PATTERN, PASSWORD_PATTERN } from 'consts';
import useLanguage from 'hooks/useLanguage';
import { lng } from 'hooks/useLanguage/types';
import { getCurrentLanguage, loginUserAsync } from 'app/mainSlice';
import styles from './AuthPage.module.scss';
import useValidateInput from 'hooks/useValidateInput';

export const AuthPage = () => {
  const dispatch = useAppDispatch();
  const currentLanguage = useAppSelector(getCurrentLanguage);
  const language = useLanguage();

  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [touched, setTouched] = useState(false);

  const validateEmail = useValidateInput(EMAIL_PATTERN, setEmailValue, setEmailError, setTouched);

  const validatePassword = useValidateInput(
    PASSWORD_PATTERN,
    setPasswordValue,
    setPasswordError,
    setTouched
  );

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    validateEmail(emailValue);
    validatePassword(passwordValue);
    const isValid = touched && !(emailError || passwordError);
    if (!isValid) return;

    const userData = {
      email: emailValue.trim(),
      password: passwordValue,
      lang: currentLanguage,
    };

    dispatch(loginUserAsync(userData));
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
              onChange={validateEmail}
              helperText={emailError ? language(lng.emailHint) : ' '}
              inputProps={{ inputMode: 'email' }}
            />
            <TextField
              type="password"
              value={passwordValue}
              label={language(lng.password)}
              required
              error={passwordError}
              onChange={validatePassword}
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
