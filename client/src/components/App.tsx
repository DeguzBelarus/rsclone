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
  const { currentTheme: currentThemeSaved } = getLocalStorageData();
  const [theme, setTheme] = useState(createTheme({ palette: { mode: currentThemeSaved } }));

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
    </ThemeProvider>
  );
};
