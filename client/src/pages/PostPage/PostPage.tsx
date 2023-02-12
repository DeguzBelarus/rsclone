import { useAppDispatch, useAppSelector } from 'app/hooks';
import { getCurrentLanguage, getCurrentPost, getOnePostAsync } from 'app/mainSlice';
import { Post } from 'components/Post/Post';
import useLanguage from 'hooks/useLanguage';
import { lng } from 'hooks/useLanguage/types';
import { Page404 } from 'pages/Page404/Page404';
import React, { FC, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './PostPage.module.scss';

export const PostPage: FC = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const post = useAppSelector(getCurrentPost);
  const lang = useAppSelector(getCurrentLanguage);
  const language = useLanguage();
  const { id } = useParams();

  useEffect(() => {
    const postId = Number(id);
    if (!Number.isNaN(postId)) {
      dispatch(getOnePostAsync({ id: postId, lang }));
    }
  }, [id]);

  return post ? (
    <div className={styles.wrapper}>
      <Post data={post} single />
    </div>
  ) : (
    <Page404 message={language(lng.postNotFound).replace('%', id || '')} />
  );
};
