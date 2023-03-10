import React, { FormEvent, useState } from 'react';
import { useAppSelector, useAppDispatch } from 'app/hooks';
import { Button, Card, CardActions, CardContent, TextField } from '@mui/material';
import { Link } from 'react-router-dom';

import { EMAIL_PATTERN, NICKNAME_PATTERN, PASSWORD_PATTERN } from 'consts';
import useLanguage from 'hooks/useLanguage';
import { lng } from 'hooks/useLanguage/types';
import { getCurrentLanguage, registrationUserAsync } from 'app/mainSlice';
import styles from './RegisterPage.module.scss';
import useValidateInput from 'hooks/useValidateInput';
import { Logo } from 'components/Logo/Logo';

export const RegisterPage = () => {
  const dispatch = useAppDispatch();
  const currentLanguage = useAppSelector(getCurrentLanguage);
  const language = useLanguage();

  const [nicknameValue, setNicknameValue] = useState('');
  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [repeatPasswordValue, setRepeatPasswordValue] = useState('');
  const [nicknameError, setNicknameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [repeatPasswordError, setRepeatPasswordError] = useState(false);
  const [touched, setTouched] = useState(false);

  const validateNickname = useValidateInput(
    NICKNAME_PATTERN,
    setNicknameValue,
    setNicknameError,
    setTouched
  );
  const validateEmail = useValidateInput(EMAIL_PATTERN, setEmailValue, setEmailError, setTouched);

  const validatePassword = useValidateInput(
    PASSWORD_PATTERN,
    setPasswordValue,
    setPasswordError,
    setTouched
  );

  const validateRepeatPassword = useValidateInput(
    (value) => passwordValue !== value,
    setRepeatPasswordValue,
    setRepeatPasswordError,
    setTouched
  );

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    validateNickname(nicknameValue);
    validateEmail(emailValue);
    validatePassword(passwordValue);
    validateRepeatPassword(repeatPasswordValue);

    const isValid =
      touched && !(nicknameError || emailError || passwordError || repeatPasswordError);
    if (!isValid) return;

    const userData = {
      nickname: nicknameValue.trim(),
      email: emailValue.trim(),
      password: passwordValue,
      lang: currentLanguage,
    };
    dispatch(registrationUserAsync(userData));
  }
  return (
    <div className={styles.register}>
      <Card className={styles.card}>
        <form onSubmit={handleSubmit} noValidate>
          <CardContent className={styles.content}>
            <Logo className={styles.logo} />
            <h4 className={styles.heading}>{language(lng.registerWelcome)}</h4>
            <TextField
              value={nicknameValue}
              label={language(lng.nickname)}
              required
              error={nicknameError}
              onChange={validateNickname}
              helperText={nicknameError ? language(lng.nicknameHint) : ' '}
            />
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
            <TextField
              type="password"
              value={repeatPasswordValue}
              label={language(lng.repeatPassword)}
              required
              error={repeatPasswordError}
              onChange={validateRepeatPassword}
              helperText={repeatPasswordError ? language(lng.repeatPasswordHint) : ' '}
            />
          </CardContent>
          <CardActions sx={{ justifyContent: 'right' }}>
            <Button>
              <Link to="/login">{language(lng.login)}</Link>
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
