import { Badge, FormControlLabel, IconButton, MenuItem, Radio, Tooltip } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { getCurrentLanguage, setCurrentLanguage } from 'app/mainSlice';
import { LANGUAGES, LANGUAGE_NAMES } from 'consts';
import React, { useState } from 'react';
import { CurrentLanguageType } from 'types/types';
import LanguageIcon from '@mui/icons-material/Language';
import useLanguage from 'hooks/useLanguage';
import { lng } from 'hooks/useLanguage/types';
import { CustomMenu } from './CustomMenu/CustomMenu';

interface LanguageSwitchProps {
  className?: string;
}

export const LanguageSwitch = ({ className }: LanguageSwitchProps) => {
  const currentLangauge = useAppSelector(getCurrentLanguage);
  const dispatch = useAppDispatch();
  const language = useLanguage();

  const [menuAnchor, setMenuAnchor] = useState<HTMLElement>();
  const menuOpen = Boolean(menuAnchor);

  const handleChange = (newLanguage: string) => {
    dispatch(setCurrentLanguage(newLanguage as CurrentLanguageType));
  };

  function handleMenuOpen(event: React.MouseEvent<HTMLElement>) {
    setMenuAnchor(event.currentTarget);
  }

  function handleMenuClose() {
    setMenuAnchor(undefined);
  }

  return (
    <>
      <Tooltip title={language(lng.languageSelect)}>
        <IconButton className={className} color="inherit" onClick={handleMenuOpen}>
          <Badge badgeContent={currentLangauge} color="secondary">
            <LanguageIcon />
          </Badge>
        </IconButton>
      </Tooltip>
      <CustomMenu
        anchorEl={menuAnchor}
        open={menuOpen}
        onClick={handleMenuClose}
        onClose={handleMenuClose}
      >
        {LANGUAGES.map((lang, index) => (
          <MenuItem key={lang} value={lang} onClick={() => handleChange(lang)}>
            <FormControlLabel
              value={lang}
              control={<Radio checked={lang === currentLangauge} />}
              label={LANGUAGE_NAMES[index]}
            />
          </MenuItem>
        ))}
      </CustomMenu>
    </>
  );
};
