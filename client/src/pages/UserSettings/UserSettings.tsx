import React, { ChangeEvent, FormEvent, useState, FC, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import {
  getCurrentLanguage,
  getIsAuthorized,
  getToken,
  getUserAge,
  getUserCity,
  getUserRole,
  getUserCountry,
  getUserEmail,
  getUserFirstName,
  getUserId,
  getUserLastName,
  getUserNickname,
  updateUserAsync,
  deleteUserAsync,
  getAvatarSrc,
  setIsAuthorized,
} from 'app/mainSlice';
import Avatar from 'components/Avatar';
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
  PASSWORD_OR_EMPTY_PATTERN,
} from 'consts';
import { IDeleteUserRequestData, IUpdateUserRequestData } from 'types/types';
import { Socket } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { ConfirmModal } from 'components/ConfirmModal/ConfirmModal';

interface Props {
  socket: Socket<DefaultEventsMap, DefaultEventsMap>;
}

export const UserSettings: FC<Props> = ({ socket }) => {
  const navigate = useNavigate();
  const isAuthorized = useAppSelector(getIsAuthorized);
  const nickname = useAppSelector(getUserNickname);
  const email = useAppSelector(getUserEmail);
  const role = useAppSelector(getUserRole);
  const age = useAppSelector(getUserAge);
  const country = useAppSelector(getUserCountry);
  const city = useAppSelector(getUserCity);
  const firstName = useAppSelector(getUserFirstName);
  const lastName = useAppSelector(getUserLastName);
  const ownId = useAppSelector(getUserId);
  const avatarSrc = useAppSelector(getAvatarSrc);
  const token = useAppSelector(getToken);
  const currentLanguage = useAppSelector(getCurrentLanguage);

  const dispatch = useAppDispatch();
  const language = useLanguage();

  const [nicknameValue, setNicknameValue] = useState(nickname || '');
  const [emailValue, setEmailValue] = useState(email || '');
  const [passwordValue, setPasswordValue] = useState('');
  const [repeatPasswordValue, setRepeatPasswordValue] = useState('');
  const [ageValue, setAgeValue] = useState(age ? String(age) : '');
  const [countryValue, setCountryValue] = useState(country || '');
  const [cityValue, setCityValue] = useState(city || '');
  const [firstNameValue, setFirstNameValue] = useState(firstName || '');
  const [lastNameValue, setLastNameValue] = useState(lastName || '');
  const [nicknameError, setNicknameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [repeatPasswordError, setRepeatPasswordError] = useState(false);
  const [ageError, setAgeError] = useState(false);
  const [countryError, setCountryError] = useState(false);
  const [cityError, setCityError] = useState(false);
  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);

  const [touched, setTouched] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [roleModalOpen, setRoleModalOpen] = useState(false);

  const validateNickname = useValidateInput(
    NICKNAME_PATTERN,
    setNicknameValue,
    setNicknameError,
    setTouched
  );

  const validateEmail = useValidateInput(EMAIL_PATTERN, setEmailValue, setEmailError, setTouched);

  const validatePassword = useValidateInput(
    PASSWORD_OR_EMPTY_PATTERN,
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

  const infoUpdate = async (event: FormEvent) => {
    event.preventDefault();
    validateNickname(nicknameValue);
    validateEmail(emailValue);
    validatePassword(passwordValue);
    validateRepeatPassword(repeatPasswordValue);
    validateAge(ageValue);
    validateCountry(countryValue);
    validateCity(cityValue);
    validateFirstName(firstNameValue);
    validateLastName(lastNameValue);

    const isValid =
      touched && !(emailError || passwordError || nicknameError || repeatPasswordError);
    if (!isValid || !ownId || !token) return;

    const formData = new FormData();
    formData.append('lang', currentLanguage);
    formData.append('id', String(ownId));
    formData.append('nickname', nicknameValue);
    formData.append('email', emailValue);
    formData.append('age', String(ageValue || ''));
    formData.append('country', countryValue);
    formData.append('city', cityValue);
    formData.append('firstName', firstNameValue);
    formData.append('lastName', lastNameValue);
    if (passwordValue !== '') {
      formData.append('password', passwordValue);
    }

    const updateUserInfoRequestData: IUpdateUserRequestData = {
      type: 'info',
      ownId,
      token,
      requestData: formData,
    };
    await dispatch(updateUserAsync(updateUserInfoRequestData));
    setPasswordValue('');
    setRepeatPasswordValue('');
    setPasswordError(false);
    setRepeatPasswordError(false);
    setTouched(false);
  };

  const avatarUpdate = (event: ChangeEvent<HTMLInputElement>) => {
    if (!ownId || !token) return;
    const files = event.target.files;

    if (files && files[0]) {
      const formData = new FormData();
      formData.append('lang', currentLanguage);
      formData.append('id', String(ownId));
      formData.append('avatar', files[0]);

      const avatarRequestData: IUpdateUserRequestData = {
        type: 'avatar',
        ownId,
        token,
        requestData: formData,
      };
      dispatch(updateUserAsync(avatarRequestData));
    }
  };

  const avatarDelete = () => {
    if (!ownId || !token) return;
    const formData = new FormData();
    formData.append('lang', currentLanguage);
    formData.append('id', String(ownId));
    formData.append('avatar', '');

    const avatarRequestData: IUpdateUserRequestData = {
      type: 'avatar',
      ownId,
      token,
      requestData: formData,
    };
    dispatch(updateUserAsync(avatarRequestData));
  };

  const roleDowngrade = () => {
    if (!ownId || !token) return;
    const formData = new FormData();
    formData.append('lang', currentLanguage);
    formData.append('id', String(ownId));
    formData.append('role', 'USER');

    const roleRequestData: IUpdateUserRequestData = {
      type: 'role',
      ownId,
      token,
      requestData: formData,
    };
    dispatch(updateUserAsync(roleRequestData));
  };

  const userDelete = () => {
    if (!ownId || !token) return;
    const deleteUserRequestData: IDeleteUserRequestData = {
      token,
      requestData: {
        lang: currentLanguage,
        id: ownId,
        ownId: ownId,
      },
    };
    dispatch(deleteUserAsync(deleteUserRequestData));
    if (isAuthorized) {
      dispatch(setIsAuthorized(false));
      navigate('/login');
    }
    socket.emit('userOffline', nickname);
  };

  useEffect(() => {
    if (nickname) {
      socket.emit('nicknameUpdated', nickname);
    }
  }, [nickname]);

  return isAuthorized ? (
    <div className={styles.wrapper}>
      <div className={styles.avatar}>
        <Avatar size="min(40vw, 20rem)" />
        <div>
          <Tooltip title={language(lng.addPhoto)} placement="top">
            <IconButton component="label" color="primary">
              <input
                id="avatar-image"
                accept="image/*"
                hidden
                type="file"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => avatarUpdate(event)}
              />
              <AddAPhoto />
            </IconButton>
          </Tooltip>
          <Tooltip title={language(lng.deletePhoto)} placement="top">
            <span>
              <IconButton
                color="warning"
                onClick={avatarDelete}
                disabled={avatarSrc === null || avatarSrc === undefined || avatarSrc === ''}
              >
                <DeleteForever />
              </IconButton>
            </span>
          </Tooltip>
        </div>
        <div className={styles.nickname}>{nickname}</div>
      </div>

      <div className={styles.danger}>
        <h3 className={styles.dangerTitle}>{language(lng.dangerZone)}</h3>
        {role === 'ADMIN' && (
          <>
            <Button onClick={() => setRoleModalOpen(true)} variant="contained">
              {language(lng.giveUpAdmin)}
            </Button>
            <ConfirmModal
              open={roleModalOpen}
              title={language(lng.giveUpAdmin)}
              onClose={() => setRoleModalOpen(false)}
              onSuccess={roleDowngrade}
            >
              {language(lng.giveUpAdminMsg)}
            </ConfirmModal>
          </>
        )}

        <Button onClick={() => setDeleteModalOpen(true)} variant="contained" color="error">
          {language(lng.deleteAccount)}
        </Button>
        <ConfirmModal
          open={deleteModalOpen}
          title={language(lng.deleteAccount)}
          onClose={() => setDeleteModalOpen(false)}
          onSuccess={userDelete}
        >
          {language(lng.deleteAccountMsg)}
        </ConfirmModal>
      </div>

      <form className={styles.inputs} onSubmit={infoUpdate} noValidate>
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
          type="password"
          value={repeatPasswordValue}
          label={language(lng.repeatPassword)}
          required
          error={repeatPasswordError}
          onChange={validateRepeatPassword}
          helperText={repeatPasswordError ? language(lng.repeatPasswordHint) : ' '}
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
  ) : (
    <div>User not authorized</div>
  );
};
