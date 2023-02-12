import { DeleteForever, Edit as EditIcon, Share as ShareIcon } from '@mui/icons-material';
import { Card, CardActions, CardContent, CardHeader, IconButton, Tooltip } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { deletePostAsync, getCurrentLanguage, getToken, getUserId } from 'app/mainSlice';
import { MediaContainer } from 'components/MediaContainer/MediaContainer';
import useLanguage from 'hooks/useLanguage';
import { lng } from 'hooks/useLanguage/types';
import React from 'react';
import { IPostModel } from 'types/types';

import styles from './Post.module.scss';

interface PostProps {
  data: IPostModel;
}

export const Post = ({ data }: PostProps) => {
  const language = useLanguage();
  const dispatch = useAppDispatch();
  const token = useAppSelector(getToken);
  const currentLanguage = useAppSelector(getCurrentLanguage);
  const ownId = useAppSelector(getUserId);

  const { userId, id, media } = data;
  const mediaURL = media && media !== '' ? `/${userId}/posts/${id}/${media}` : undefined;

  const handleEdit = () => {
    console.log('edit');
  };

  const handleDelete = () => {
    if (!id || !token || !ownId) return;
    const deleteRequest = {
      lang: currentLanguage,
      id,
      ownId,
      token,
    };
    dispatch(deletePostAsync(deleteRequest));
  };

  const handleShare = () => {
    console.log('share');
  };

  return (
    <Card className={styles.post}>
      {/* <CardHeader title={data.postHeading} /> */}
      <CardContent sx={{ padding: '0' }}>
        <div className={styles.media}>
          <MediaContainer src={mediaURL} />
        </div>
        <div className={styles.heading}>{data.postHeading}</div>
        <div className={styles.body}>{data.postText}</div>
      </CardContent>
      <CardActions disableSpacing>
        <Tooltip title={language(lng.postEdit)}>
          <IconButton component="label" onClick={handleEdit}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title={language(lng.postShare)}>
          <IconButton component="label" onClick={handleShare}>
            <ShareIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title={language(lng.postDelete)}>
          <IconButton component="label" color="warning" onClick={handleDelete}>
            <DeleteForever />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
};
