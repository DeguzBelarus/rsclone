import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Action, ThunkDispatch } from '@reduxjs/toolkit';
import { RootState } from '../app/store';
import { Socket } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

import { useRoutes } from '../router/useRoutes';
import { authCheckUserAsync } from 'app/mainSlice';
import { ILocalStorageSaveData, Nullable } from 'types/types';

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
    const save: Nullable<string> = localStorage.getItem('rsclone-save');
    if (save) {
      const saveData: ILocalStorageSaveData = JSON.parse(save);
      if (saveData.token) {
        thunkDispatch(authCheckUserAsync(saveData.token));
      }
    }
  }, []);

  return <>{routes}</>;
};
