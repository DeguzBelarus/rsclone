import React from 'react';
import { CircularProgress } from '@mui/material';
import styles from './Spinner.module.scss';

export const Preloader = ({ size = 80 }) => {
  return <CircularProgress size={size} className={styles.spinner} />;
};
