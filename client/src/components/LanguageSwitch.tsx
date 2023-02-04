import { Badge, FormControlLabel, IconButton, Menu, MenuItem, Radio } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { getCurrentLanguage, setCurrentLanguage } from 'app/mainSlice';
import { LANGUAGES, LANGUAGE_NAMES } from 'consts';
import React, { ChangeEvent, useState } from 'react';
import { CurrentLanguageType } from 'types/types';
import LanguageIcon from '@mui/icons-material/Language';

export const LanguageSwitch = () => {
  const currentLangauge = useAppSelector(getCurrentLanguage);
  const dispatch = useAppDispatch();

  const [menuAnchor, setMenuAnchor] = useState<HTMLElement>();
  const menuOpen = Boolean(menuAnchor);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(setCurrentLanguage(event.target.value as CurrentLanguageType));
  };

  function handleMenuOpen(event: React.MouseEvent<HTMLElement>) {
    setMenuAnchor(event.currentTarget);
  }

  function handleMenuClose() {
    setMenuAnchor(undefined);
  }

  return (
    <>
      <IconButton color="inherit" onClick={handleMenuOpen}>
        <Badge badgeContent={currentLangauge} color="secondary">
          <LanguageIcon />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={menuAnchor}
        open={menuOpen}
        onClick={handleMenuClose}
        onClose={handleMenuClose}
      >
        {LANGUAGES.map((language, index) => (
          <MenuItem key={language} value={language}>
            <FormControlLabel
              value={language}
              control={<Radio checked={language === currentLangauge} onChange={handleChange} />}
              label={LANGUAGE_NAMES[index]}
            />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
