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
  getPosts,
  getUserAge,
  getUserCity,
  getUserCountry,
  getUserFirstName,
  getUserLastName,
} from 'app/mainSlice';
import { IGetOneUserRequestData, Nullable, RoleType } from 'types/types';
import styles from './UserRoom.module.scss';
import useLanguage from 'hooks/useLanguage';
import { Chip } from '@mui/material';
import FaceIcon from '@mui/icons-material/Face';
import VerifiedIcon from '@mui/icons-material/Verified';
import Avatar from 'components/Avatar';
import { lng } from 'hooks/useLanguage/types';
import { FabButton } from 'components/FabButton/FabButton';
import { EditPostModal } from 'components/EditPostModal/EditPostModal';
import { Posts } from 'components/Posts/Posts';
import { Page404 } from 'pages/Page404/Page404';
import { Post } from 'components/Post/Post';
import joinStrings from 'lib/joinStrings';

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

  const isUserFound = isAuthorized && (isOwnPage || (id && guestUserData));

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
    own = false
  ) => {
    return (
      <div className={styles.user}>
        <Chip
          className={styles.online}
          color="success"
          icon={<FaceIcon />}
          label={`online: ${usersOnline.length}`}
        />
        <div className={styles.info}>
          <Avatar size="min(40vw, 20rem)" user={id || undefined} avatarSrc={avatar || undefined} />
          <span className={styles.nickname}>
            <span className={styles.nick}>{nick}</span>
            {own && <VerifiedIcon className={styles.verified} color="success" fontSize="large" />}
          </span>
          <div className={styles.additional}>
            {admin && <span>({language(lng.admin)})</span>}
            {(firstName || lastName || age) && (
              <span>{joinStrings(', ', joinStrings(' ', firstName, lastName), age)}</span>
            )}
            {(city || country) && <span>{joinStrings(', ', city, country)}</span>}
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
            isOwnPage
          )}
          <Posts data={posts} />
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
              guestUserData.role === 'ADMIN'
            )}
            {guestUserData.posts && <Posts data={guestUserData.posts} />}
          </>
        )
      )}
      <EditPostModal open={newPostModalOpen} onClose={() => setNewPostModalOpen(false)} />
    </div>
  ) : (
    <Page404 message={language(lng.postNotFound).replace('%', id || '')} />
  );
};
