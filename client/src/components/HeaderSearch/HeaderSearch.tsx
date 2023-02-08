import React, { useEffect, useRef, useState } from 'react';
import { Autocomplete, InputBase, useTheme } from '@mui/material';
import styles from './HeaderSearch.module.scss';
import { Search as SearchIcon } from '@mui/icons-material';
import { alpha, Box } from '@mui/system';
import joinStrings from 'lib/joinStrings';
import Avatar from 'components/Avatar';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useNavigate } from 'react-router-dom';

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
  {
    id: 5,
    nickname: 'Pavel',
    city: 'Prague',
    country: 'Czechia',
    avatarSrc: 'dbc9cbba796564618767bad00.jpeg',
  },
  { id: 13, nickname: 'Nick5', firstName: 'Nicholas' },
  { id: 14, nickname: 'Nick6', firstName: 'Nicholas' },
  { id: 15, nickname: 'Nick7', firstName: 'Nicholas' },
  { id: 16, nickname: 'Nick8d', firstName: 'Nicholas' },
  {
    id: 6,
    nickname: 'Tom',
    city: 'New York',
    country: 'USA',
    firstName: 'Thomas',
    lastName: 'Jefferson',
    avatarSrc: 'dbc9cbba796564618767bad01.png',
  },
  {
    id: 7,
    nickname: 'Jane',
    city: 'LA',
    country: 'USA',
    firstName: 'Jane',
    lastName: 'Blake',
    avatarSrc: 'dbc9cbba796564618767bad02.png',
  },
];

const SEARCH_ID = 'header-search-autocomplete';

interface HeaderSearchProps {
  onFocusChange?: (focused: boolean) => void;
}

export const HeaderSearch = ({ onFocusChange }: HeaderSearchProps) => {
  const [inputFocus, setInputFocus] = useState(false);
  const [value, setValue] = React.useState<SearchOption | null>(null);
  const [inputValue, setInputValue] = React.useState('');
  const [options, setOptions] = useState<SearchOption[]>(defaultOptions);
  const theme = useTheme();
  const navigate = useNavigate();

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
          isOptionEqualToValue={(option, value) => option.id === value.id}
          noOptionsText="No users were found"
          forcePopupIcon={false}
          //Turn off auto filtering on typing
          filterOptions={(option) => option}
          value={value}
          onChange={(_, value) => {
            setInputValue('');
            setValue(null);
            if (value?.id) navigate(`/user/${value?.id}`);
            // setOptions(value ? [value, ...options] : options);
            // setValue(value);
          }}
          inputValue={inputValue}
          onInputChange={(_, value) => setInputValue(value)}
          ListboxProps={{
            style: {
              maxHeight: 'min(80vh, 50rem)',
            },
          }}
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
                  <Avatar user={option.id} avatarSrc={option.avatarSrc} size="2em" />

                  <div className={styles.text}>
                    <div className={styles.nick}>{option.nickname}</div>
                    <div className={styles.info}>
                      <div>{joinStrings(' ', option.firstName, option.lastName)}</div>
                      {(option.city || option.country) && (
                        <div className={styles.location}>
                          <LocationOnIcon sx={{ opacity: 0.6 }} />
                          {joinStrings(', ', option.city, option.country)}
                        </div>
                      )}
                    </div>
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
