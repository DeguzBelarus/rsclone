import React, { useEffect, useRef, useState } from 'react';
import useLanguage from 'hooks/useLanguage';
import { lng } from 'hooks/useLanguage/types';
import { IconButton, TextField, Tooltip } from '@mui/material';
import { Send as SendIcon, Clear as ClearIcon } from '@mui/icons-material';
import useValidateInput from 'hooks/useValidateInput';
import { EmojiButton } from 'components/EmojiButton/EmojiButton';

interface CommentInputProps {
  value: string;
  autoFocus?: boolean;
  placeholder?: string;
  onSubmit?: (value: string) => void;
  onReset?: () => void;
  onCancel?: () => void;
}

export const CommentInput = ({
  value: initialValue,
  autoFocus,
  placeholder,
  onSubmit,
  onReset,
  onCancel,
}: CommentInputProps) => {
  const language = useLanguage();

  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState(false);
  const [touched, setTouched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateInput = useValidateInput(
    (value) => value.trim().length === 0,
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
      onSubmit(value.trim());
      resetInput();
    }
  };

  const handleReset = () => {
    if (onReset) onReset();
    resetInput();
  };

  useEffect(() => setValue(initialValue), [initialValue]);

  useEffect(() => {
    const input = inputRef.current;
    if (input && autoFocus) {
      input.focus();
      input.select();
    }
  }, [inputRef, autoFocus]);

  return (
    <TextField
      sx={{ width: '100%' }}
      variant="standard"
      inputRef={inputRef}
      placeholder={placeholder ? placeholder : language(lng.commentWrite)}
      value={value}
      onChange={validateInput}
      onKeyDownCapture={(event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          handleSubmit();
        } else if (event.key === 'Escape') {
          event.preventDefault();
          handleReset();
          if (onCancel) onCancel();
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
            <EmojiButton />
            <Tooltip title={language(lng.clear)}>
              <IconButton color="inherit" onClick={handleReset}>
                <ClearIcon />
              </IconButton>
            </Tooltip>
          </>
        ),
      }}
    />
  );
};
