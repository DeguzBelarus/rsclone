import { useAppDispatch, useAppSelector } from 'app/hooks';
import {
  getCurrentLanguage,
  getIsAuthorized,
  getUserAge,
  getUserCity,
  getUserCountry,
  getUserEmail,
  getUserFirstName,
  getUserLastName,
  getUserNickname,
} from 'app/mainSlice';
import Avatar from 'components/Avatar';
import React, { FormEvent, useState } from 'react';
import styles from './UserSettings.module.scss';
import { Button, IconButton, TextField, Tooltip } from '@mui/material';
import { AddAPhoto, DeleteForever } from '@mui/icons-material';
import useLanguage from 'hooks/useLanguage';
import { lng } from 'hooks/useLanguage/types';
import useValidateInput from 'hooks/useValidateInput';
import {
  AGE_PATTERN,
  CITY_PATTERN,
  COUNTRY_PATTERN,
  EMAIL_PATTERN,
  FIRST_NAME_PATTERN,
  LAST_NAME_PATTERN,
  NICKNAME_PATTERN,
  PASSWORD_PATTERN,
} from 'consts';

export function UserSettings() {
  const isAuthorized = useAppSelector(getIsAuthorized);
  const nickname = useAppSelector(getUserNickname);
  const email = useAppSelector(getUserEmail);
  const age = useAppSelector(getUserAge);
  const country = useAppSelector(getUserCountry);
  const city = useAppSelector(getUserCity);
  const firstName = useAppSelector(getUserFirstName);
  const lastName = useAppSelector(getUserLastName);

  const language = useLanguage();

  const dispatch = useAppDispatch();
  const currentLanguage = useAppSelector(getCurrentLanguage);

  const [nicknameValue, setNicknameValue] = useState(nickname || '');
  const [emailValue, setEmailValue] = useState(email || '');
  const [passwordValue, setPasswordValue] = useState('');
  const [ageValue, setAgeValue] = useState(age ? String(age) : '');
  const [countryValue, setCountryValue] = useState(country || '');
  const [cityValue, setCityValue] = useState(city || '');
  const [firstNameValue, setFirstNameValue] = useState(firstName || '');
  const [lastNameValue, setLastNameValue] = useState(lastName || '');
  const [nicknameError, setNicknameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [ageError, setAgeError] = useState(false);
  const [countryError, setCountryError] = useState(false);
  const [cityError, setCityError] = useState(false);
  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);

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

  const validateAge = useValidateInput(AGE_PATTERN, setAgeValue, setAgeError, setTouched);
  const validateCountry = useValidateInput(
    COUNTRY_PATTERN,
    setCountryValue,
    setCountryError,
    setTouched
  );
  const validateCity = useValidateInput(CITY_PATTERN, setCityValue, setCityError, setTouched);

  const validateFirstName = useValidateInput(
    FIRST_NAME_PATTERN,
    setFirstNameValue,
    setFirstNameError,
    setTouched
  );
  const validateLastName = useValidateInput(
    LAST_NAME_PATTERN,
    setLastNameValue,
    setLastNameError,
    setTouched
  );

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    validateNickname(nicknameValue);
    validateEmail(emailValue);
    validatePassword(passwordValue);
    validateAge(ageValue);
    validateCountry(countryValue);
    validateCity(cityValue);
    validateFirstName(firstNameValue);
    validateLastName(lastNameValue);

    const isValid = touched && !(emailError || passwordError || nicknameError);
    if (!isValid) return;

    const userData = {
      email: emailValue.trim(),
      password: passwordValue,
      lang: currentLanguage,
    };

    console.log(userData);

    // dispatch(loginUserAsync(userData));
  }

  return isAuthorized ? (
    <div className={styles.wrapper}>
      <div className={styles.avatar}>
        <Avatar size="min(30vw, 20rem)" />
        <div>
          <Tooltip title={language(lng.addPhoto)}>
            <IconButton color="primary">
              <AddAPhoto />
            </IconButton>
          </Tooltip>
          <Tooltip title={language(lng.deletePhoto)}>
            <IconButton color="warning">
              <DeleteForever />
            </IconButton>
          </Tooltip>
        </div>
      </div>
      <div className={styles.inputs}>
        <div className={styles.nickname}>{nickname}</div>
        <form className={styles.content} onSubmit={handleSubmit} noValidate>
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
            label={language(lng.newPassword)}
            required
            error={passwordError}
            onChange={validatePassword}
            helperText={passwordError ? language(lng.passwordHint) : ' '}
          />
          <TextField
            type="number"
            value={ageValue}
            label={language(lng.age)}
            required
            error={ageError}
            onChange={validateAge}
            helperText={ageError ? language(lng.ageHint) : ' '}
          />
          <TextField
            value={countryValue}
            label={language(lng.country)}
            required
            error={countryError}
            onChange={validateCountry}
            helperText={countryError ? language(lng.countryHint) : ' '}
          />
          <TextField
            value={cityValue}
            label={language(lng.city)}
            required
            error={cityError}
            onChange={validateCity}
            helperText={cityError ? language(lng.cityHint) : ' '}
          />
          <TextField
            value={firstNameValue}
            label={language(lng.firstName)}
            required
            error={firstNameError}
            onChange={validateFirstName}
            helperText={firstNameError ? language(lng.firstNameHint) : ' '}
          />
          <TextField
            value={lastNameValue}
            label={language(lng.lastName)}
            required
            error={lastNameError}
            onChange={validateLastName}
            helperText={lastNameError ? language(lng.lastNameHint) : ' '}
          />
          <Button className={styles.updateBtn} type="submit" variant="contained">
            {language(lng.update)}
          </Button>
        </form>
      </div>
    </div>
  ) : (
    <div>User not authorized</div>
  );
}
