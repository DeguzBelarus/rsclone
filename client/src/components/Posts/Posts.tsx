import { Post } from 'components/Post/Post';
import React from 'react';
import { IPostModel } from 'types/types';

import styles from './Posts.module.scss';

interface PostsProps {
  data: IPostModel[];
  onDelete?: () => void;
  onEdit?: () => void;
}

export const Posts = ({ data, onDelete, onEdit }: PostsProps) => {
  return (
    <div className={styles.posts}>
      {data.map((post) => (
        <Post
          key={post.id}
          data={post}
          onDelete={() => onDelete && onDelete()}
          onEdit={() => onEdit && onEdit()}
        />
      ))}
    </div>
  );
};
