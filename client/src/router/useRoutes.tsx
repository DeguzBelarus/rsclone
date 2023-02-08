import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { RegisterPage } from 'pages/RegisterPage/RegisterPage';
import { ProcessingPage } from 'pages/ProcessingPage/ProcessingPage';
import { Page404 } from 'pages/Page404/Page404';
import { UserRoom } from 'pages/UserRoom/UserRoom';
import { UserSettings } from '../pages/UserSettings/UserSettings';
import { PostPage } from 'pages/PostPage/PostPage';
import { AuthPage } from 'pages/AuthPage/AuthPage';
import { Socket } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { useAppSelector } from 'app/hooks';
import { getIsAuthorized, getUserId, getUserRequestStatus } from 'app/mainSlice';

export const useRoutes = (socket: Socket<DefaultEventsMap, DefaultEventsMap>) => {
  const isAuthorized = useAppSelector(getIsAuthorized);
  const userRequestStatus = useAppSelector(getUserRequestStatus);

  const userId = useAppSelector(getUserId);

  return (
    <Routes>
      {isAuthorized ? (
        <>
          <Route path="/" element={<Navigate to={`/user/${userId}`} />} />
          <Route path="login" element={<Navigate to={`/user/${userId}`} />} />
          <Route path="register" element={<Navigate to={`/user/${userId}`} />} />
          <Route path="user/:id" element={<UserRoom socket={socket} />} />
          <Route path="user/*" element={<UserRoom socket={socket} />} />
          <Route path="settings" element={<UserSettings socket={socket} />} />
          <Route path="post/:id" element={<PostPage />} />
          <Route path="post/*" element={<PostPage />} />
          <Route
            path="*"
            element={userRequestStatus === 'loading' ? <ProcessingPage /> : <Page404 />}
          />
        </>
      ) : (
        <>
          <Route path="/" element={<Navigate to={'/login'} />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="login" element={<AuthPage />} />
          <Route
            path="*"
            element={userRequestStatus === 'loading' ? <ProcessingPage /> : <Page404 />}
          />
        </>
      )}
    </Routes>
  );
};
