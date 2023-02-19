import React, { useState } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { IconButton, Tooltip, useTheme } from '@mui/material';
import useLanguage from 'hooks/useLanguage';
import { lng } from 'hooks/useLanguage/types';
import MoodIcon from '@mui/icons-material/Mood';
import { CustomMenu } from '../CustomMenu/CustomMenu';

interface EmojiButtonProps {
  onEmojiAdded?: () => void;
}

export const EmojiButton = ({ onEmojiAdded }: EmojiButtonProps) => {
  const language = useLanguage();
  const theme = useTheme();

  const [menuAnchor, setMenuAnchor] = useState<HTMLElement>();
  const menuOpen = Boolean(menuAnchor);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(undefined);
  };

  return (
    <>
      <Tooltip title={language(lng.emoji)}>
        <span>
          <IconButton component="label" color="primary" onClick={handleMenuOpen}>
            <MoodIcon />
          </IconButton>
        </span>
      </Tooltip>
      <CustomMenu
        anchorEl={menuAnchor}
        open={menuOpen}
        onClick={handleMenuClose}
        onClose={handleMenuClose}
      >
        <EmojiPicker />
      </CustomMenu>
    </>
  );
};
