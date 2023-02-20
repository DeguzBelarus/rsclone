import { getLocalStorageData } from 'app/storage';
import { useEffect, useState } from 'react';
import { createTheme, Theme } from '@mui/material';
import { useAppSelector } from 'app/hooks';
import { getCurrentColorTheme } from 'app/mainSlice';

const THEMES = {
  light: createTheme({ palette: { mode: 'light' } }),
  dark: createTheme({ palette: { mode: 'dark' } }),
};

export default function useThemeChanger(): Theme {
  const { currentTheme: currentThemeSaved } = getLocalStorageData();
  const [theme, setTheme] = useState(THEMES[currentThemeSaved || 'light']);
  const currentTheme = useAppSelector(getCurrentColorTheme);

  useEffect(() => {
    setTheme(THEMES[currentTheme]);
  }, [currentTheme]);

  useEffect(() => {
    document.body.style.color = theme.palette.text.primary;
    document.body.style.backgroundColor = theme.palette.background.default;
  }, [theme]);

  return theme;
}
