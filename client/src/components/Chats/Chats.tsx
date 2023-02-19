import {
  alpha,
  Badge,
  Button,
  IconButton,
  Paper,
  Tooltip,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import {
  getActiveChatId,
  getChats,
  getDialogs,
  getIsAuthorized,
  setActiveChatId,
  setChats,
} from 'app/mainSlice';
import Avatar from 'components/Avatar';
import React, { useEffect, useState, FC } from 'react';
import DeleteIcon from '@mui/icons-material/HighlightOffRounded';
import CollapseIcon from '@mui/icons-material/ExpandCircleDown';
import { Socket } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

import styles from './Chats.module.scss';
import { ChatWindow } from 'components/ChatWindow/ChatWindow';
import combineClasses from 'lib/combineClasses';
import { lng } from 'hooks/useLanguage/types';
import useLanguage from 'hooks/useLanguage';
import { getLocalStorageData, setLocalStorageData } from 'app/storage';

interface Props {
  socket: Socket<DefaultEventsMap, DefaultEventsMap>;
}

export const Chats: FC<Props> = ({ socket }) => {
  const isAuthorized = useAppSelector(getIsAuthorized);
  const chats = useAppSelector(getChats);
  const activeChatId = useAppSelector(getActiveChatId);
  const activeChat = chats.find(({ partnerId }) => partnerId === activeChatId);
  const dialogs = useAppSelector(getDialogs);

  const language = useLanguage();
  const dispatch = useAppDispatch();
  const { palette } = useTheme();

  const [collapsed, setCollapsed] = useState(getLocalStorageData()?.chatsCollapsed === true);
  const [windowCollapsed, setWindowCollapsed] = useState(false);

  const mobile = useMediaQuery('(max-width: 600px)');

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
      if (id === activeChatId) {
        setWindowCollapsed((current) => !current);
      } else {
        dispatch(setActiveChatId(id));
        setWindowCollapsed(false);
      }
    } else {
      dispatch(setActiveChatId(null));
    }
  };

  const getUnreadCount = (partnerId?: number) => {
    const dialog = dialogs.find(
      ({ authorId, recipientId }) => partnerId === authorId || partnerId == recipientId
    );
    return dialog?.unreadMessages || 0;
  };

  useEffect(() => {
    if (activeChatId !== null) {
      setCollapsed(false);
      setWindowCollapsed(false);
    }
  }, [activeChatId]);

  useEffect(() => {
    if (!collapsed) setWindowCollapsed(false);
    setLocalStorageData({ chatsCollapsed: collapsed });
  }, [collapsed]);

  return isAuthorized && chats.length > 0 ? (
    <div className={combineClasses(styles.wrapper, [styles.collapsed, collapsed])}>
      {activeChat && (
        <Paper
          className={combineClasses(styles.window, [styles.windowCollapsed, windowCollapsed])}
          elevation={6}
        >
          <Tooltip title={language(windowCollapsed ? lng.expand : lng.collapse)}>
            <h4
              className={styles.heading}
              onClick={() => setWindowCollapsed((current) => !current)}
            >{`${language(lng.chatWith)} ${activeChat?.partnerNickname}`}</h4>
          </Tooltip>
          <div className={styles.windowButtons}>
            <Tooltip title={language(windowCollapsed ? lng.expand : lng.collapse)}>
              <IconButton
                className={styles.collapseBtn}
                color="success"
                onClick={() => setWindowCollapsed((current) => !current)}
              >
                <CollapseIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title={language(lng.close)}>
              <IconButton color="warning" onClick={() => handleSetActiveChat(undefined)}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </div>
          <ChatWindow
            socket={socket}
            collapsed={windowCollapsed}
            recipientId={activeChat?.partnerId}
            recipientNickname={activeChat?.partnerNickname}
            onCancel={() => setWindowCollapsed(true)}
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
          <Tooltip title={language(collapsed ? lng.expand : lng.collapse)}>
            <Button variant="text" size="small" onClick={() => setCollapsed((current) => !current)}>
              {language(lng.chats)}
              <CollapseIcon className={styles.collapseBtn} fontSize="small" sx={{ ml: 1 }} />
            </Button>
          </Tooltip>
        </h4>
        <ul className={styles.people}>
          {chats.map(({ partnerId, partnerNickname, partnerAvatar }) => (
            <li key={partnerId}>
              <Tooltip
                title={`${language(lng.chatWith)} ${partnerNickname}`}
                placement={mobile ? 'bottom' : 'left'}
                style={{ width: 'max-content' }}
              >
                <div
                  className={combineClasses(styles.person, [
                    styles.active,
                    partnerId === activeChat?.partnerId,
                  ])}
                >
                  <Badge
                    badgeContent={getUnreadCount(partnerId)}
                    color="warning"
                    sx={{
                      '& .MuiBadge-badge': {
                        right: '90%',
                        top: '20%',
                      },
                    }}
                  >
                    <Avatar
                      className={styles.avatar}
                      size="clamp(2.5rem, 10vw, 4rem)"
                      user={partnerId}
                      avatarSrc={partnerAvatar}
                      onClick={() => handleSetActiveChat(partnerId)}
                    />
                  </Badge>
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
