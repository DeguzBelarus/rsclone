import { IconButton, Menu, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { getCurrentLanguage, setCurrentLanguage } from 'app/mainSlice';
import { LANGUAGES } from 'consts';
import React, { useState } from 'react';
import { CurrentLanguageType } from 'types/types';
import LanguageIcon from '@mui/icons-material/Language';

export const LanguageSwitch = () => {
  const currentLangauge = useAppSelector(getCurrentLanguage);
  const dispatch = useAppDispatch();

  const [menuAnchor, setMenuAnchor] = useState<HTMLElement>();
  const menuOpen = Boolean(menuAnchor);

  const handleChange = (event: SelectChangeEvent) => {
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
        <LanguageIcon />
      </IconButton>

      <Menu
        anchorEl={menuAnchor}
        open={menuOpen}
        onClick={handleMenuClose}
        onClose={handleMenuClose}
      >
        {LANGUAGES.map((language) => (
          <MenuItem key={language} value={language}>
            {language}
          </MenuItem>
        ))}
      </Menu>
      <Select
        value={currentLangauge}
        onChange={handleChange}
        displayEmpty
        inputProps={{ 'aria-label': 'Without label' }}
      >
        {LANGUAGES.map((language) => (
          <MenuItem key={language} value={language}>
            {language}
          </MenuItem>
        ))}
      </Select>
    </>
  );
};
