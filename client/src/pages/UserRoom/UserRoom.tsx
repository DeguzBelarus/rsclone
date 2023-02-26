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
  getUserRequestStatus,
  setChats,
  getChats,
  setActiveChatId,
  deleteUserAsync,
  updateUserAsync,
} from 'app/mainSlice';
import { IGetOneUserRequestData, IUpdateUserRequestData, Nullable, RoleType } from 'types/types';
import styles from './UserRoom.module.scss';
import useLanguage from 'hooks/useLanguage';
import { Button, Chip, ClickAwayListener, Tooltip } from '@mui/material';
import FaceIcon from '@mui/icons-material/Face';
import DotIcon from '@mui/icons-material/FiberManualRecord';
import MessageIcon from '@mui/icons-material/QuestionAnswerRounded';
import Avatar from 'components/Avatar/Avatar';
import { lng } from 'hooks/useLanguage/types';
import { FabButton } from 'components/FabButton/FabButton';
import { EditPostModal } from 'components/EditPostModal/EditPostModal';
import { Posts } from 'components/Posts/Posts';
import { Page404 } from 'pages/Page404/Page404';
import { ProcessingPage } from 'pages/ProcessingPage/ProcessingPage';
import joinStrings from 'lib/joinStrings';
import LocationIcon from '@mui/icons-material/LocationOn';
import { USER_ROLE_ADMIN } from 'consts';
import combineClasses from 'lib/combineClasses';
import useConfirmModal from 'hooks/useConfirmModal';
import useTruncateUserList from 'hooks/useTruncateUserList';

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
  const [DeleteUserModal, openDeleteUserModal] = useConfirmModal();
  const [UserRoleModal, openUserRoleModal] = useConfirmModal();

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
  const chats = useAppSelector(getChats);

  const isUserFound = isAuthorized && (isOwnPage || (id && guestUserData));

  const usersOnlineToDisplay = useTruncateUserList(usersOnline);

  const handleStartChat = () => {
    if (!guestUserData) return;
    const { id: partnerId, nickname: partnerNickname, avatar: partnerAvatar } = guestUserData;
    const addedChatIndex = chats.findIndex((chat) => partnerId === chat.partnerId);
    if (addedChatIndex < 0) {
      dispatch(setChats([...chats, { partnerId, partnerAvatar, partnerNickname }]));
    }
    dispatch(setActiveChatId(partnerId));
  };

  const handleUserDelete = async () => {
    if (!token || !userId || !guestUserData?.id) return;
    const request = {
      token,
      requestData: {
        lang,
        ownId: userId,
        id: guestUserData.id,
      },
    };

    const { meta } = await dispatch(deleteUserAsync(request));
    if (meta?.requestStatus === 'fulfilled') navigate('/');
  };

  const handleUserUpgrade = async () => {
    if (!token || !userId || !guestUserData?.id) return;
    const requestData = new FormData();
    requestData.append('lang', lang);
    requestData.append('id', String(guestUserData.id));
    requestData.append('role', 'ADMIN');

    const request: IUpdateUserRequestData = {
      type: 'role',
      ownId: userId,
      token,
      requestData,
    };

    const { meta } = await dispatch(updateUserAsync(request));
    if (meta?.requestStatus === 'fulfilled') {
      dispatch(getOneUserInfoAsync({ token, requestData: { id: guestUserData.id, lang } }));
    }
  };

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
                label={`${language(lng.online)}: ${usersOnline.length}`}
                onClick={() => setUsersOnlineOpen((current) => !current)}
              />
            </Tooltip>
          </ClickAwayListener>
        )}
        {!isOwnPage && (
          <Tooltip title={language(lng.chatWriteMessage)}>
            <Chip
              className={styles.message}
              color="primary"
              label={language(lng.chat)}
              icon={<MessageIcon />}
              onClick={handleStartChat}
            />
          </Tooltip>
        )}
        <div className={styles.info}>
          <Avatar size="min(40vw, 20rem)" user={id || undefined} avatarSrc={avatar || undefined} />
          <h3 className={combineClasses(styles.nickname, 'user-nickname')}>
            <span className={styles.nick}>{nick}</span>
            <Tooltip arrow title={language(online ? lng.online : lng.offline)}>
              <DotIcon className={styles.dot} color={online ? 'success' : 'disabled'} />
            </Tooltip>
          </h3>
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
        {!isOwnPage && role === USER_ROLE_ADMIN && !admin && (
          <div className={styles.danger}>
            <Button onClick={openUserRoleModal} variant="contained">
              {language(lng.upgradeRole)}
            </Button>
            <UserRoleModal title={language(lng.upgradeRole)} onSuccess={handleUserUpgrade}>
              {language(lng.upgradeRoleMsg)}
            </UserRoleModal>

            <Button onClick={openDeleteUserModal} variant="contained" color="error">
              {language(lng.deleteAccount)}
            </Button>
            <DeleteUserModal title={language(lng.deleteAccount)} onSuccess={handleUserDelete}>
              {language(lng.deleteAccountOtherMsg)}
            </DeleteUserModal>
          </div>
        )}
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
            role === USER_ROLE_ADMIN,
            true
          )}
          <h2>{language(lng.postTitleMsg)}</h2>
          {posts.length ? (
            <Posts data={posts} origin="user-room" socket={socket} className={styles.posts} />
          ) : (
            <p>{language(lng.postSelfUser)}</p>
          )}
          <FabButton value={language(lng.userAddPost)} onClick={() => setNewPostModalOpen(true)} />
        </>
      ) : (
        guestUserData && (
          <>
            {renderUser(
              Number(id),
              guestUserData.nickname,
              role === USER_ROLE_ADMIN ? guestUserData.email : null,
              String(guestUserData.age || ''),
              guestUserData.city,
              guestUserData.country,
              guestUserData.firstName,
              guestUserData.lastName,
              guestUserData.avatar,
              guestUserData.role === USER_ROLE_ADMIN,
              usersOnline.find((nickname) => nickname === guestUserData.nickname) !== undefined
            )}
            <h2>{language(lng.postTitleMsg)}</h2>
            {guestUserData.posts?.length ? (
              <Posts data={guestUserData.posts} origin="user-room" socket={socket} />
            ) : (
              <p>{language(lng.postGuestUser)}</p>
            )}
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
