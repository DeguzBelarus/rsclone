import useLanguage from 'hooks/useLanguage';
import { lng } from 'hooks/useLanguage/types';
import React, { useEffect, useState } from 'react';
import { AccessTime as TimeIcon, Edit as EditIcon } from '@mui/icons-material';

import styles from './PostDate.module.scss';
import { useAppSelector } from 'app/hooks';
import { getCurrentLanguage } from 'app/mainSlice';
import formatTime from 'lib/formatTime';

interface PostDateProps {
  date?: string;
  style?: React.CSSProperties;
  editDate?: string;
}

export const PostDate = ({ date, editDate, style }: PostDateProps) => {
  const language = useLanguage();
  const lang = useAppSelector(getCurrentLanguage);
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
      if (elapsed < 3600) return formatTime(Math.round(elapsed / 60), 'min', lang);
      if (elapsed < 86400) return formatTime(Math.round(elapsed / 3600), 'hour', lang);
      if (elapsed < 86400 * 2) return language(lng.yesterday);
      const locale = lang === 'ru' ? 'ru-RU' : 'en-US';
      return new Date(numericDate).toLocaleString(locale, {
        dateStyle: 'short',
        timeStyle: 'short',
      });
    };
    setCreated(date ? parseDate(date) : '');
    setEdited(editDate ? parseDate(editDate) : '');
  }, [now, language, date, editDate, lang]);

  return (
    <>
      {date && (
        <span className={styles.item} style={style}>
          <TimeIcon fontSize="small" />
          {created}
        </span>
      )}
      {editDate && (
        <span className={styles.item} style={style}>
          <EditIcon fontSize="small" />
          {edited}
        </span>
      )}
    </>
  );
};
