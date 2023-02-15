import { useAppDispatch, useAppSelector } from 'app/hooks';
import {
  getCurrentLanguage,
  getDialogs,
  getUserId,
  getUserNickname,
  setDialogs,
} from 'app/mainSlice';
import useLanguage from 'hooks/useLanguage';
import { lng } from 'hooks/useLanguage/types';
import React, { useEffect } from 'react';
import styles from './MessagesPage.module.scss';

export const MessagesPage = () => {
  const dispatch = useAppDispatch();
  const language = useLanguage();
  const dialogs = useAppSelector(getDialogs);
  const userId = useAppSelector(getUserId);
  const nickname = useAppSelector(getUserNickname);
  const lang = useAppSelector(getCurrentLanguage);

  useEffect(() => {
    if (!userId || !nickname) return;
    dispatch(
      setDialogs([
        {
          authorId: userId,
          authorNickname: nickname,
          lastMessageAuthorNickname: 'sfsdf',
          lastMessageDate: String(Date.now()),
          lastMessageId: 5,
          lastMessageText: 'Message Text',
          recipientId: userId,
          recipientNickname: nickname,
          unreadMessages: 4,
        },
      ])
    );
  }, [lang, dispatch, userId, nickname]);

  return (
    <div className={styles.wrapper}>
      <h2>{language(lng.messagesHeading)}</h2>
      <ul>
        {dialogs.map(({ authorNickname }) => (
          <li key={authorNickname}>{authorNickname}</li>
        ))}
      </ul>
    </div>
  );
};
