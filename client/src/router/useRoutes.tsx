import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { AuthPage } from 'pages/AuthPage/AuthPage';
import { RegisterPage } from 'pages/RegisterPage/RegisterPage';
import { Page404 } from 'pages/Page404/Page404';
import { UserRoom } from 'pages/UserRoom/UserRoom';
import { UserSettings } from '../pages/UserSettings/UserSettings';
import { PostPage } from 'pages/PostPage/PostPage';
import { PrivateRoutes } from 'components/PrivateRoutes';
import { PublicRoutes } from 'components/PublicRoutes';
import { LanguageSwitch } from 'components/LanguageSwitch';

export const useRoutes = (): JSX.Element => {
  return (
    <>
      <LanguageSwitch />
      <Routes>
        <Route element={<PrivateRoutes />}>
          <Route path="/" element={<UserRoom />} />
          <Route path="settings" element={<UserSettings />} />
          <Route path="post/:id" element={<PostPage />} />
        </Route>

        <Route element={<PublicRoutes />}>
          <Route path="login" element={<AuthPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="*" element={<Page404 />} />
        </Route>
      </Routes>
    </>
  );
};
