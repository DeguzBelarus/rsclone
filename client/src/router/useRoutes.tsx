import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { MainPage } from '../pages/MainPage/MainPage';
import { AuthPage } from 'pages/AuthPage/AuthPage';
import { Page404 } from 'pages/Page404/Page404';

export const useRoutes = (): JSX.Element => {
  return (
    <Routes>
      <Route path="/" element={<MainPage />}></Route>
      <Route path="login" element={<AuthPage />}></Route>
      <Route path="*" element={<Page404 />}></Route>
    </Routes>
  );
};
