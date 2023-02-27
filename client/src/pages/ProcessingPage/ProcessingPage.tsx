import { useTheme } from '@mui/material';
import useLanguage from 'hooks/useLanguage';
import { lng } from 'hooks/useLanguage/types';
import React, { useEffect, useRef } from 'react';
import { Spinner } from '../../components/Spinner/Spinner';

import styles from './ProcessingPage.module.scss';

export const ProcessingPage = () => {
  const language = useLanguage();
  const loadingMsg = language(lng.loadingMsg);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { palette } = useTheme();

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (wrapper) {
      wrapper.style.setProperty('--message-length', String(loadingMsg.length));
    }
  }, [loadingMsg, wrapperRef]);

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <Spinner />
      <h2 className={styles.heading} style={{ color: palette.primary.main }}>
        {loadingMsg}
      </h2>
    </div>
  );
};
