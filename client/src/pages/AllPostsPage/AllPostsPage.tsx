import { useAppDispatch, useAppSelector } from 'app/hooks';
import { Socket } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { getAllPosts, getAllPostsAsync, getCurrentLanguage } from 'app/mainSlice';
import { Posts } from 'components/Posts/Posts';
import React, { FC, useEffect } from 'react';
import styles from './AllPostsPage.module.scss';

interface Props {
  socket: Socket<DefaultEventsMap, DefaultEventsMap>;
}

export const AllPostsPage: FC<Props> = ({ socket }): JSX.Element => {
  const dispatch = useAppDispatch();
  const lang = useAppSelector(getCurrentLanguage);
  const posts = useAppSelector(getAllPosts);

  const updatePosts = () => dispatch(getAllPostsAsync({ lang }));

  useEffect(() => {
    dispatch(getAllPostsAsync({ lang }));
  }, [lang, dispatch]);

  return (
    <div className={styles.wrapper}>
      <Posts
        data={posts}
        socket={socket}
        ownHighlight
        onDelete={updatePosts}
        onEdit={updatePosts}
      />
    </div>
  );
};
