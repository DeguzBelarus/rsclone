import { MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { getCurrentLanguage, setCurrentLanguage } from 'app/mainSlice';
import { LANGUAGES } from 'consts';
import React from 'react';
import { CurrentLanguageType } from 'types/types';

export const LanguageSwitch = () => {
  const currentLangauge = useAppSelector(getCurrentLanguage);
  const dispatch = useAppDispatch();

  const handleChange = (event: SelectChangeEvent) => {
    dispatch(setCurrentLanguage(event.target.value as CurrentLanguageType));
  };

  return (
    <div style={{ position: 'fixed', top: '1rem', right: '1rem' }}>
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
    </div>
  );
};
