import React from 'react';
import { useAppSelector } from 'app/hooks';
import { getIsAuthorized } from 'app/mainSlice';

import { Navigate, Outlet } from 'react-router-dom';

export const PrivateRoutes = () => {
  const isAuthorized = useAppSelector<boolean>(getIsAuthorized);

  return isAuthorized ? <Outlet /> : <Navigate to="/login" />;
};
