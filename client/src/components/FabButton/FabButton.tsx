import { Fab } from '@mui/material';
import React, { MouseEventHandler } from 'react';
import AddIcon from '@mui/icons-material/Add';
import combineClasses from 'lib/combineClasses';

import styles from './FabButton.module.scss';
import { Box } from '@mui/system';

interface FabButtonProps {
  className?: string;
  value?: string;
  icon?: React.ReactNode;
  onClick?: MouseEventHandler;
}

export const FabButton = ({ className, value, icon, onClick }: FabButtonProps) => {
  return (
    <Fab
      className={combineClasses(styles.button, className)}
      variant="extended"
      color="secondary"
      aria-label="add"
      onClick={onClick}
      sx={{ position: 'fixed' }}
    >
      {icon ? icon : <AddIcon />}
      <Box sx={{ ml: 1 }}>{value}</Box>
    </Fab>
  );
};
