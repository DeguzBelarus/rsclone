import { useAppDispatch, useAppSelector } from 'app/hooks';
import { getAllPosts, getAllPostsAsync, getCurrentLanguage } from 'app/mainSlice';
import { Posts } from 'components/Posts/Posts';
import React, { FC, useEffect } from 'react';
import styles from './AllPostsPage.module.scss';

export const AllPostsPage: FC = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const lang = useAppSelector(getCurrentLanguage);
  const posts = useAppSelector(getAllPosts);

  useEffect(() => {
    dispatch(getAllPostsAsync({ lang }));
  }, []);
  return (
    <div className={styles.wrapper}>
      <Posts data={posts} />
    </div>
  );
};
