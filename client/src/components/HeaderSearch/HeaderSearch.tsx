import React, { useState } from 'react';
import { Autocomplete, InputBase, useTheme } from '@mui/material';
import styles from './HeaderSearch.module.scss';
import { Search as SearchIcon } from '@mui/icons-material';
import { alpha, Box } from '@mui/system';
import joinStrings from 'lib/joinStrings';
import Avatar from 'components/Avatar';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { getCurrentLanguage, getUsersAsync } from 'app/mainSlice';
import { IFoundUserData } from 'types/types';
import useLanguage from 'hooks/useLanguage';
import { lng } from 'hooks/useLanguage/types';

const SEARCH_ID = 'header-search-autocomplete';

interface HeaderSearchProps {
  onFocusChange?: (focused: boolean) => void;
}

export const HeaderSearch = ({ onFocusChange }: HeaderSearchProps) => {
  const [inputFocus, setInputFocus] = useState(false);
  const [value, setValue] = useState<IFoundUserData | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [freeSolo, setFreeSolo] = useState(true);
  const theme = useTheme();
  const language = useLanguage();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const currentLanguage = useAppSelector(getCurrentLanguage);
  const options = useAppSelector(({ main: { foundUsers } }) => {
    return foundUsers ? foundUsers.searchResult : [];
  });

  const handleInputChange = (value: string) => {
    setInputValue(value);
    dispatch(getUsersAsync({ lang: currentLanguage, searchKey: value }));
  };

  const handleChange = (value: IFoundUserData | string | null) => {
    if (typeof value === 'string') return;
    handleInputChange('');
    setValue(null);
    if (value?.id) navigate(`/user/${value?.id}`);
  };

  const handleInputFocus = (focused: boolean) => {
    if (onFocusChange) onFocusChange(focused);
    setInputFocus(focused);
    setFreeSolo(true);
    if (focused) {
      setTimeout(() => setFreeSolo(false), 500);
    } else {
      handleInputChange('');
    }
  };

  const makeStrong = (str?: string): string | React.ReactNode | undefined => {
    if (!str) return;
    if (inputValue === '') return str;
    const search = inputValue.toLocaleLowerCase();
    const startIndex = str.toLocaleLowerCase().indexOf(search);
    if (startIndex < 0) return str;
    const endIndex = startIndex + search.length;

    return (
      <span style={{ whiteSpace: 'pre' }}>
        {str.slice(0, startIndex)}
        <strong>{str.slice(startIndex, endIndex)}</strong>
        {str.slice(endIndex)}
      </span>
    );
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
          freeSolo={freeSolo}
          noOptionsText={
            inputValue === ''
              ? language(lng.searchWelcome)
              : language(lng.searchNotFound).replace('%', inputValue)
          }
          options={options}
          getOptionLabel={(option) => (typeof option === 'string' ? option : option.nickname)}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          forcePopupIcon={false}
          filterOptions={(option) => option}
          value={value}
          onChange={(_, value) => handleChange(value)}
          inputValue={inputValue}
          onInputChange={(_, value, reason) => reason !== 'reset' && handleInputChange(value)}
          ListboxProps={{ style: { maxHeight: 'min(80vh, 50rem)' } }}
          componentsProps={{
            popper: { placement: 'top', sx: { minWidth: 'min(90vw, 360px)' } },
          }}
          renderInput={(params) => {
            const { InputProps, InputLabelProps, ...rest } = params;
            return (
              <InputBase
                {...InputProps}
                {...rest}
                className={styles.input}
                placeholder={language(lng.searchPlaceholder)}
                sx={{ color: theme.palette.common.white }}
                onFocus={() => handleInputFocus(true)}
                onBlur={() => handleInputFocus(false)}
              />
            );
          }}
          renderOption={(props, option) => {
            return (
              <li {...props}>
                <div className={styles.option}>
                  <Avatar user={option.id} avatarSrc={option.avatarSrc || undefined} size="2em" />

                  <div className={styles.text}>
                    <div className={styles.nick}>{makeStrong(option.nickname)}</div>
                    <div className={styles.info}>
                      <div>{makeStrong(joinStrings(' ', option.firstName, option.lastName))}</div>
                      {(option.city || option.country) && (
                        <div className={styles.location}>
                          <LocationOnIcon sx={{ opacity: 0.6 }} />
                          {makeStrong(joinStrings(', ', option.city, option.country))}
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
