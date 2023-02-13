import React from 'react';
import { CircularProgress } from '@mui/material';

export const Spinner = ({ size = 80 }) => {
  return <CircularProgress size={size} />;
};
