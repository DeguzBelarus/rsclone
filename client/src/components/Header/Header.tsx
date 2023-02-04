import {
  AppBar,
  Avatar,
  Badge,
  Button,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
} from '@mui/material';
import { useAppSelector } from 'app/hooks';
import { getIsAuthorized, getUserNickname } from 'app/mainSlice';
import { LanguageSwitch } from 'components/LanguageSwitch';
import React, { useState } from 'react';
import styles from './Header.module.scss';
import {
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Login as LoginIcon,
  PersonAdd as RegisterIcon,
  Message as MessageIcon,
  PostAdd,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import useLanguage from 'hooks/useLanguage';
import { lng } from 'hooks/useLanguage/types';

export const Header = () => {
  const [userMenuAnchor, setUserMenuAnchor] = useState<HTMLElement>();
  const isAuthorized = useAppSelector(getIsAuthorized);
  const userName = useAppSelector(getUserNickname);
  const navigate = useNavigate();
  const language = useLanguage();

  function handleUserMenuOpen(event: React.MouseEvent<HTMLElement>) {
    setUserMenuAnchor(event.currentTarget);
  }
  function handleUserMenuClose() {
    setUserMenuAnchor(undefined);
  }
  function handleUserSettings() {
    navigate('/settings');
  }
  function handleUserLogin() {
    navigate('/login');
  }
  function handleUserRegister() {
    navigate('/register');
  }
  function handleUserLogout() {
    console.log('logout');
  }
  function handleMessages() {
    console.log('messages');
  }
  function handleAddPost() {
    console.log('add post');
  }

  return (
    <AppBar className={styles.header}>
      <Toolbar className={styles.toolbar}>
        <h1 className={styles.logo}>RS Social</h1>
        <LanguageSwitch />

        {isAuthorized && (
          <>
            <Tooltip title={language(lng.userAddPost)} sx={{ display: { xs: 'none', sm: 'flex' } }}>
              <IconButton color="inherit" onClick={handleAddPost}>
                <PostAdd />
              </IconButton>
            </Tooltip>
            <Tooltip
              title={`${language(lng.userMessages)} (4)`}
              sx={{ display: { xs: 'none', sm: 'flex' } }}
            >
              <IconButton color="inherit" onClick={handleMessages}>
                <Badge badgeContent={4} color="warning">
                  <MessageIcon />
                </Badge>
              </IconButton>
            </Tooltip>
          </>
        )}

        <Button className={styles.userButton} color="inherit" onClick={handleUserMenuOpen}>
          {userName && <span className={styles.nickname}>{userName}</span>}
          <Avatar />
        </Button>
        {isAuthorized ? (
          <Menu
            anchorEl={userMenuAnchor}
            open={Boolean(userMenuAnchor)}
            onClick={handleUserMenuClose}
            onClose={handleUserMenuClose}
          >
            <MenuItem onClick={handleMessages} sx={{ display: { sm: 'none' } }}>
              <ListItemIcon>
                <Badge badgeContent={4} color="warning">
                  <MessageIcon />
                </Badge>
              </ListItemIcon>
              <ListItemText>{language(lng.userMessages)}</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleAddPost} sx={{ display: { sm: 'none' } }}>
              <ListItemIcon>
                <PostAdd />
              </ListItemIcon>
              <ListItemText>{language(lng.userAddPost)}</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleUserSettings}>
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText>{language(lng.settings)}</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleUserLogout}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText>{language(lng.logout)}</ListItemText>
            </MenuItem>
          </Menu>
        ) : (
          <Menu
            anchorEl={userMenuAnchor}
            open={Boolean(userMenuAnchor)}
            onClick={handleUserMenuClose}
            onClose={handleUserMenuClose}
          >
            <MenuItem onClick={handleUserLogin}>
              <ListItemIcon>
                <LoginIcon />
              </ListItemIcon>
              <ListItemText>{language(lng.login)}</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleUserRegister}>
              <ListItemIcon>
                <RegisterIcon />
              </ListItemIcon>
              <ListItemText>{language(lng.register)}</ListItemText>
            </MenuItem>
          </Menu>
        )}
      </Toolbar>
    </AppBar>
  );
};
