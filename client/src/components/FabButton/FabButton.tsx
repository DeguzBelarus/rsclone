import { Fab, Tooltip, useMediaQuery } from '@mui/material';
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
  const mobile = useMediaQuery('(max-width:600px)');

  const fab = () => {
    return (
      <Fab
        className={combineClasses(styles.button, className)}
        variant={mobile ? 'circular' : 'extended'}
        color="secondary"
        aria-label="add"
        onClick={onClick}
        sx={{ position: 'fixed' }}
      >
        {icon ? icon : <AddIcon />}
        {!mobile && <Box sx={{ ml: 1 }}>{value}</Box>}
      </Fab>
    );
  };

  return mobile ? (
    <Tooltip title={value} placement="left">
      {fab()}
    </Tooltip>
  ) : (
    fab()
  );
};
