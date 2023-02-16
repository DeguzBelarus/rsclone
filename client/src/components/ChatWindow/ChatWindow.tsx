import { alpha, useTheme } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import {
  getCurrentDialogMessages,
  getCurrentLanguage,
  getDialogMessagesAsync,
  getMessages,
  getToken,
  getUserId,
  getUserNickname,
  sendMessageAsync,
} from 'app/mainSlice';
import { CommentInput } from 'components/CommentInput/CommentInput';
import React, { useEffect } from 'react';
import { IGetDialogMessagesRequest, ISendMessageRequest } from 'types/types';
import styles from './ChatWindow.module.scss';

interface ChatWindowProps {
  recipientId?: number;
  recipientNickname?: string;
  onEdit?: () => void;
}

const sampleMessages = [
  'Alice: Hey Bob, how are you doing?',
  "Bob: Hey Alice, I'm doing pretty well. How about you?",
  "Alice: I'm good too, thanks. Did you finish that project we were working on?",
  'Bob: Not yet, but I should have it done by the end of the day.',
  'Alice: Great! Let me know if you need any help with it.',
  'Bob: Will do. Thanks!',
];

export const ChatWindow = ({ recipientId, recipientNickname }: ChatWindowProps) => {
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
  }, [recipientId, authorId]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.messages}>
        {messages && (
          <ul className={styles.messages}>
            {messages.map(({ id, messageText }) => (
              <li
                key={id}
                className={styles.message}
                style={{ backgroundColor: alpha(palette.primary.main, 0.15) }}
              >
                {messageText}
              </li>
            ))}
          </ul>
        )}
      </div>
      <CommentInput value="" onSubmit={handleSend} />
    </div>
  );
};
