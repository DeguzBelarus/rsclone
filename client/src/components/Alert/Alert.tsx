import React, { useEffect, useState } from 'react';
import { useAppSelector } from 'app/hooks';

import { getAlert } from 'app/mainSlice';
import { Snackbar, Alert as MUIAlert } from '@mui/material';
import { ALERT_AUTO_HIDE_DURATION } from 'consts';

export const Alert = () => {
  const alert = useAppSelector(getAlert);
  const [message, setMessage] = useState<string>();
  const [open, setOpen] = useState(false);
  const [timer, setTimer] = useState<NodeJS.Timeout>();

  const handleClose = (_: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  useEffect(() => {
    const newMessage = alert?.message;
    if (newMessage) {
      setMessage(newMessage);
      clearTimeout(timer);
      setOpen(true);
      setTimer(
        setTimeout(() => {
          setOpen(false);
          setMessage(undefined);
        }, ALERT_AUTO_HIDE_DURATION)
      );
    } else {
      setOpen(false);
      setMessage(undefined);
    }

    return () => clearTimeout(timer);
  }, [alert]);

  return (
    <Snackbar
      open={open}
      onClose={handleClose}
      sx={{
        bottom: {
          xs: 'calc(var(--footer-height) + 0.5rem)',
          sm: 'calc(var(--footer-height) + 1rem)',
        },
      }}
    >
      <MUIAlert
        variant="filled"
        severity={alert?.severity || 'info'}
        onClose={handleClose}
        sx={{ width: '100%' }}
        elevation={6}
      >
        {message}
      </MUIAlert>
    </Snackbar>
  );
};
