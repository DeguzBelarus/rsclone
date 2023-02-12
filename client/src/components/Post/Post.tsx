import { DeleteForever, Edit as EditIcon, Link as CopyLinkIcon } from '@mui/icons-material';
import { Card, CardActions, CardContent, IconButton, TextField, Tooltip } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { deletePostAsync, getCurrentLanguage, getToken, getUserId, setAlert } from 'app/mainSlice';
import { ConfirmModal } from 'components/ConfirmModal/ConfirmModal';
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
  const lang = useAppSelector(getCurrentLanguage);
  const ownId = useAppSelector(getUserId);

  const [editPostModalOpen, setEditPostModalOpen] = useState(false);
  const [deletePostModalOpen, setDeletePostModalOpen] = useState(false);

  const [heading, setHeading] = useState(data.postHeading);
  const [text, setText] = useState(data.postText);
  const { userId, id, media, postHeading, postText } = data;
  const mediaURL = media && media !== '' ? `/${userId}/posts/${id}/${media}` : undefined;

  const handleDelete = () => {
    if (!id || !token || !ownId) return;
    const deleteRequest = {
      lang,
      id,
      ownId,
      token,
    };
    dispatch(deletePostAsync(deleteRequest));
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/posts/${id}`;
    navigator.clipboard.writeText(link);
    dispatch(
      setAlert({
        message: language(lng.postCopyLinkSuccess).replace('%', link),
        severity: 'success',
      })
    );
  };

  return (
    <Card className={styles.post}>
      <CardContent sx={{ padding: '0' }}>
        <div className={styles.media}>
          <MediaContainer src={mediaURL} />
        </div>
        <div className={styles.heading}>{heading}</div>
        <div className={styles.body}>
          <pre>{text}</pre>
        </div>
      </CardContent>
      <CardActions disableSpacing>
        <Tooltip title={language(lng.postEdit)}>
          <IconButton component="label" onClick={() => setEditPostModalOpen(true)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title={language(lng.postCopyLink)}>
          <IconButton component="label" onClick={handleCopyLink}>
            <CopyLinkIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title={language(lng.postDelete)}>
          <IconButton
            component="label"
            color="warning"
            onClick={() => setDeletePostModalOpen(true)}
          >
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
        onSuccess={(heading, text) => {
          setHeading(heading);
          setText(text);
        }}
      />
      <ConfirmModal
        open={deletePostModalOpen}
        title={language(lng.postDelete)}
        onClose={() => setDeletePostModalOpen(false)}
        onSuccess={handleDelete}
      >
        {language(lng.postDeleteMsg)}
      </ConfirmModal>
    </Card>
  );
};
