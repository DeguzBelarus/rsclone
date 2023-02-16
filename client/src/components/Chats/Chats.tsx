import { alpha, ClickAwayListener, IconButton, Paper, Tooltip, useTheme } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import {
  getActiveChatId,
  getChats,
  getIsAuthorized,
  setActiveChatId,
  setChats,
} from 'app/mainSlice';
import Avatar from 'components/Avatar';
import React, { useState } from 'react';
import DeleteIcon from '@mui/icons-material/HighlightOffRounded';
import CollapseIcon from '@mui/icons-material/ExpandCircleDown';

import styles from './Chats.module.scss';
import { ChatWindow } from 'components/ChatWindow/ChatWindow';
import combineClasses from 'lib/combineClasses';
import { lng } from 'hooks/useLanguage/types';
import useLanguage from 'hooks/useLanguage';

interface ChatsProps {
  someprop?: string;
}

export const Chats = ({}: ChatsProps) => {
  const isAuthorized = useAppSelector(getIsAuthorized);
  const chats = useAppSelector(getChats);
  const activeChatId = useAppSelector(getActiveChatId);
  const activeChat = chats.find(({ partnerId }) => partnerId === activeChatId);

  const language = useLanguage();
  const dispatch = useAppDispatch();
  const { palette } = useTheme();

  const [collapsed, setCollapsed] = useState(false);

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
    if (id) {
      dispatch(setActiveChatId(id));
      setCollapsed(false);
    } else {
      dispatch(setActiveChatId(null));
    }
  };

  return isAuthorized && chats.length > 0 ? (
    <ClickAwayListener onClickAway={() => setCollapsed(true)}>
      <div className={styles.wrapper}>
        {activeChat && (
          <Paper
            className={combineClasses(styles.window, [styles.collapsed, collapsed])}
            elevation={6}
          >
            <h4 className={styles.heading}>{`${language(lng.chatWith)} ${
              activeChat?.partnerNickname
            }`}</h4>
            <div className={styles.windowButtons}>
              <Tooltip title={language(lng.close)}>
                <IconButton
                  className={styles.collapse}
                  color="success"
                  onClick={() => setCollapsed((current) => !current)}
                >
                  <CollapseIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title={language(lng.close)}>
                <IconButton color="warning">
                  <DeleteIcon fontSize="small" onClick={() => handleSetActiveChat(undefined)} />
                </IconButton>
              </Tooltip>
            </div>
            <ChatWindow
              collapsed={collapsed}
              recipientId={activeChat?.partnerId}
              recipientNickname={activeChat?.partnerNickname}
            />
          </Paper>
        )}

        <div className={styles.side}>
          <h4
            className={styles.heading}
            style={{
              backgroundColor: alpha(palette.background.paper, 0.7),
              color: palette.text.secondary,
            }}
          >
            {language(lng.chats)}
          </h4>
          <ul className={styles.people}>
            {chats.map(({ partnerId, partnerNickname, partnerAvatar }) => (
              <li key={partnerId}>
                <Tooltip
                  title={`${language(lng.chatWith)} ${partnerNickname}`}
                  placement="left"
                  style={{ width: 'max-content' }}
                >
                  <div
                    className={combineClasses(styles.person, [
                      styles.active,
                      partnerId === activeChat?.partnerId,
                    ])}
                  >
                    <Avatar
                      className={styles.avatar}
                      size="clamp(2.5rem, 10vw, 4rem)"
                      user={partnerId}
                      avatarSrc={partnerAvatar}
                      onClick={() => handleSetActiveChat(partnerId)}
                    />
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
    </ClickAwayListener>
  ) : (
    <></>
  );
};
