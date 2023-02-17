import { alpha, IconButton, Paper, Tooltip, useTheme } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import {
  deleteMessageAsync,
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
import useLanguage from 'hooks/useLanguage';
import { lng } from 'hooks/useLanguage/types';
import combineClasses from 'lib/combineClasses';
import React, { useEffect } from 'react';
import {
  IDeleteMessageRequest,
  IGetDialogMessagesRequest,
  IMessageModel,
  ISendMessageRequest,
} from 'types/types';
import styles from './ChatWindow.module.scss';
import DeleteIcon from '@mui/icons-material/DeleteForever';

interface ChatWindowProps {
  recipientId?: number;
  recipientNickname?: string;
  collapsed?: boolean;
}

export const ChatWindow = ({ recipientId, recipientNickname, collapsed }: ChatWindowProps) => {
  const { palette } = useTheme();
  const language = useLanguage();
  const dispatch = useAppDispatch();
  const lang = useAppSelector(getCurrentLanguage);
  const token = useAppSelector(getToken);
  const authorId = useAppSelector(getUserId);
  const authorNickname = useAppSelector(getUserNickname);
  const messages: IMessageModel[] | null = useAppSelector(getCurrentDialogMessages);

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

  const handleDelete = async (messageId?: number, ownerId?: number, recipientId?: number) => {
    if (!token || !messageId || !ownerId || !recipientId) return;
    const request: IDeleteMessageRequest = {
      lang,
      token,
      messageId,
      ownerId,
      recipientId,
    };
    const result = await dispatch(deleteMessageAsync(request));
    if (result.meta.requestStatus === 'fulfilled') {
      console.log(result);
    }
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
                  {self && (
                    <Paper className={styles.delete}>
                      <Tooltip title={language(lng.postDelete)}>
                        <IconButton
                          size="small"
                          color="warning"
                          onClick={() => handleDelete(id, userId, recipientId)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Paper>
                  )}
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
      <CommentInput value="" onSubmit={handleSend} placeholder={language(lng.chatsInputEmpty)} />
    </div>
  );
};