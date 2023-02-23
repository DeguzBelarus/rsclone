import React, { FormEvent, useEffect, useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
  TextField,
  DialogContentText,
} from '@mui/material';
import useLanguage from 'hooks/useLanguage';
import { lng } from 'hooks/useLanguage/types';
import useValidateInput from 'hooks/useValidateInput';

export interface ConfirmModalProps {
  open: boolean;
  title?: string;
  closeOnly?: boolean;
  inputLabel?: string;
  inputInitial?: string;
  onSuccess?: (value?: string) => void;
  onClose?: () => void;
  children?: React.ReactNode;
}

export const ConfirmModal = ({
  open,
  title,
  closeOnly,
  inputLabel,
  inputInitial,
  onClose,
  onSuccess,
  children,
}: ConfirmModalProps) => {
  const langauge = useLanguage();
  const [inputValue, setInputValue] = useState('');
  const [inputError, setInputError] = useState(false);
  const [touched, setTouched] = useState(false);
  const validateInput = useValidateInput(
    (value) => value === '',
    setInputValue,
    setInputError,
    setTouched
  );

  const resetInput = () => {
    setTouched(false);
    setInputError(false);
    setInputValue('');
  };

  const handleClose = () => {
    resetInput();
    if (onClose) onClose();
  };

  const handleConfirm = (event: FormEvent) => {
    event.preventDefault();
    if (inputLabel && (!validateInput(inputValue) || !touched)) return;
    if (onSuccess) onSuccess(inputValue);
    handleClose();
  };

  useEffect(() => setInputValue(inputInitial || ''), [inputInitial]);

  return (
    <Dialog open={open} disableScrollLock onClose={handleClose}>
      <DialogTitle>{title}</DialogTitle>
      <form onSubmit={handleConfirm}>
        <DialogContent>
          <DialogContentText>{children}</DialogContentText>
          {inputLabel && (
            <TextField
              fullWidth
              autoFocus
              variant="standard"
              label={inputLabel}
              value={inputValue}
              error={inputError}
              sx={{ minWidth: 'clamp(180px, 40vw, 600px)' }}
              onChange={validateInput}
            />
          )}
        </DialogContent>
        <DialogActions>
          {closeOnly ? (
            <Button type="submit" onClick={handleClose}>
              {langauge(lng.close)}
            </Button>
          ) : (
            <>
              <Button onClick={handleClose}>{langauge(lng.cancel)}</Button>
              <Button type="submit">{langauge(lng.confirm)}</Button>
            </>
          )}
        </DialogActions>
      </form>
    </Dialog>
  );
};
