import React, { FC, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { useParams, useNavigate } from 'react-router-dom';
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

export const UserRoom: FC<Props> = ({ socket }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
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
    }
    if (id && Number(id) !== userId) {
      setIsOwnPage(false);
      if (token) {
        const getOneUserRequestData: IGetOneUserRequestData = {
          token,
          requestData: { id: Number(id), lang: currentLanguage },
        };
        dispatch(getOneUserInfoAsync(getOneUserRequestData));
      }
    }
  }, [id]);

  useEffect(() => {
    console.log(id, isLoginNotificationSent);
    if (!isLoginNotificationSent) {
      if (!id) {
        navigate(`/user/${userId}`);
      }
      socket.emit('userOnline', userNickname);
      dispatch(setIsLoginNotificationSent(true));
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
          {isAuthorized && id && guestUserData ? (
            <>
              {isAuthorized && (
                <div className="user-data">
                  <div>
                    {guestUserData.avatar ? (
                      <img
                        width={200}
                        src={`/${id}/avatar/${guestUserData.avatar}`}
                        alt={currentLanguage === 'ru' ? 'аватарка пользователя' : 'user avatar'}
                      />
                    ) : null}
                  </div>
                  {role === 'ADMIN' && guestUserData.email ? (
                    <>
                      <span>admin rights additional info:</span>
                      <div>{`${guestUserData.nickname} email: ${guestUserData.email}`}</div>
                    </>
                  ) : null}
                  <div>Nickname: {guestUserData.nickname}</div>
                  <div>guest page</div>
                </div>
              )}
            </>
          ) : (
            <span>user not found</span>
          )}
        </>
      )}
    </div>
  );
};
