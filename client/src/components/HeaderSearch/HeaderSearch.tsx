import React, { useRef, useState } from 'react';
import { Autocomplete, InputBase, TextField, useTheme } from '@mui/material';
import styles from './HeaderSearch.module.scss';
import { Search as SearchIcon } from '@mui/icons-material';
import { alpha, Box } from '@mui/system';

export default function HeaderSearch() {
  const [inputFocus, setInputFocus] = useState(false);

  const theme = useTheme();

  return (
    <div className={styles.wrapper}>
      <Box
        className={styles.content}
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
              onFocus={() => setInputFocus(true)}
              onBlur={() => setInputFocus(false)}
              className={styles.input + ' ' + inputFocus ? styles.focus : ''}
              sx={{ color: theme.palette.common.white }}
            />
          )}
        />
      </Box>
    </div>
  );
}
