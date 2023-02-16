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
  useTheme,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import {
  getCurrentColorTheme,
  getIsAuthorized,
  getUserId,
  getUserNickname,
  getUserRole,
  setAllPosts,
  setAvatarSrc,
  setCurrentColorTheme,
  setGuestUserData,
  setIsAuthorized,
  setIsLoginNotificationSent,
  setMessages,
  setPosts,
  setToken,
  setUserAge,
  setUserCity,
  setUserCountry,
  setUserEmail,
  setUserFirstName,
  setUserId,
  setUserLastName,
  setUserNickname,
  setUserRole,
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
  Dns as PostIcon,
  PostAdd,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import useLanguage from 'hooks/useLanguage';
import { lng } from 'hooks/useLanguage/types';
import { CustomMenu } from 'components/CustomMenu/CustomMenu';
import { USER_ROLE_ADMIN } from 'consts';
import Avatar from 'components/Avatar';
import { Socket } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { HeaderSearch } from 'components/HeaderSearch/HeaderSearch';
import combineClasses from 'lib/combineClasses';
import { EditPostModal } from 'components/EditPostModal/EditPostModal';
import { Logo } from 'components/Logo/Logo';
import DarkModeIcon from '@mui/icons-material/Brightness4';
import LightModeIcon from '@mui/icons-material/Brightness7';

interface Props {
  socket: Socket<DefaultEventsMap, DefaultEventsMap>;
}

export const Header: FC<Props> = ({ socket }) => {
  const [userMenuAnchor, setUserMenuAnchor] = useState<HTMLElement>();
  const [searchFocused, setSearchFocused] = useState(false);
  const [newPostModalOpen, setNewPostModalOpen] = useState(false);

  const isAuthorized = useAppSelector(getIsAuthorized);
  const userName = useAppSelector(getUserNickname);
  const userRole = useAppSelector(getUserRole);
  const userId = useAppSelector(getUserId);
  const dispatch = useAppDispatch();
  const currentTheme = useAppSelector(getCurrentColorTheme);
  const navigate = useNavigate();
  const language = useLanguage();
  const { palette } = useTheme();
  const role = isAuthorized ? userRole : undefined;

  const handleUserLogout = () => {
    dispatch(setIsAuthorized(false));
    dispatch(setToken(null));
    dispatch(setIsLoginNotificationSent(false));
    dispatch(setPosts([]));
    dispatch(setAllPosts([]));
    dispatch(setMessages([]));
    dispatch(setUserId(null));
    dispatch(setUserEmail(null));
    dispatch(setUserNickname(null));
    dispatch(setUserRole(null));
    dispatch(setUserAge(null));
    dispatch(setUserCountry(null));
    dispatch(setUserCity(null));
    dispatch(setUserFirstName(null));
    dispatch(setUserLastName(null));
    dispatch(setAvatarSrc(null));
    dispatch(setGuestUserData(null));

    socket.emit('userOffline', userName);
    navigate('/login');
  };

  const handleMessages = () => navigate('/messages');

  const handleAddPost = () => setNewPostModalOpen(true);

  const handlePosts = () => navigate('/posts');

  const handleDarkMode = () => {
    dispatch(setCurrentColorTheme(currentTheme === 'light' ? 'dark' : 'light'));
  };

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
    <MenuItem key="4" onClick={handlePosts} sx={{ display: { sm: 'none' } }}>
      <ListItemIcon>
        <PostIcon />
      </ListItemIcon>
      <ListItemText>{language(lng.userPosts)}</ListItemText>
    </MenuItem>,
    <MenuItem key="5" onClick={handleAddPost} sx={{ display: { sm: 'none' } }}>
      <ListItemIcon>
        <PostAdd />
      </ListItemIcon>
      <ListItemText>{language(lng.userAddPost)}</ListItemText>
    </MenuItem>,
    <MenuItem key="6" onClick={() => navigate('/settings')}>
      <ListItemIcon>
        <SettingsIcon />
      </ListItemIcon>
      <ListItemText>{language(lng.settings)}</ListItemText>
    </MenuItem>,
    <Divider key="7" />,
    <MenuItem key="8" onClick={handleUserLogout}>
      <ListItemIcon>
        <LogoutIcon />
      </ListItemIcon>
      <ListItemText>{language(lng.logout)}</ListItemText>
    </MenuItem>,
  ];

  const unauthorizedMenu = [
    <MenuItem key="1" onClick={() => navigate('/login')}>
      <ListItemIcon>
        <LoginIcon />
      </ListItemIcon>
      <ListItemText>{language(lng.login)}</ListItemText>
    </MenuItem>,
    <MenuItem key="2" onClick={() => navigate('/register')}>
      <ListItemIcon>
        <RegisterIcon />
      </ListItemIcon>
      <ListItemText>{language(lng.register)}</ListItemText>
    </MenuItem>,
  ];

  return (
    <AppBar
      className={combineClasses(
        styles.header,
        [styles.focused, searchFocused],
        [styles.authorized, isAuthorized]
      )}
      sx={{
        color: searchFocused ? palette.secondary.contrastText : undefined,
        backgroundColor: searchFocused ? palette.secondary.main : undefined,
        transition: 'background-color 0.5s linear',
      }}
    >
      <Toolbar className={styles.toolbar}>
        <Link to={userId === null ? '/' : `user/${userId}`}>
          <Logo />
        </Link>
        {isAuthorized && <HeaderSearch onFocusChange={(focused) => setSearchFocused(focused)} />}
        <LanguageSwitch className={styles.language} />

        <Tooltip title={language(currentTheme === 'dark' ? lng.lightMode : lng.darkMode)}>
          <IconButton className={styles.darkMode} color="inherit" onClick={handleDarkMode}>
            {currentTheme === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Tooltip>

        {isAuthorized && (
          <>
            <Tooltip title={language(lng.userAddPost)} sx={{ display: { xs: 'none', sm: 'flex' } }}>
              <IconButton color="inherit" onClick={handleAddPost}>
                <PostAdd />
              </IconButton>
            </Tooltip>
            <Tooltip
              title={`${language(lng.userPosts)}`}
              sx={{ display: { xs: 'none', sm: 'flex' } }}
            >
              <IconButton color="inherit" onClick={handlePosts}>
                <PostIcon />
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
          onClick={(event) => setUserMenuAnchor(event.currentTarget)}
          sx={{
            display: 'block',
            bgcolor: role === USER_ROLE_ADMIN ? palette.warning.main : undefined,
            color: palette.warning.contrastText,
            borderRadius: { xs: '50%', sm: '2em' },
            padding: '6px',
            '&:hover': {
              bgcolor: role === USER_ROLE_ADMIN ? palette.warning.dark : undefined,
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
          onClick={() => setUserMenuAnchor(undefined)}
          onClose={() => setUserMenuAnchor(undefined)}
        >
          {isAuthorized ? authorizedMenu : unauthorizedMenu}
        </CustomMenu>
      </Toolbar>
      <EditPostModal open={newPostModalOpen} onClose={() => setNewPostModalOpen(false)} />
    </AppBar>
  );
};
