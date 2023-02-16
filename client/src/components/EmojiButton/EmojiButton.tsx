import React from 'react';
import { IconButton, Tooltip, useTheme } from '@mui/material';
import useLanguage from 'hooks/useLanguage';
import { lng } from 'hooks/useLanguage/types';
import MoodIcon from '@mui/icons-material/Mood';

interface EmojiButtonProps {
  disabled?: boolean;
  onClick?: () => void;
}

export const EmojiButton = ({ disabled, onClick }: EmojiButtonProps) => {
  const language = useLanguage();
  const theme = useTheme();

  return (
    <Tooltip title={language( lng.emoji )}>
      <span>
        <IconButton component="label" color="primary" disabled={disabled} onClick={onClick}>
          <MoodIcon />          
        </IconButton>
      </span>
    </Tooltip>
  );
};
