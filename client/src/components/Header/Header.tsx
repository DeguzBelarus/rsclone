import {
  AppBar,
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
import {
  getIsAuthorized,
  getUserNickname,
  getUserRole,
  setIsAuthorized,
  setToken,
} from 'app/mainSlice';
import { LanguageSwitch } from 'components/LanguageSwitch';
import React, { useState, FC } from 'react';
import styles from './Header.module.scss';
import {
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Login as LoginIcon,
  PersonAdd as RegisterIcon,
  Message as MessageIcon,
  PostAdd,
} from '@mui/icons-material';
import { blue, amber } from '@mui/material/colors';
import { Link, useNavigate } from 'react-router-dom';
import useLanguage from 'hooks/useLanguage';
import { lng } from 'hooks/useLanguage/types';
import { CustomMenu } from 'components/CustomMenu/CustomMenu';
import { USER_ROLE_ADMIN } from 'consts';
import Avatar from 'components/Avatar';
import { Socket } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

interface Props {
  socket: Socket<DefaultEventsMap, DefaultEventsMap>;
}

export const Header: FC<Props> = (socket) => {
  const [userMenuAnchor, setUserMenuAnchor] = useState<HTMLElement>();
  const isAuthorized = useAppSelector(getIsAuthorized);
  const userName = useAppSelector(getUserNickname);
  const userRole = useAppSelector(getUserRole);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const language = useLanguage();

  const role = isAuthorized ? userRole : undefined;

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
    dispatch(setToken(null));
    socket.socket.emit('userOffline', userName);
  }
  function handleMessages() {
    navigate('/messages');
  }
  function handleAddPost() {
    navigate('/posts/new');
  }

  const authorizedMenu = [
    <MenuItem key="1" sx={{ display: { sm: 'none' }, cursor: 'default', pointerEvents: 'none' }}>
      <ListItemIcon>
        <Avatar size="1.5em" />
      </ListItemIcon>
      <ListItemText>
        {userName}
        {role === USER_ROLE_ADMIN && (
          <span style={{ opacity: 0.6, fontSize: '0.8em' }}> (admin)</span>
        )}
      </ListItemText>
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
          variant="outlined"
          onClick={handleUserMenuOpen}
          sx={{
            display: 'block',
            bgcolor: role === USER_ROLE_ADMIN ? amber[700] : undefined,
            color: blue[50],
            borderRadius: { xs: '50%', sm: '2em' },
            padding: '6px',
            '&:hover': {
              bgcolor: role === USER_ROLE_ADMIN ? amber[800] : undefined,
            },
          }}
        >
          {isAuthorized && userName && (
            <Box className={styles.nickname} sx={{ display: { xs: 'none', sm: 'flex' } }}>
              {userName}
            </Box>
          )}
          <Avatar size="2rem" />
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
