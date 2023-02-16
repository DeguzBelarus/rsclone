import React from 'react';

import { Dialog, DialogContent, DialogTitle, DialogActions, Button } from '@mui/material';
import useLanguage from 'hooks/useLanguage';
import { lng } from 'hooks/useLanguage/types';

export interface ConfirmModalProps {
  open: boolean;
  title?: string;
  closeOnly?: boolean;
  onSuccess?: () => void;
  onClose?: () => void;
  children?: React.ReactNode;
}

export const ConfirmModal = ({
  open,
  title,
  closeOnly,
  onClose,
  onSuccess,
  children,
}: ConfirmModalProps) => {
  const langauge = useLanguage();

  const handleClose = () => {
    if (onClose) onClose();
  };

  const handleConfirm = () => {
    handleClose();
    if (onSuccess) onSuccess();
  };

  return (
    <Dialog open={open} disableScrollLock onClose={handleClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        {closeOnly ? (
          <Button onClick={handleClose}>{langauge(lng.close)}</Button>
        ) : (
          <>
            <Button onClick={handleClose}>{langauge(lng.cancel)}</Button>
            <Button onClick={handleConfirm}>{langauge(lng.confirm)}</Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};
