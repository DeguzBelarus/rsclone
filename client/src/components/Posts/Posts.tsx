import React from 'react';
import { IPostModel } from 'types/types';

import styles from './Posts.module.scss';

interface PostsProps {
  data: IPostModel[];
}

export const Posts = ({ data }: PostsProps) => {
  return (
    <div className={styles.posts}>
      {data.map((post) => (
        <div key={post.id}>{post.postText}</div>
      ))}
    </div>
  );
};
