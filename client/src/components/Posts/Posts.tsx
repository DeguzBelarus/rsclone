import { Post } from 'components/Post/Post';
import { Socket } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import combineClasses from 'lib/combineClasses';
import React from 'react';
import { IPostModel, LikeThunkLocationType } from 'types/types';

import styles from './Posts.module.scss';

interface PostsProps {
  data: IPostModel[];
  origin: LikeThunkLocationType;
  className?: string;
  ownHighlight?: boolean;
  onDelete?: () => void;
  onEdit?: () => void;
  socket: Socket<DefaultEventsMap, DefaultEventsMap>;
}

export const Posts = ({
  data,
  origin,
  className,
  ownHighlight,
  onDelete,
  onEdit,
  socket,
}: PostsProps) => {
  return (
    <div className={combineClasses(styles.posts, className)}>
      {data.map((post) => (
        <Post
          key={post.id}
          data={post}
          origin={origin}
          socket={socket}
          ownHighlight={ownHighlight}
          onDelete={() => onDelete && onDelete()}
          onEdit={() => onEdit && onEdit()}
        />
      ))}
    </div>
  );
};
