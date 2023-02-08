import React, { useState } from 'react';
import { Autocomplete, InputBase, useTheme } from '@mui/material';
import styles from './HeaderSearch.module.scss';
import { Search as SearchIcon } from '@mui/icons-material';
import { alpha, Box } from '@mui/system';

interface HeaderSearchProps {
  onFocusChange?: (focused: boolean) => void;
}

export const HeaderSearch = ({ onFocusChange }: HeaderSearchProps) => {
  const [inputFocus, setInputFocus] = useState(false);
  const theme = useTheme();

  const inputFocusHandle = (focused: boolean) => {
    if (onFocusChange) onFocusChange(focused);
    setInputFocus(focused);
  };

  return (
    <div className={styles.wrapper}>
      <Box
        className={styles.content + ' ' + (inputFocus ? styles.focus : '')}
        component="label"
        htmlFor="header-search"
        sx={{
          backgroundColor: alpha(theme.palette.common.white, 0.15),
          '&:hover': {
            backgroundColor: alpha(theme.palette.common.white, 0.25),
          },
        }}
      >
        <SearchIcon />
        <Autocomplete
          id="header-search"
          className={styles.input}
          options={[]}
          renderInput={(params) => (
            <InputBase
              inputProps={params.inputProps}
              onFocus={() => inputFocusHandle(true)}
              onBlur={() => inputFocusHandle(false)}
              className={styles.input}
              sx={{ color: theme.palette.common.white }}
            />
          )}
        />
      </Box>
    </div>
  );
};
