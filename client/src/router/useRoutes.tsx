import React from 'react';
import { useAppSelector } from 'app/hooks';

import { getUserId } from 'app/mainSlice';
import { Navigate, Route, Routes } from 'react-router-dom';
import { RegisterPage } from 'pages/RegisterPage/RegisterPage';
import { Page404 } from 'pages/Page404/Page404';
import { UserRoom } from 'pages/UserRoom/UserRoom';
import { UserSettings } from '../pages/UserSettings/UserSettings';
import { PostPage } from 'pages/PostPage/PostPage';
import { PrivateRoutes } from 'components/PrivateRoutes';
import { PublicRoutes } from 'components/PublicRoutes';
import { AuthPage } from 'pages/AuthPage/AuthPage';
import { Nullable } from 'types/types';
import { Socket } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

export const useRoutes = (socket: Socket<DefaultEventsMap, DefaultEventsMap>): JSX.Element => {
  const userId = useAppSelector<Nullable<number>>(getUserId);

  return (
    <Routes>
      <Route element={<PrivateRoutes />}>
        <Route path="/" element={<Navigate to={`/${userId}`} />} />
        <Route path="/:id" element={<UserRoom socket={socket} />} />
        <Route path="settings" element={<UserSettings />} />
        <Route path="post/:id" element={<PostPage />} />
      </Route>

      <Route element={<PublicRoutes />}>
        <Route path="login" element={<AuthPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>
      <Route path="*" element={<Page404 />} />
    </Routes>
  );
};
