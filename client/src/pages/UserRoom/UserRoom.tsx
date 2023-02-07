import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { Action, ThunkDispatch } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { useParams } from 'react-router-dom';
import { Socket } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

import {
  getIsAuthorized,
  getUserEmail,
  getUserId,
  getUserNickname,
  getOneUserInfoAsync,
  getToken,
  getCurrentLanguage,
  getAvatarSrc,
  getGuestUserData,
  getUserRole,
  setGuestUserData,
  getIsLoginNotificationSent,
  setIsLoginNotificationSent,
  getUsersOnline,
} from 'app/mainSlice';
import { IGetOneUserRequestData, Nullable, RoleType } from 'types/types';
import './UserRoom.scss';

interface Props {
  socket: Socket<DefaultEventsMap, DefaultEventsMap>;
}

export const UserRoom: FC<Props> = (socket): JSX.Element => {
  const dispatch = useAppDispatch();
  const thunkDispatch = useDispatch<ThunkDispatch<RootState, unknown, Action<string>>>();
  const { id } = useParams();

  const [isOwnPage, setIsOwnPage] = useState<boolean>(true);
  const userId = useAppSelector<Nullable<number>>(getUserId);
  const token = useAppSelector<Nullable<string>>(getToken);
  const role = useAppSelector<Nullable<RoleType>>(getUserRole);
  const avatarSrc = useAppSelector<Nullable<string>>(getAvatarSrc);
  const guestUserData = useAppSelector(getGuestUserData);
  const currentLanguage = useAppSelector(getCurrentLanguage);
  const isAuthorized = useAppSelector(getIsAuthorized);
  const userEmail = useAppSelector(getUserEmail);
  const userNickname = useAppSelector(getUserNickname);
  const isLoginNotificationSent = useAppSelector(getIsLoginNotificationSent);
  const usersOnline = useAppSelector(getUsersOnline);

  useEffect(() => {
    if (!id || (id && Number(id) === userId)) {
      if (!isOwnPage) {
        setIsOwnPage(true);
      }
      if (token && userId) {
        const getOneUserRequestData: IGetOneUserRequestData = {
          token,
          requestData: { id: userId, lang: currentLanguage },
        };
        thunkDispatch(getOneUserInfoAsync(getOneUserRequestData));
      }
    }
    if (id && Number(id) !== userId) {
      setIsOwnPage(false);
      if (token) {
        const getOneUserRequestData: IGetOneUserRequestData = {
          token,
          requestData: { id: Number(id), lang: currentLanguage },
        };
        thunkDispatch(getOneUserInfoAsync(getOneUserRequestData));
      }
    }
  }, [id]);

  useEffect(() => {
    console.log(id);
    if (!isLoginNotificationSent) {
      socket.socket.emit('userOnline', userNickname);
      setIsLoginNotificationSent(true);
    }

    return () => {
      dispatch(setGuestUserData(null));
    };
  }, []);
  return (
    <div className="user-room-wrapper">
      <span>{`users online: ${usersOnline.length}`}</span>
      {isOwnPage ? (
        <>
          <div>UserRoom works!</div>
          {isAuthorized && (
            <div className="user-data">
              <div>
                {avatarSrc && userId ? (
                  <img
                    width={200}
                    src={`/${userId}/avatar/${avatarSrc}`}
                    alt={currentLanguage === 'ru' ? 'аватарка пользователя' : 'user avatar'}
                  />
                ) : null}
              </div>
              <div>Email: {userEmail}</div>
              <div>Nickname: {userNickname}</div>
              <div>own page</div>
            </div>
          )}
        </>
      ) : (
        <>
          <div>UserRoom works!</div>
          {isAuthorized && (
            <div className="user-data">
              <div>
                {guestUserData && id ? (
                  <img
                    width={200}
                    src={`/${id}/avatar/${guestUserData.avatar}`}
                    alt={currentLanguage === 'ru' ? 'аватарка пользователя' : 'user avatar'}
                  />
                ) : null}
              </div>
              {role === 'ADMIN' && guestUserData?.email ? (
                <>
                  <span>admin rights additional info:</span>
                  <div>{`${guestUserData.nickname} email: ${guestUserData.email}`}</div>
                </>
              ) : null}
              <div>Nickname: {guestUserData?.nickname}</div>
              <div>guest page</div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
