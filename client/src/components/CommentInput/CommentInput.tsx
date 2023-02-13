import React, { useEffect, useState } from 'react';
import useLanguage from 'hooks/useLanguage';
import { lng } from 'hooks/useLanguage/types';
import { IconButton, TextField, Tooltip } from '@mui/material';
import { Send as SendIcon, Clear as ClearIcon } from '@mui/icons-material';
import useValidateInput from 'hooks/useValidateInput';

interface CommentInputProps {
  value: string;
  onSubmit?: (value: string) => void;
  onReset?: () => void;
}

export const CommentInput = ({ value: initialValue, onSubmit, onReset }: CommentInputProps) => {
  const language = useLanguage();

  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState(false);
  const [touched, setTouched] = useState(false);

  const validateInput = useValidateInput(
    (value) => value.length < 3,
    setValue,
    setError,
    setTouched
  );

  const resetInput = () => {
    setValue('');
    setError(false);
    setTouched(false);
  };

  const handleSubmit = () => {
    const isValid = touched && validateInput(value);
    if (onSubmit && isValid) {
      resetInput();
      onSubmit(value);
    }
  };

  const handleReset = () => {
    resetInput();
    if (onReset) onReset();
  };

  useEffect(() => setValue(initialValue), [initialValue]);

  return (
    <TextField
      sx={{ width: '100%' }}
      variant="standard"
      placeholder={language(lng.commentWrite)}
      value={value}
      onChange={validateInput}
      onKeyDownCapture={(event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          handleSubmit();
        }
      }}
      InputProps={{
        endAdornment: (
          <>
            <Tooltip title={language(lng.commentPublish)}>
              <span>
                <IconButton disabled={error} color="inherit" onClick={handleSubmit}>
                  <SendIcon />
                </IconButton>
              </span>
            </Tooltip>
            {value.length > 0 && (
              <Tooltip title={language(lng.clear)}>
                <IconButton color="inherit" onClick={handleReset}>
                  <ClearIcon />
                </IconButton>
              </Tooltip>
            )}
          </>
        ),
      }}
    />
  );
};
