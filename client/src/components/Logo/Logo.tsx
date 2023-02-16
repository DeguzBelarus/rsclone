import combineClasses from 'lib/combineClasses';
import React from 'react';
import styles from './Logo.module.scss';

interface LogoProps {
  className?: string;
  responsive?: boolean;
}

export const Logo = ({ className, responsive }: LogoProps) => {
  return (
    <div className={combineClasses(styles.logo, [styles.responsive, responsive], className)}>
      <h1 className={styles.logo_text}>
        <div className={styles.rs}>rs</div>
        <div>social</div>
      </h1>
      <div className={styles.logo_img}></div>
    </div>
  );
};
