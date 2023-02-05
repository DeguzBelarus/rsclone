import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Toolbar,
  Tooltip,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { getIsAuthorized, getUserNickname, setIsAuthorized } from 'app/mainSlice';
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
  Person as PersonIcon,
} from '@mui/icons-material';
import { purple } from '@mui/material/colors';
import { Link, useNavigate } from 'react-router-dom';
import useLanguage from 'hooks/useLanguage';
import { lng } from 'hooks/useLanguage/types';
import { CustomMenu } from 'components/CustomMenu/CustomMenu';

export const Header = () => {
  const [userMenuAnchor, setUserMenuAnchor] = useState<HTMLElement>();
  const isAuthorized = useAppSelector(getIsAuthorized);
  const userName = useAppSelector(getUserNickname);
  const dispatch = useAppDispatch();
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
    dispatch(setIsAuthorized(false));
  }
  function handleMessages() {
    navigate('/messages');
  }
  function handleAddPost() {
    navigate('/posts/new');
  }

  const avatar = (size: string) => {
    return (
      <Avatar sx={{ width: size, height: size, bgcolor: purple[50], color: purple[300] }}>
        <PersonIcon sx={{ bgcolor: 'primary' }}></PersonIcon>
      </Avatar>
    );
  };

  const authorizedMenu = [
    <MenuItem key="1" sx={{ display: { sm: 'none' }, cursor: 'default', pointerEvents: 'none' }}>
      <ListItemIcon>{avatar('1.5em')}</ListItemIcon>
      <ListItemText>{userName}</ListItemText>
    </MenuItem>,
    <Divider key="2" sx={{ display: { sm: 'none' } }} />,
    <MenuItem key="3" onClick={handleMessages} sx={{ display: { sm: 'none' } }}>
      <ListItemIcon>
        <Badge badgeContent={4} color="warning">
          <MessageIcon />
        </Badge>
      </ListItemIcon>
      <ListItemText>{language(lng.userMessages)}</ListItemText>
    </MenuItem>,
    <MenuItem key="4" onClick={handleAddPost} sx={{ display: { sm: 'none' } }}>
      <ListItemIcon>
        <PostAdd />
      </ListItemIcon>
      <ListItemText>{language(lng.userAddPost)}</ListItemText>
    </MenuItem>,
    <MenuItem key="5" onClick={handleUserSettings}>
      <ListItemIcon>
        <SettingsIcon />
      </ListItemIcon>
      <ListItemText>{language(lng.settings)}</ListItemText>
    </MenuItem>,
    <Divider key="6" />,
    <MenuItem key="7" onClick={handleUserLogout}>
      <ListItemIcon>
        <LogoutIcon />
      </ListItemIcon>
      <ListItemText>{language(lng.logout)}</ListItemText>
    </MenuItem>,
  ];

  const unauthorizedMenu = [
    <MenuItem key="1" onClick={handleUserLogin}>
      <ListItemIcon>
        <LoginIcon />
      </ListItemIcon>
      <ListItemText>{language(lng.login)}</ListItemText>
    </MenuItem>,
    <MenuItem key="2" onClick={handleUserRegister}>
      <ListItemIcon>
        <RegisterIcon />
      </ListItemIcon>
      <ListItemText>{language(lng.register)}</ListItemText>
    </MenuItem>,
  ];

  return (
    <AppBar className={styles.header}>
      <Toolbar className={styles.toolbar}>
        <h1 className={styles.logo}>
          <Link to="/">RS Social</Link>
        </h1>
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

        <Button
          className={styles.userButton}
          color="inherit"
          onClick={handleUserMenuOpen}
          sx={{
            display: 'block',
            borderRadius: { xs: '50%', sm: '2em' },
            padding: { xs: '6px', sm: '6px 8px' },
          }}
        >
          {isAuthorized && userName && (
            <Box className={styles.nickname} sx={{ display: { xs: 'none', sm: 'flex' } }}>
              {userName}
            </Box>
          )}
          {avatar('2rem')}
        </Button>

        <CustomMenu
          anchorEl={userMenuAnchor}
          open={Boolean(userMenuAnchor)}
          onClick={handleUserMenuClose}
          onClose={handleUserMenuClose}
        >
          {isAuthorized ? authorizedMenu : unauthorizedMenu}
        </CustomMenu>
      </Toolbar>
    </AppBar>
  );
};
