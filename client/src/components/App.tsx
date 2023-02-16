import React, { FC, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { Socket } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

import { useRoutes } from '../router/useRoutes';
import {
  authCheckUserAsync,
  setCurrentLanguage,
  setUsersOnline,
  getCurrentLanguage,
  getCurrentColorTheme,
  setCurrentColorTheme,
  getUserId,
  getOneUserInfoAsync,
  getToken,
  getGuestUserData,
  getAllPosts,
  getAllPostsAsync,
} from 'app/mainSlice';
import { getLocalStorageData } from 'app/storage';
import { Header } from './Header/Header';
import { Alert } from './Alert/Alert';
import { Footer } from './Footer/Footer';
import { createTheme, ThemeProvider } from '@mui/material';
import { IUserDataPostEvent } from 'types/types';
import { Chats } from './Chats/Chats';

interface Props {
  socket: Socket<DefaultEventsMap, DefaultEventsMap>;
}

export const App: FC<Props> = ({ socket }): JSX.Element => {
  const dispatch = useAppDispatch();
  const routes = useRoutes(socket);
  const { currentTheme: currentThemeSaved } = getLocalStorageData();
  const [theme, setTheme] = useState(createTheme({ palette: { mode: currentThemeSaved } }));

  const currentLanguageFromStore = useAppSelector(getCurrentLanguage);
  const userId = useAppSelector(getUserId);
  const token = useAppSelector(getToken);
  const guestUserData = useAppSelector(getGuestUserData);
  const allPosts = useAppSelector(getAllPosts);
  const currentTheme = useAppSelector(getCurrentColorTheme);

  const postsDataRefresh = (data: IUserDataPostEvent) => {
    if (userId && token) {
      if (userId === data.userId) {
        dispatch(
          getOneUserInfoAsync({
            token,
            requestData: { lang: currentLanguageFromStore, id: userId },
          })
        );
      } else {
        if (guestUserData) {
          if (guestUserData.id === data.userId) {
            dispatch(
              getOneUserInfoAsync({
                token,
                requestData: { lang: currentLanguageFromStore, id: data.userId },
              })
            );
          }
        }
      }
      if (allPosts) {
        dispatch(getAllPostsAsync({ lang: currentLanguageFromStore }));
      }
    }
  };

  useEffect(() => {
    const { token, currentLanguage, currentTheme } = getLocalStorageData();

    if (token) {
      dispatch(authCheckUserAsync({ token, lang: currentLanguageFromStore }));
    }
    if (currentLanguage) {
      dispatch(setCurrentLanguage(currentLanguage));
    }
    if (currentTheme) {
      dispatch(setCurrentColorTheme(currentTheme));
    }
  }, [dispatch]);

  useEffect(() => {
    setTheme(createTheme({ palette: { mode: currentTheme } }));
  }, [currentTheme]);

  useEffect(() => {
    // create post socket event
    socket.on('userAddedPost', (data: IUserDataPostEvent) => {
      postsDataRefresh(data);
    });
    // delete post socket event
    socket.on('userDeletedPost', (data: IUserDataPostEvent) => {
      postsDataRefresh(data);
    });

    return () => {
      socket.off('userAddedPost');
      socket.off('userDeletedPost');
    };
  }, [userId, guestUserData, allPosts]);

  useEffect(() => {
    // connection socket events
    socket.on('connect', () => {
      console.log('websocket connection has been established...');
    });

    // user info updating socket events
    socket.on('onlineUsersUpdate', (data: Array<string>) => {
      dispatch(setUsersOnline(data));
    });
  }, [socket]);

  return (
    <ThemeProvider theme={theme}>
      <Header socket={socket} />
      <main
        style={{
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.background.default,
        }}
      >
        {routes}
      </main>
      <Alert />
      <Footer />
      <Chats />
    </ThemeProvider>
  );
};
