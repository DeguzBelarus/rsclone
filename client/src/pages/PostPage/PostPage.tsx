import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import {
  getCurrentLanguage,
  getCurrentPost,
  getOnePostAsync,
  getUserRequestStatus,
  setCurrentPost,
} from 'app/mainSlice';
import { Post } from 'components/Post/Post';
import useLanguage from 'hooks/useLanguage';
import { lng } from 'hooks/useLanguage/types';
import { Page404 } from 'pages/Page404/Page404';
import { ProcessingPage } from 'pages/ProcessingPage/ProcessingPage';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './PostPage.module.scss';
import { Comments } from 'components/Comments/Comments';

export const PostPage = () => {
  const dispatch = useAppDispatch();
  const post = useAppSelector(getCurrentPost);
  const userRequestStatus = useAppSelector(getUserRequestStatus);
  const lang = useAppSelector(getCurrentLanguage);
  const language = useLanguage();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const postId = Number(id);
    if (!Number.isNaN(postId)) {
      dispatch(getOnePostAsync({ id: postId, lang }));
    }
    return () => {
      dispatch(setCurrentPost(null));
    };
  }, [id, lang, dispatch]);

  return post ? (
    <div className={styles.wrapper}>
      <Post data={post} single onDelete={() => navigate('/')} />
      <Comments
        postId={Number(id)}
        data={post.comments}
        onChange={() => {
          const postId = Number(id);
          if (!Number.isNaN(postId)) {
            dispatch(getOnePostAsync({ id: postId, lang }));
          }
        }}
      />
    </div>
  ) : userRequestStatus === 'loading' ? (
    <ProcessingPage />
  ) : (
    <Page404 message={language(lng.userNotFound).replace('%', id || '')} />
  );
};
