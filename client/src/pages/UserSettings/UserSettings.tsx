import Avatar from 'components/Avatar';
import React from 'react';
import styles from './UserSettings.module.scss';

export function UserSettings() {
  return (
    <div className={styles.wrapper}>
      <Avatar size="30rem" />
    </div>
  );
}
