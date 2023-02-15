import { useAppDispatch, useAppSelector } from 'app/hooks';
import { getAllPosts, getAllPostsAsync, getCurrentLanguage } from 'app/mainSlice';
import { Posts } from 'components/Posts/Posts';
import useLanguage from 'hooks/useLanguage';
import { lng } from 'hooks/useLanguage/types';
import React, { useEffect } from 'react';
import styles from './MessagesPage.module.scss';

export const MessagesPage = () => {
  const dispatch = useAppDispatch();
  const language = useLanguage();
  const lang = useAppSelector(getCurrentLanguage);

  // useEffect(() => {
  //   dispatch(getAllPostsAsync({ lang }));
  // }, [lang, dispatch]);

  return (
    <div className={styles.wrapper}>
      <h2>{language(lng.messagesHeading)}</h2>
    </div>
  );
};
