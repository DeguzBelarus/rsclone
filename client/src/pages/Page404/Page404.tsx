import { Button } from '@mui/material';
import useLanguage from 'hooks/useLanguage';
import { lng } from 'hooks/useLanguage/types';
import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './Page404.module.scss';

interface Page404Props {
  message?: string;
}

export const Page404 = ({ message }: Page404Props) => {
  const language = useLanguage();
  const navigate = useNavigate();

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.heading}>404</h2>
      <h3 className={styles.subHeading}>{message ? message : language(lng.notFound)}</h3>
      <Button variant="contained" onClick={() => navigate('/')}>
        {language(lng.goToHome)}
      </Button>
    </div>
  );
};
