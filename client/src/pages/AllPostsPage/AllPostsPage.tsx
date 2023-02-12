import { Posts } from 'components/Posts/Posts';
import React, { FC } from 'react';
import { IPostModel } from 'types/types';
import styles from './AllPostsPage.module.scss';

export const AllPostsPage: FC = (): JSX.Element => {
  // const posts = useAppSelector(getAllPostsAsync)
  const posts: IPostModel[] = [];

  return (
    <div className={styles.wrapper}>
      <h2>All posts</h2>
      <Posts data={posts} />
    </div>
  );
};
