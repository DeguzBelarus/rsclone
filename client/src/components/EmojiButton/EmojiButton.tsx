import React, { useState } from 'react';
import EmojiPicker, { EmojiClickData, Theme, EmojiStyle } from 'emoji-picker-react';
import { IconButton, Tooltip, useTheme } from '@mui/material';
import useLanguage from 'hooks/useLanguage';
import { lng } from 'hooks/useLanguage/types';
import MoodIcon from '@mui/icons-material/Mood';
import { CustomMenu } from '../CustomMenu/CustomMenu';
import './EmojiButton.scss';

interface EmojiButtonProps {
  small?: boolean;
  onEmojiAdded?: (emoji: string) => void;
}

export const EmojiButton = ({ small, onEmojiAdded }: EmojiButtonProps) => {
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

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    handleMenuClose();
    if (onEmojiAdded) setTimeout(() => onEmojiAdded(emojiData.emoji));
  };
  return (
    <>
      <Tooltip title={language(lng.emoji)}>
        <span>
          <IconButton size={small ? 'small' : 'medium'} onClick={handleMenuOpen}>
            <MoodIcon />
          </IconButton>
        </span>
      </Tooltip>
      <CustomMenu anchorEl={menuAnchor} open={menuOpen} onClose={handleMenuClose}>
        <EmojiPicker
          theme={theme.palette.mode === 'dark' ? Theme.DARK : Theme.LIGHT}
          height={350}
          searchDisabled={true}
          emojiStyle={EmojiStyle.NATIVE}
          onEmojiClick={handleEmojiClick}
        />
      </CustomMenu>
    </>
  );
};
