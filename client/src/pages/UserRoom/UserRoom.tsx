import React, { FC, useEffect, useMemo, useState } from 'react';
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
  getPosts,
  getUserAge,
  getUserCity,
  getUserCountry,
  getUserFirstName,
  getUserLastName,
  getUserRequestStatus,
} from 'app/mainSlice';
import { IGetOneUserRequestData, Nullable, RoleType } from 'types/types';
import styles from './UserRoom.module.scss';
import useLanguage from 'hooks/useLanguage';
import { Chip, ClickAwayListener, Tooltip } from '@mui/material';
import FaceIcon from '@mui/icons-material/Face';
import DotIcon from '@mui/icons-material/FiberManualRecord';
import Avatar from 'components/Avatar';
import { lng } from 'hooks/useLanguage/types';
import { FabButton } from 'components/FabButton/FabButton';
import { EditPostModal } from 'components/EditPostModal/EditPostModal';
import { Posts } from 'components/Posts/Posts';
import { Page404 } from 'pages/Page404/Page404';
import { ProcessingPage } from 'pages/ProcessingPage/ProcessingPage';
import joinStrings from 'lib/joinStrings';
import LocationIcon from '@mui/icons-material/LocationOn';
import { SHOW_MAX_USERS_ONLINE } from 'consts';

interface Props {
  socket: Socket<DefaultEventsMap, DefaultEventsMap>;
}

export const UserRoom: FC<Props> = ({ socket }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const language = useLanguage();
  const { id } = useParams();

  const [isOwnPage, setIsOwnPage] = useState<boolean>(true);
  const [newPostModalOpen, setNewPostModalOpen] = useState(false);
  const [usersOnlineOpen, setUsersOnlineOpen] = useState(false);
  const isAuthorized = useAppSelector(getIsAuthorized);
  const userId = useAppSelector<Nullable<number>>(getUserId);
  const token = useAppSelector<Nullable<string>>(getToken);
  const role = useAppSelector<Nullable<RoleType>>(getUserRole);
  const avatarSrc = useAppSelector<Nullable<string>>(getAvatarSrc);
  const userEmail = useAppSelector(getUserEmail);
  const userNickname = useAppSelector(getUserNickname);
  const userAge = useAppSelector(getUserAge);
  const userCity = useAppSelector(getUserCity);
  const userCountry = useAppSelector(getUserCountry);
  const userFirstName = useAppSelector(getUserFirstName);
  const userLastName = useAppSelector(getUserLastName);
  const guestUserData = useAppSelector(getGuestUserData);
  const lang = useAppSelector(getCurrentLanguage);
  const isLoginNotificationSent = useAppSelector(getIsLoginNotificationSent);
  const usersOnline = useAppSelector(getUsersOnline);
  const posts = useAppSelector(getPosts);
  const userRequestStatus = useAppSelector(getUserRequestStatus);

  const isUserFound = isAuthorized && (isOwnPage || (id && guestUserData));

  const usersOnlineToDisplay = useMemo(() => {
    const users = usersOnline.slice(0, SHOW_MAX_USERS_ONLINE);
    if (usersOnline.length > SHOW_MAX_USERS_ONLINE)
      users.push(
        language(lng.onlineAndMore).replace('%', String(usersOnline.length - SHOW_MAX_USERS_ONLINE))
      );
    return users;
  }, [usersOnline]);

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
          requestData: { id: Number(id), lang },
        };
        dispatch(getOneUserInfoAsync(getOneUserRequestData));
      }
    }
  }, [id]);

  useEffect(() => {
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

  const renderUser = (
    id?: Nullable<number>,
    nick?: Nullable<string>,
    email?: Nullable<string>,
    age?: Nullable<string>,
    city?: Nullable<string>,
    country?: Nullable<string>,
    firstName?: Nullable<string>,
    lastName?: Nullable<string>,
    avatar?: Nullable<string>,
    admin = false,
    online = false
  ) => {
    return (
      <div className={styles.user}>
        {usersOnline.length > 0 && (
          <ClickAwayListener onClickAway={() => setUsersOnlineOpen(false)}>
            <Tooltip
              arrow
              open={usersOnlineOpen}
              title={
                <ul>
                  {usersOnlineToDisplay.map((nickname) => (
                    <li key={nickname}>{nickname}</li>
                  ))}
                </ul>
              }
            >
              <Chip
                className={styles.online}
                color="success"
                icon={<FaceIcon />}
                label={`online: ${usersOnline.length}`}
                onClick={() => setUsersOnlineOpen((current) => !current)}
              />
            </Tooltip>
          </ClickAwayListener>
        )}
        <div className={styles.info}>
          <Avatar size="min(40vw, 20rem)" user={id || undefined} avatarSrc={avatar || undefined} />
          <span className={styles.nickname}>
            <span className={styles.nick}>{nick}</span>
            <Tooltip arrow title={language(online ? lng.online : lng.offline)}>
              <DotIcon color={online ? 'success' : 'disabled'} />
            </Tooltip>
          </span>
          <div className={styles.additional}>
            {admin && <span>({language(lng.admin)})</span>}
            {(firstName || lastName || age) && (
              <span>{joinStrings(', ', joinStrings(' ', firstName, lastName), age)}</span>
            )}
            {(city || country) && (
              <span className={styles.location}>
                <LocationIcon />
                {joinStrings(', ', city, country)}
              </span>
            )}
            <span>{email}</span>
          </div>
        </div>
      </div>
    );
  };

  return isUserFound ? (
    <div className={styles.wrapper}>
      {isOwnPage ? (
        <>
          {renderUser(
            userId,
            userNickname,
            userEmail,
            String(userAge || ''),
            userCity,
            userCountry,
            userFirstName,
            userLastName,
            avatarSrc,
            role === 'ADMIN',
            true
          )}
          <Posts data={posts} socket={socket} className={styles.posts} />
          <FabButton value={language(lng.userAddPost)} onClick={() => setNewPostModalOpen(true)} />
        </>
      ) : (
        guestUserData && (
          <>
            {renderUser(
              Number(id),
              guestUserData.nickname,
              role === 'ADMIN' ? guestUserData.email : null,
              String(guestUserData.age || ''),
              guestUserData.city,
              guestUserData.country,
              guestUserData.firstName,
              guestUserData.lastName,
              guestUserData.avatar,
              guestUserData.role === 'ADMIN',
              usersOnline.find((nickname) => nickname === guestUserData.nickname) !== undefined
            )}
            {guestUserData.posts && <Posts data={guestUserData.posts} socket={socket} />}
          </>
        )
      )}
      <EditPostModal
        open={newPostModalOpen}
        socket={socket}
        onClose={() => setNewPostModalOpen(false)}
      />
    </div>
  ) : userRequestStatus === 'loading' ? (
    <ProcessingPage />
  ) : (
    <Page404 message={language(lng.userNotFound).replace('%', id || '')} />
  );
};
