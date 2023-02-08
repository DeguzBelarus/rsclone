import React from 'react';
import { CircularProgress } from '@mui/material';
import styles from './Preloader.module.scss';

export const Preloader = ({ size = 80 }) => {
  return (
    <div className={styles.preloader}>
      <CircularProgress size={size} />
    </div>
  );
};
