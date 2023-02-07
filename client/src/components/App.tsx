import React, { FC, useEffect } from 'react';
import { useAppDispatch } from 'app/hooks';
import { useDispatch } from 'react-redux';
import { Action, ThunkDispatch } from '@reduxjs/toolkit';
import { RootState } from '../app/store';
import { Socket } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

import { useRoutes } from '../router/useRoutes';
import { authCheckUserAsync, setCurrentLanguage, setUsersOnline } from 'app/mainSlice';
import { getLocalStorageData } from 'app/storage';
import { Header } from './Header/Header';
import { Alert } from './Alert/Alert';
import { Footer } from './Footer/Footer';

interface Props {
  socket: Socket<DefaultEventsMap, DefaultEventsMap>;
}

export const App: FC<Props> = ({ socket }): JSX.Element => {
  const dispatch = useAppDispatch();
  const thunkDispatch = useDispatch<ThunkDispatch<RootState, unknown, Action<string>>>();

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
      thunkDispatch(authCheckUserAsync(token));
    }
    if (currentLanguage) {
      thunkDispatch(setCurrentLanguage(currentLanguage));
    }
  }, [thunkDispatch]);

  return (
    <>
      <Header socket={socket} />
      <main>{routes}</main>
      <Alert />
      <Footer />
    </>
  );
};
