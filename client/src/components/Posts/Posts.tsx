import { Post } from 'components/Post/Post';
import React from 'react';
import { IPostModel } from 'types/types';

import styles from './Posts.module.scss';

interface PostsProps {
  data: IPostModel[];
  ownHighlight?: boolean;
  onDelete?: () => void;
  onEdit?: () => void;
}

export const Posts = ({ data, ownHighlight, onDelete, onEdit }: PostsProps) => {
  return (
    <div className={styles.posts}>
      {data.map((post) => (
        <Post
          key={post.id}
          data={post}
          ownHighlight={ownHighlight}
          onDelete={() => onDelete && onDelete()}
          onEdit={() => onEdit && onEdit()}
        />
      ))}
    </div>
  );
};
