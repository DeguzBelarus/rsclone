import { alpha, Button, ButtonGroup, IconButton, Paper, Tooltip, useTheme } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import {
  getActiveChatId,
  getChats,
  getIsAuthorized,
  setActiveChatId,
  setChats,
} from 'app/mainSlice';
import Avatar from 'components/Avatar';
import React from 'react';
import DeleteIcon from '@mui/icons-material/HighlightOffRounded';

import styles from './Chats.module.scss';
import { CommentInput } from 'components/CommentInput/CommentInput';
import { ChatWindow } from 'components/ChatWindow/ChatWindow';
import combineClasses from 'lib/combineClasses';

interface ChatsProps {
  someprop?: string;
}

export const Chats = ({}: ChatsProps) => {
  const isAuthorized = useAppSelector(getIsAuthorized);
  const chats = useAppSelector(getChats);
  const activeChatId = useAppSelector(getActiveChatId);
  const activeChat = chats.find(({ partnerId }) => partnerId === activeChatId);

  const dispatch = useAppDispatch();
  const { palette } = useTheme();

  const handleDeleteChat = (userId?: number) => {
    const chatIndex = chats.findIndex(({ partnerId }) => partnerId === userId);
    const newChats = [...chats];
    newChats.splice(chatIndex, 1);
    if (chatIndex >= 0) {
      dispatch(setChats(newChats));
    }
    dispatch(setActiveChatId(null));
  };

  const handleSetActiveChat = (id?: number) => {
    if (id) dispatch(setActiveChatId(id));
  };

  return isAuthorized && chats.length > 0 ? (
    <div className={styles.wrapper}>
      <Paper className={styles.window} elevation={6}>
        <h4 className={styles.heading}>Chat with {activeChat?.partnerNickname}</h4>
        <ChatWindow
          recipientId={activeChat?.partnerId}
          recipientNickname={activeChat?.partnerNickname}
        />
      </Paper>

      <div
        className={styles.side}
        style={{
          backgroundColor: alpha(palette.background.paper, 0.7),
          color: palette.text.secondary,
        }}
      >
        <h4 className={styles.heading}>Chats</h4>
        <ul className={styles.people}>
          {chats.map(({ partnerId, partnerNickname, partnerAvatar }) => (
            <li key={partnerId}>
              <Tooltip
                title={`Chat with ${partnerNickname}`}
                placement="left"
                style={{ width: 'max-content' }}
              >
                <div
                  className={combineClasses(styles.person, [
                    styles.active,
                    partnerId === activeChat?.partnerId,
                  ])}
                >
                  <div className={styles.avatar} onClick={() => handleSetActiveChat(partnerId)}>
                    <Avatar size="4rem" user={partnerId} avatarSrc={partnerAvatar} />
                  </div>
                  <IconButton
                    className={styles.delete}
                    color="warning"
                    onClick={() => handleDeleteChat(partnerId)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </div>
              </Tooltip>
            </li>
          ))}
        </ul>
      </div>
    </div>
  ) : (
    <></>
  );
};
