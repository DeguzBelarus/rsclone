import { AuthPage } from 'pages/AuthPage/AuthPage';
import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { MainPage } from '../pages/MainPage/MainPage';

export const useRoutes = (): JSX.Element => {
  return (
    <Routes>
      <Route path="/" element={<MainPage />}></Route>
      <Route path="*" element={<MainPage />}></Route>
      <Route path="login" element={<AuthPage />}></Route>
    </Routes>
  );
};
