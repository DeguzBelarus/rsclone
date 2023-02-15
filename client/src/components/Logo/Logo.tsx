import React from 'react';
import styles from './Logo.module.scss';

export const Logo = () => {
  return (
    <div className={styles.logo}>
      <h1 className={styles.logo_text}>
        <div>rs</div>
        <div>social</div>
      </h1>
      <div className={styles.logo_img}></div>
    </div>
  );
};
