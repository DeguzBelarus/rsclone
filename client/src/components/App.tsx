import React, { FC, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

import { useRoutes } from '../router/useRoutes';

interface Props {
  socket: Socket<DefaultEventsMap, DefaultEventsMap>;
}

export const App: FC<Props> = ({ socket }): JSX.Element => {
  const routes: JSX.Element = useRoutes();

  useEffect(() => {
    socket.on('connect', () => {
      console.log('websocket connection has been established...');
    });
  }, [socket]);

  return <>{routes}</>;
};
