import React, { FC, useEffect } from 'react';
import { useAppDispatch } from 'app/hooks';
import { Socket } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

import { useRoutes } from '../router/useRoutes';
import { authCheckUserAsync, setCurrentLanguage, setUsersOnline } from 'app/mainSlice';
import { getLocalStorageData } from 'app/storage';
import { Header } from './Header/Header';
import { Alert } from './Alert/Alert';

interface Props {
  socket: Socket<DefaultEventsMap, DefaultEventsMap>;
}

export const App: FC<Props> = ({ socket }): JSX.Element => {
  const dispatch = useAppDispatch();
  const routes: JSX.Element = useRoutes(socket);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('websocket connection has been established...');
    });
    socket.on('onlineUsersUpdate', (data: Array<string>) => {
      dispatch(setUsersOnline(data));
    });
  }, [socket]);

  useEffect(() => {
    const { token, currentLanguage } = getLocalStorageData();
    if (token) {
      dispatch(authCheckUserAsync(token));
    }
    if (currentLanguage) {
      dispatch(setCurrentLanguage(currentLanguage));
    }
  }, []);

  return (
    <>
      <Header socket={socket} />
      <main>{routes}</main>
      <Alert />
    </>
  );
};
