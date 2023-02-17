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
import { IUserDialog } from 'types/types';
import styles from './MessagesPage.module.scss';

export const MessagesPage = () => {
  const language = useLanguage();
  const dispatch = useAppDispatch();
  const dialogs: IUserDialog[] = useAppSelector(getDialogs);
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
        {dialogs.length && userId
          ? dialogs.map((dialog, index) => {
              return (
                <div
                  style={{
                    border: '1px solid white',
                    padding: '20px',
                    cursor: 'pointer',
                    margin: '5px',
                  }}
                  key={index}
                  onClick={() =>
                    handleStartChat(
                      dialog.authorId === userId ? dialog.recipientId : dialog.authorId,
                      dialog.authorNickname === nickname
                        ? dialog.recipientNickname
                        : dialog.authorNickname
                    )
                  }
                >
                  <h1>
                    {dialog.authorNickname === nickname
                      ? dialog.recipientNickname
                      : dialog.authorNickname}
                  </h1>
                  <p>{`message: ${dialog.lastMessageText} (from ${new Date(
                    Number(dialog.lastMessageDate)
                  )})`}</p>
                  <span>{`unread: ${dialog.unreadMessages}`}</span>
                </div>
              );
            })
          : null}
      </List>
    </div>
  );
};
