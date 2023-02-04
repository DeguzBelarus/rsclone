import { MailSharp } from '@mui/icons-material';
import { AppBar, IconButton, Toolbar } from '@mui/material';
import { LanguageSwitch } from 'components/LanguageSwitch';
import React from 'react';
import styles from './Header.module.scss';

export const Header = () => {
  return (
    <AppBar className={styles.header}>
      <Toolbar disableGutters>
        <h1>RS Clone</h1>

        <IconButton color="inherit">
          <MailSharp />
        </IconButton>

        <LanguageSwitch />
      </Toolbar>
    </AppBar>
  );
};
