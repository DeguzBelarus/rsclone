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
          requestData: { id: Number(id), lang: currentLanguage },
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
    avatar?: Nullable<string>,
    own = false,
    admin = false
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
          {renderUser(userId, userNickname, userEmail, avatarSrc, isOwnPage, role === 'ADMIN')}
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
              guestUserData.avatar
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
