import { Post } from 'components/Post/Post';
import combineClasses from 'lib/combineClasses';
import React from 'react';
import { IPostModel } from 'types/types';

import styles from './Posts.module.scss';

interface PostsProps {
  data: IPostModel[];
  className?: string;
  ownHighlight?: boolean;
  onDelete?: () => void;
  onEdit?: () => void;
}

export const Posts = ({ data, className, ownHighlight, onDelete, onEdit }: PostsProps) => {
  return (
    <div className={combineClasses(styles.posts, className)}>
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
