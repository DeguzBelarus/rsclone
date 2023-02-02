import React from 'react';
import { useAppSelector } from 'app/hooks';
import { RegisterPage } from 'pages/RegisterPage/RegisterPage';
import { Route, Routes } from 'react-router-dom';

import { getIsAuthorized } from 'app/mainSlice';
import { MainPage } from '../pages/MainPage/MainPage';
import { AuthPage } from 'pages/AuthPage/AuthPage';
import { Page404 } from 'pages/Page404/Page404';
import { UserRoom } from 'pages/UserRoom/UserRoom';
import { UserSettings } from '../pages/UserSettings/UserSettings';
import { PostPage } from 'pages/PostPage/PostPage';

export const useRoutes = (): JSX.Element => {
  const isAuthorized = useAppSelector<boolean>(getIsAuthorized);

  if (isAuthorized) {
    return (
      <Routes>
        <Route path="/" element={<UserRoom />}></Route>
        <Route path="settings" element={<UserSettings />}></Route>
        <Route path="post/:id" element={<PostPage />}></Route>
        <Route path="*" element={<UserRoom />}></Route>
      </Routes>
    );
  } else {
    return (
      <Routes>
        <Route path="/" element={<MainPage />}></Route>
        <Route path="login" element={<AuthPage />}></Route>
        <Route path="register" element={<RegisterPage />}></Route>
        <Route path="*" element={<Page404 />}></Route>
      </Routes>
    );
  }
};
