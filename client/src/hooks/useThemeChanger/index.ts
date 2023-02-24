import { getLocalStorageData } from 'app/storage';
import { useEffect, useState } from 'react';
import { createTheme, Theme } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { getCurrentColorTheme, setCurrentColorTheme } from 'app/mainSlice';

const THEMES = {
  light: createTheme({ palette: { mode: 'light' } }),
  dark: createTheme({ palette: { mode: 'dark' } }),
};

export const USER_PREFERRED_COLOR_MODE = matchMedia('(prefers-color-scheme: dark)').matches
  ? 'dark'
  : 'light';

export default function useThemeChanger(): Theme {
  const dispatch = useAppDispatch();
  const { currentTheme: currentThemeSaved } = getLocalStorageData();
  const [theme, setTheme] = useState(THEMES[currentThemeSaved || USER_PREFERRED_COLOR_MODE]);
  const currentTheme = useAppSelector(getCurrentColorTheme);

  useEffect(() => {
    setTheme(THEMES[currentTheme]);
  }, [currentTheme]);

  useEffect(() => {
    document.body.style.color = theme.palette.text.primary;
    document.body.style.backgroundColor = theme.palette.background.default;
  }, [theme]);

  useEffect(() => {
    if (currentThemeSaved) {
      dispatch(setCurrentColorTheme(currentThemeSaved));
    }
  }, [dispatch]);

  return theme;
}
