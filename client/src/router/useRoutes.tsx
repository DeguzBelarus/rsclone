import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { RegisterPage } from 'pages/RegisterPage/RegisterPage';
import { Page404 } from 'pages/Page404/Page404';
import { UserRoom } from 'pages/UserRoom/UserRoom';
import { UserSettings } from '../pages/UserSettings/UserSettings';
import { PostPage } from 'pages/PostPage/PostPage';
import { AuthPage } from 'pages/AuthPage/AuthPage';
import { Socket } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { useAppSelector } from 'app/hooks';
import { getIsAuthorized } from 'app/mainSlice';

export const useRoutes = (socket: Socket<DefaultEventsMap, DefaultEventsMap>) => {
  const isAuthorized = useAppSelector(getIsAuthorized);

  return (
    <Routes>
      {isAuthorized ? (
        <>
          <Route path="/" element={<UserRoom socket={socket} />} />
          <Route path="user/:id" element={<UserRoom socket={socket} />} />
          <Route path="settings" element={<UserSettings />} />
          <Route path="post/:id" element={<PostPage />} />
          <Route path="*" element={<Page404 />} />
        </>
      ) : (
        <>
          <Route path="register" element={<RegisterPage />} />
          <Route path="*" element={<AuthPage />} />
        </>
      )}
    </Routes>
  );
};
