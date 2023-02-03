import React from 'react';
import { useAppSelector } from 'app/hooks';
import { getIsAuthorized } from 'app/mainSlice';

import { Navigate, Outlet } from 'react-router-dom';

export const PublicRoutes = () => {
  const isAuthorized = useAppSelector<boolean>(getIsAuthorized);

  return isAuthorized ? <Navigate to="/" /> : <Outlet />;
};
