import React from 'react';
import { useAppSelector } from 'app/hooks';
import { getIsAuthorized, getUserId } from 'app/mainSlice';

import { Nullable } from 'types/types';
import { Navigate, Outlet } from 'react-router-dom';

export const PublicRoutes = () => {
  const isAuthorized = useAppSelector<boolean>(getIsAuthorized);
  const userId = useAppSelector<Nullable<number>>(getUserId);

  return isAuthorized ? <Navigate to={`/${userId}`} /> : <Outlet />;
};
