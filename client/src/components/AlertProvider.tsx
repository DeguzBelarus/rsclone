import { Alert, AlertColor, Snackbar } from '@mui/material';
import { ALERT_AUTO_HIDE_DURATION } from 'consts';
import React, { ReactNode, createContext, useState, useContext } from 'react';
import { ReactSetState } from 'types/types';

interface AlertContextInterface {
  setOpen: ReactSetState<boolean>;
  setMessage: ReactSetState<string | undefined>;
  setSeverity: ReactSetState<AlertColor | undefined>;
}

const defaultAlertContext = {
  setOpen: () => {},
  setMessage: () => {},
  setSeverity: () => {},
};

const AlertContext = createContext<AlertContextInterface>(defaultAlertContext);

export const AlertProvider = ({ children }: { children?: ReactNode }) => {
  const [message, setMessage] = useState<string>();
  const [severity, setSeverity] = useState<AlertColor>();
  const [open, setOpen] = useState(false);

  const handleClose = (_: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  return (
    <AlertContext.Provider value={{ setOpen, setMessage, setSeverity }}>
      {children}
      <Snackbar open={open} autoHideDuration={ALERT_AUTO_HIDE_DURATION} onClose={handleClose}>
        <Alert variant="filled" severity={severity} onClose={handleClose} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </AlertContext.Provider>
  );
};

export function useAlert() {
  const { setOpen, setMessage, setSeverity } = useContext(AlertContext);

  function show(message?: string, severity: AlertColor = 'info') {
    setOpen(false);
    setSeverity(severity);
    setMessage(message);
    setOpen(true);
  }

  return {
    show(message?: string) {
      show(message, 'info');
    },

    success(message?: string) {
      show(message, 'success');
    },

    warning(message?: string) {
      show(message, 'warning');
    },

    error(message?: string) {
      show(message, 'error');
    },
  };
}
