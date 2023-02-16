import React, { FC, useEffect } from 'react';
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
} from 'app/mainSlice';
import { getLocalStorageData } from 'app/storage';
import { Header } from './Header/Header';
import { Alert } from './Alert/Alert';
import { Footer } from './Footer/Footer';
import { createTheme, ThemeProvider } from '@mui/material';

interface Props {
  socket: Socket<DefaultEventsMap, DefaultEventsMap>;
}

export const App: FC<Props> = ({ socket }): JSX.Element => {
  const dispatch = useAppDispatch();
  const routes = useRoutes(socket);

  const currentLanguageFromStore = useAppSelector(getCurrentLanguage);
  const currentTheme = useAppSelector(getCurrentColorTheme);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('websocket connection has been established...');
    });
    socket.on('onlineUsersUpdate', (data: Array<string>) => {
      dispatch(setUsersOnline(data));
    });
  }, [socket, dispatch]);

  useEffect(() => {
    const { token, currentLanguage } = getLocalStorageData();
    if (token) {
      dispatch(authCheckUserAsync({ token, lang: currentLanguageFromStore }));
    }
    if (currentLanguage) {
      dispatch(setCurrentLanguage(currentLanguage));
    }
  }, [dispatch]);

  return (
    <ThemeProvider theme={createTheme({ palette: { mode: currentTheme } })}>
      <Header socket={socket} />
      <main>{routes}</main>
      <Alert />
      <Footer />
    </ThemeProvider>
  );
};
