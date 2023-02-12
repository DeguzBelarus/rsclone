import React from 'react';

import { Dialog, DialogContent, DialogTitle, DialogActions, Button } from '@mui/material';
import useLanguage from 'hooks/useLanguage';
import { lng } from 'hooks/useLanguage/types';

export interface ModalProps {
  open: boolean;
  title?: string;
  onSuccess?: () => void;
  onClose?: () => void;
  children?: React.ReactNode;
}

export const Modal = ({ open, title, onClose, onSuccess, children }: ModalProps) => {
  const langauge = useLanguage();

  const handleClose = () => {
    if (onClose) onClose();
  };

  const handleConfirm = () => {
    handleClose();
    if (onSuccess) onSuccess();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>{langauge(lng.cancel)}</Button>
        <Button onClick={handleConfirm}>{langauge(lng.confirm)}</Button>
      </DialogActions>
    </Dialog>
  );
};
