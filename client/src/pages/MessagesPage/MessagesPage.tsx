import { List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import {
  getChats,
  getCurrentLanguage,
  getDialogs,
  getUserId,
  getUserNickname,
  setActiveChatId,
  setChats,
} from 'app/mainSlice';
import useLanguage from 'hooks/useLanguage';
import { lng } from 'hooks/useLanguage/types';
import React from 'react';
import styles from './MessagesPage.module.scss';

export const MessagesPage = () => {
  const language = useLanguage();
  const dispatch = useAppDispatch();
  const dialogs = useAppSelector(getDialogs);
  const userId = useAppSelector(getUserId);
  const nickname = useAppSelector(getUserNickname);
  const lang = useAppSelector(getCurrentLanguage);
  const chats = useAppSelector(getChats);

  const handleStartChat = (partnerId: number, partnerNickname: string) => {
    const addedChatIndex = chats.findIndex((chat) => partnerId === chat.partnerId);
    if (addedChatIndex < 0) {
      dispatch(setChats([...chats, { partnerId, partnerNickname }]));
    }
    dispatch(setActiveChatId(partnerId));
  };

  return (
    <div className={styles.wrapper}>
      <h2>{language(lng.messagesHeading)}</h2>
      <List>
        {dialogs.map(({ recipientId, recipientNickname, unreadMessages }) => (
          <ListItem key={recipientId} disablePadding>
            <ListItemButton onClick={() => handleStartChat(recipientId, recipientNickname)}>
              <ListItemText primary={`${recipientNickname} (${unreadMessages})`} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );
};
