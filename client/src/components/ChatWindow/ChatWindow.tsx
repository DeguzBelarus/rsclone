import { alpha, Collapse, useTheme } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import {
  getCurrentDialogMessages,
  getCurrentLanguage,
  getDialogMessagesAsync,
  getToken,
  getUserId,
  getUserNickname,
  sendMessageAsync,
} from 'app/mainSlice';
import Avatar from 'components/Avatar';
import { CommentInput } from 'components/CommentInput/CommentInput';
import { PostDate } from 'components/PostDate/PostDate';
import combineClasses from 'lib/combineClasses';
import React, { useEffect } from 'react';
import { IGetDialogMessagesRequest, ISendMessageRequest } from 'types/types';
import styles from './ChatWindow.module.scss';

interface ChatWindowProps {
  recipientId?: number;
  recipientNickname?: string;
  collapsed?: boolean;
}

export const ChatWindow = ({ recipientId, recipientNickname, collapsed }: ChatWindowProps) => {
  const { palette } = useTheme();
  const dispatch = useAppDispatch();
  const lang = useAppSelector(getCurrentLanguage);
  const token = useAppSelector(getToken);
  const authorId = useAppSelector(getUserId);
  const authorNickname = useAppSelector(getUserNickname);
  const messages = useAppSelector(getCurrentDialogMessages);

  const handleSend = (messageText: string) => {
    if (!token || !authorId || !authorNickname || !recipientId || !recipientNickname) return;
    const request: ISendMessageRequest = {
      lang,
      token,
      requestData: {
        authorId,
        authorNickname,
        recipientId,
        recipientNickname,
        messageText,
      },
    };
    dispatch(sendMessageAsync(request));
  };

  useEffect(() => {
    if (!token || !authorId || !recipientId) return;
    const request: IGetDialogMessagesRequest = {
      lang,
      token,
      userId: authorId,
      interlocutorId: recipientId,
    };
    dispatch(getDialogMessagesAsync(request));
  }, [recipientId, authorId, dispatch, lang, token]);

  return (
    <div className={combineClasses(styles.wrapper, [styles.collapsed, collapsed])}>
      <div className={styles.messages}>
        {messages && (
          <ul className={styles.messages}>
            {messages.map(({ id, messageText, userId, authorNickname, authorAvatarSrc, date }) => {
              const self = userId === authorId;
              return (
                <li
                  key={id}
                  className={combineClasses(styles.message, [styles.self, self])}
                  style={{
                    backgroundColor: alpha(
                      self ? palette.primary.main : palette.secondary.main,
                      0.1
                    ),
                  }}
                >
                  <Avatar user={userId} avatarSrc={authorAvatarSrc} />
                  <div className={styles.text}>
                    <div className={styles.name}>
                      <span className={styles.nickname}> {authorNickname}</span>
                      <span className={styles.date}>
                        <PostDate date={date} />
                      </span>
                    </div>
                    <div className={styles.messageBody}>{messageText}</div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <CommentInput value="" onSubmit={handleSend} />
    </div>
  );
};
