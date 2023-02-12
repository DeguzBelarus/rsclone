import { DeleteForever, Edit as EditIcon, Share as ShareIcon } from '@mui/icons-material';
import { Card, CardActions, CardContent, CardHeader, IconButton, Tooltip } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { deletePostAsync, getCurrentLanguage, getToken, getUserId } from 'app/mainSlice';
import { EditPostModal } from 'components/EditPostModal/EditPostModal';
import { MediaContainer } from 'components/MediaContainer/MediaContainer';
import useLanguage from 'hooks/useLanguage';
import { lng } from 'hooks/useLanguage/types';
import React, { useState } from 'react';
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

  const [editPostModalOpen, setEditPostModalOpen] = useState(false);
  const { userId, id, media, postHeading, postText } = data;
  const mediaURL = media && media !== '' ? `/${userId}/posts/${id}/${media}` : undefined;

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
      <CardContent sx={{ padding: '0' }}>
        <div className={styles.media}>
          <MediaContainer src={mediaURL} />
        </div>
        <div className={styles.heading}>{postHeading}</div>
        <div className={styles.body}>{postText}</div>
      </CardContent>
      <CardActions disableSpacing>
        <Tooltip title={language(lng.postEdit)}>
          <IconButton component="label" onClick={() => setEditPostModalOpen(true)}>
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
      <EditPostModal
        open={editPostModalOpen}
        id={id}
        postHeading={postHeading}
        postText={postText}
        onClose={() => setEditPostModalOpen(false)}
      />
    </Card>
  );
};
