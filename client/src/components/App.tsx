import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Action, ThunkDispatch } from '@reduxjs/toolkit';
import { RootState } from '../app/store';
import { Socket } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

import { useRoutes } from '../router/useRoutes';
import { authCheckUserAsync, setCurrentLanguage } from 'app/mainSlice';
import { getLocalStorageData } from 'app/storage';
import { Header } from './Header/Header';
import { Alert } from './Alert/Alert';

interface Props {
  socket: Socket<DefaultEventsMap, DefaultEventsMap>;
}

export const App: FC<Props> = ({ socket }): JSX.Element => {
  const thunkDispatch = useDispatch<ThunkDispatch<RootState, unknown, Action<string>>>();

  const routes: JSX.Element = useRoutes();

  useEffect(() => {
    socket.on('connect', () => {
      console.log('websocket connection has been established...');
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
      <Header />
      <main>{routes}</main>
      <Alert />
    </>
  );
};
