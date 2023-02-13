import useLanguage from 'hooks/useLanguage';
import { lng } from 'hooks/useLanguage/types';
import React, { useEffect, useState } from 'react';
import { AccessTime as TimeIcon, Edit as EditIcon } from '@mui/icons-material';

import styles from './PostDate.module.scss';

interface PostDateProps {
  date?: string;
  editDate?: string;
}

export const PostDate = ({ date, editDate }: PostDateProps) => {
  const language = useLanguage();
  const [created, setCreated] = useState('');
  const [edited, setEdited] = useState('');
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [date, editDate]);

  useEffect(() => {
    const parseDate = (date?: string): string => {
      const numericDate = Number(date);
      if (Number.isNaN(numericDate)) return '';
      const elapsed = (now - numericDate) / 1000;
      if (elapsed < 60) return language(lng.justNow);
      if (elapsed < 3600) return `${Math.round(elapsed / 60)} ${language(lng.minutesAgo)}`;
      if (elapsed < 86400) return `${Math.round(elapsed / 3600)} ${language(lng.hoursAgo)}`;
      if (elapsed < 86400 * 2) return language(lng.yesterday);
      return new Date(numericDate).toLocaleString();
    };
    setCreated(date ? parseDate(date) : '');
    setEdited(editDate ? parseDate(editDate) : '');
  }, [now, language, date, editDate]);

  return (
    <span className={styles.date}>
      {date && (
        <span className={styles.item}>
          <TimeIcon fontSize="small" />
          {created}
        </span>
      )}
      {editDate && (
        <span className={styles.item}>
          <EditIcon fontSize="small" />
          {edited}
        </span>
      )}
    </span>
  );
};
