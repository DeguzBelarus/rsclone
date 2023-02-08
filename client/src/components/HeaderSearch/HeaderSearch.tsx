import React, { useEffect, useState } from 'react';
import { Autocomplete, InputBase, useTheme } from '@mui/material';
import styles from './HeaderSearch.module.scss';
import { Search as SearchIcon } from '@mui/icons-material';
import { alpha, Box } from '@mui/system';
import joinStrings from 'lib/joinStrings';

interface SearchOption {
  id: number;
  nickname: string;
  firstName?: string;
  lastName?: string;
  city?: string;
  country?: string;
  avatarSrc?: string;
}

// type SearchOption = string;
const defaultOptions: SearchOption[] = [
  { nickname: 'Pavel', city: 'Prague' },
  { nickname: 'Nick', firstName: 'Nicholas' },
  { nickname: 'Tom', city: 'New York', firstName: 'Thomas', lastName: 'Jefferson' },
];
// const defaultOptions: SearchOption[] = ['Pavel', 'Nick'];

const SEARCH_ID = 'header-search-autocomplete';

interface HeaderSearchProps {
  onFocusChange?: (focused: boolean) => void;
}

export const HeaderSearch = ({ onFocusChange }: HeaderSearchProps) => {
  const [inputFocus, setInputFocus] = useState(false);
  const [value, setValue] = React.useState<SearchOption | null>();
  const [inputValue, setInputValue] = React.useState('');
  const [options, setOptions] = useState<SearchOption[]>(defaultOptions);
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
        htmlFor={SEARCH_ID}
        sx={{
          backgroundColor: alpha(theme.palette.common.white, 0.15),
          '&:hover': {
            backgroundColor: alpha(theme.palette.common.white, 0.25),
          },
        }}
      >
        <SearchIcon />
        <Autocomplete
          color="inherit"
          id={SEARCH_ID}
          className={styles.input}
          disablePortal
          options={defaultOptions}
          getOptionLabel={(option) => (typeof option === 'string' ? option : option.nickname)}
          isOptionEqualToValue={(option, value) => option.nickname === value.nickname}
          noOptionsText="No users were found"
          forcePopupIcon={false}
          // value={value}
          // filterSelectedOptions
          // filterOptions={(x) => x}
          // onChange={(_, value) => {
          //   setOptions(value ? [value, ...options] : options);
          //   setValue(value);
          // }}
          // inputValue={inputValue}
          // onInputChange={(_, value) => setInputValue(value)}
          renderInput={(params) => {
            const { InputLabelProps, InputProps, ...rest } = params;
            return (
              <InputBase
                {...InputProps}
                {...rest}
                className={styles.input}
                placeholder="Search users..."
                sx={{ color: theme.palette.common.white }}
                onFocus={() => inputFocusHandle(true)}
                onBlur={() => inputFocusHandle(false)}
              />
            );
          }}
          renderOption={(props, option) => {
            return (
              <li {...props}>
                <div className={styles.option}>
                  <div className={styles.nick}>{option.nickname}</div>
                  <div className={styles.info}>
                    <div>{joinStrings(' ', option.firstName, option.lastName)}</div>
                    {(option.city || option.country) && (
                      <div>{'from' + ' ' + joinStrings(', ', option.city, option.country)}</div>
                    )}
                  </div>
                </div>
              </li>
            );
          }}
        />
      </Box>
    </div>
  );
};
