import {
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Tooltip,
  useTheme,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { getChats, getDialogs, getUserId, setActiveChatId, setChats } from 'app/mainSlice';
import Avatar from 'components/Avatar';
import { PostDate } from 'components/PostDate/PostDate';
import useLanguage from 'hooks/useLanguage';
import { lng } from 'hooks/useLanguage/types';
import React from 'react';
import { IUserDialog } from 'types/types';
import UnreadIcon from '@mui/icons-material/MarkUnreadChatAlt';
import MessageIcon from '@mui/icons-material/Message';
import styles from './MessagesPage.module.scss';

export const MessagesPage = () => {
  const language = useLanguage();
  const { palette } = useTheme();
  const dispatch = useAppDispatch();
  const dialogs: IUserDialog[] = useAppSelector(getDialogs);
  const userId = useAppSelector(getUserId);
  const chats = useAppSelector(getChats);

  const handleStartChat = (
    partnerId: number,
    partnerNickname: string,
    partnerAvatar?: string | null
  ) => {
    const addedChatIndex = chats.findIndex((chat) => partnerId === chat.partnerId);
    if (addedChatIndex < 0) {
      dispatch(setChats([...chats, { partnerId, partnerNickname, partnerAvatar }]));
    }
    dispatch(setActiveChatId(partnerId));
  };

  return (
    <div className={styles.wrapper}>
      <h2>{language(lng.messagesHeading)}</h2>
      {dialogs.length && userId ? (
        <List>
          {dialogs.map(
            ({
              authorId,
              recipientId,
              authorNickname,
              recipientNickname,
              authorAvatarSrc,
              recipientAvatarSrc,
              lastMessageText,
              lastMessageDate,
              unreadMessages,
            }) => {
              const partnerId = authorId === userId ? recipientId : authorId;
              const partnerNickname = authorId === userId ? recipientNickname : authorNickname;
              const partnerAvatar = authorId === userId ? recipientAvatarSrc : authorAvatarSrc;
              return (
                <ListItemButton
                  key={partnerId}
                  onClick={() => handleStartChat(partnerId, partnerNickname, partnerAvatar)}
                >
                  <Tooltip title={language(lng.messagesClickToChat)}>
                    <ListItemAvatar>
                      <Avatar user={partnerId} avatarSrc={partnerAvatar} size="3rem" />
                    </ListItemAvatar>
                  </Tooltip>
                  <ListItemText
                    primary={partnerNickname}
                    secondary={
                      <span className={styles.secondary}>
                        <span className={styles.unread}>
                          <MessageIcon fontSize="small" />
                          {`${language(lng.messagesLastMsg)}: ${lastMessageText}`}
                        </span>
                        <span
                          className={styles.unread}
                          style={{ color: unreadMessages ? palette.success.light : undefined }}
                        >
                          <UnreadIcon fontSize="small" />
                          {`${language(lng.messagesUnread)}: ${unreadMessages}`}
                        </span>
                        <span>
                          <PostDate date={lastMessageDate} />
                        </span>
                      </span>
                    }
                  />
                </ListItemButton>
              );
            }
          )}
        </List>
      ) : (
        <div>{language(lng.messagesNoneMsg)}</div>
      )}
    </div>
  );
};
