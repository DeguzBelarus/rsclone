import { useTheme } from '@mui/material';
import React from 'react';

import styles from './Footer.module.scss';

export const Footer = () => {
  const { palette } = useTheme();

  return (
    <footer
      className={styles.footer}
      style={{
        color: palette.mode === 'dark' ? palette.text.primary : palette.primary.contrastText,
        backgroundColor:
          palette.mode === 'dark' ? palette.background.default : palette.primary.dark,
      }}
    >
      <a
        href="https://github.com/DeguzBelarus"
        target={'_blank'}
        className="footer-author-link"
        title="DeguzBelarus"
        rel="noreferrer"
      >
        Anton <span className={styles.lastName}> Dektyarev</span>
      </a>
      <a
        href="https://github.com/shalick"
        target={'_blank'}
        className="footer-author-link"
        title="Shalick"
        rel="noreferrer"
      >
        Aliaksandr <span className={styles.lastName}>Shabanovich</span>
      </a>
      <a
        href="https://github.com/elquespera"
        target={'_blank'}
        className="footer-author-link"
        title="Elquespera"
        rel="noreferrer"
      >
        Pavel <span className={styles.lastName}>Grinkevich</span>
      </a>
      <a
        className={styles.rssLink}
        href="https://rs.school/js/"
        target="_blank"
        title="RS School"
        rel="noreferrer"
      />
      <p>2023</p>
    </footer>
  );
};
