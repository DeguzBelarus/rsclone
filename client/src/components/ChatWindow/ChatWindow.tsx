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
  getOneUserInfoAsync,
  setCurrentDialogMessages,
} from 'app/mainSlice';
import Avatar from 'components/Avatar/Avatar';
import { CommentInput } from 'components/CommentInput/CommentInput';
import { PostDate } from 'components/PostDate/PostDate';
import useLanguage from 'hooks/useLanguage';
import { lng } from 'hooks/useLanguage/types';
import combineClasses from 'lib/combineClasses';
import React, { useEffect, useRef, useState } from 'react';
import { Socket } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import {
  IDeleteMessageRequest,
  IGetDialogMessagesRequest,
  IGetOneUserRequestData,
  IMessageModel,
  ISendMessageRequest,
} from 'types/types';
import styles from './ChatWindow.module.scss';
import DeleteIcon from '@mui/icons-material/DeleteForever';
import CheckIcon from '@mui/icons-material/OfflinePin';
import { Spinner } from 'components/Spinner/Spinner';
import { decodeMessage, encodeMessage } from 'lib/codeMessage';

interface ChatWindowProps {
  recipientId?: number;
  recipientNickname?: string;
  collapsed?: boolean;
  onCancel?: () => void;
  socket: Socket<DefaultEventsMap, DefaultEventsMap>;
}

export const ChatWindow = ({
  recipientId,
  recipientNickname,
  collapsed,
  onCancel,
  socket,
}: ChatWindowProps) => {
  const { palette } = useTheme();
  const language = useLanguage();
  const dispatch = useAppDispatch();
  const lang = useAppSelector(getCurrentLanguage);
  const token = useAppSelector(getToken);
  const authorId = useAppSelector(getUserId);
  const authorNickname = useAppSelector(getUserNickname);
  const messages: IMessageModel[] | null = useAppSelector(getCurrentDialogMessages);

  const [isLoading, setIsLoading] = useState(false);
  const [isUserDataUpdated, setIsUserDataUpdated] = useState(false);
  const messagesRef = useRef<HTMLUListElement>(null);

  const handleSend = async (messageText: string) => {
    if (!token || !authorId || !authorNickname || !recipientId || !recipientNickname) return;

    const request: ISendMessageRequest = {
      lang,
      token,
      requestData: {
        authorId,
        authorNickname,
        recipientId,
        recipientNickname,
        messageText: encodeMessage(messageText),
      },
    };
    await dispatch(sendMessageAsync(request));
    socket.emit('userSendMessage', { authorId, recipientId, authorNickname, recipientNickname });
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
    socket.emit('userDeleteMessage', { authorId, recipientId, authorNickname, recipientNickname });
    if (result.meta.requestStatus === 'fulfilled') {
      console.log(result);
    }
  };

  useEffect(() => {
    if (!token || !authorId || !recipientId) return;
    setIsLoading(true);
    const request: IGetDialogMessagesRequest = {
      lang,
      token,
      userId: authorId,
      interlocutorId: recipientId,
    };
    dispatch(getDialogMessagesAsync(request));
  }, [recipientId, authorId, dispatch, lang, token]);

  useEffect(() => {
    setIsLoading(false);

    if (!isUserDataUpdated && authorId && messages?.length) {
      if (token && authorId) {
        const request: IGetOneUserRequestData = {
          token,
          requestData: {
            id: authorId,
            lang,
          },
        };
        dispatch(getOneUserInfoAsync(request));
        setIsUserDataUpdated(true);
      }
    }
  }, [messages]);

  useEffect(() => {
    const messagesDiv = messagesRef.current;
    if (messagesDiv) {
      messagesDiv.scrollTo({ top: messagesDiv.scrollHeight });
    }
  }, [messages, isLoading, messagesRef]);

  useEffect(() => {
    return () => {
      dispatch(setCurrentDialogMessages([]));
    };
  }, []);
  return (
    <div className={combineClasses(styles.wrapper, [styles.collapsed, collapsed])}>
      <div className={styles.messages}>
        {messages && !isLoading ? (
          <ul className={styles.messages} ref={messagesRef}>
            {messages.map(
              ({ id, messageText, userId, authorNickname, authorAvatarSrc, date, isRead }) => {
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
                      <div className={styles.messageBody}>{decodeMessage(messageText)}</div>
                      {self && isRead && (
                        <Tooltip title={language(lng.messageIsRead)}>
                          <CheckIcon fontSize="small" color="success" className={styles.read} />
                        </Tooltip>
                      )}
                    </div>
                  </li>
                );
              }
            )}
          </ul>
        ) : (
          <Spinner size={42} />
        )}
      </div>
      <CommentInput
        value=""
        autoFocus
        placeholder={language(lng.chatsInputEmpty)}
        onSubmit={handleSend}
        onCancel={onCancel}
      />
    </div>
  );
};
