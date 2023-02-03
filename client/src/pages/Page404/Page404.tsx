import React, { FC } from 'react';
import { NavigateFunction, useNavigate } from 'react-router-dom';

import './Page404.scss';

export const Page404: FC = (): JSX.Element => {
  const navigate: NavigateFunction = useNavigate();
  return (
    <div className="page-404-wrapper">
      <h1 className="page-404-h1">404</h1>
      <h2 className="page-404-h2">Page not found</h2>
      <button type="button" onClick={(): void => navigate('/')} className="more-link">
        Home Page
      </button>
    </div>
  );
};
