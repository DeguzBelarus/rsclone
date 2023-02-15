import {
  DeleteForever as DeleteIcon,
  Edit as EditIcon,
  Link as CopyLinkIcon,
  Launch as OpenIcon,
} from '@mui/icons-material';
import { Card, CardActions, CardContent, IconButton, Tooltip, useTheme } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import {
  deletePostAsync,
  getCurrentLanguage,
  getToken,
  getUserId,
  getUserRole,
  setAlert,
} from 'app/mainSlice';
import { ConfirmModal } from 'components/ConfirmModal/ConfirmModal';
import { EditPostModal } from 'components/EditPostModal/EditPostModal';
import { MediaContainer } from 'components/MediaContainer/MediaContainer';
import useLanguage from 'hooks/useLanguage';
import { lng } from 'hooks/useLanguage/types';
import { PostDate } from 'components/PostDate/PostDate';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IPostModel } from 'types/types';

import styles from './Post.module.scss';
import Avatar from 'components/Avatar';
import { USER_ROLE_ADMIN } from 'consts';

interface PostProps {
  data: IPostModel;
  single?: boolean;
  ownHighlight?: boolean;
  onDelete?: () => void;
  onEdit?: () => void;
}

export const Post = ({ data, single, ownHighlight, onDelete, onEdit }: PostProps) => {
  const language = useLanguage();
  const dispatch = useAppDispatch();
  const token = useAppSelector(getToken);
  const lang = useAppSelector(getCurrentLanguage);
  const ownId = useAppSelector(getUserId);
  const role = useAppSelector(getUserRole);
  const navigate = useNavigate();
  const theme = useTheme();

  const [editPostModalOpen, setEditPostModalOpen] = useState(false);
  const [deletePostModalOpen, setDeletePostModalOpen] = useState(false);

  const [heading, setHeading] = useState(data.postHeading);
  const [text, setText] = useState(data.postText);
  const { userId, id, media, date, editDate, ownerAvatar, ownerNickname, ownerRole } = data;

  const mediaURL = media && media !== '' ? `/${userId}/posts/${id}/${media}` : undefined;
  const isOwnPost = userId === ownId;
  const isDeletable = isOwnPost || (role === USER_ROLE_ADMIN && ownerRole !== USER_ROLE_ADMIN);
  const postURL = `/posts/${id}`;

  const handleDelete = async () => {
    if (!id || !token || !ownId) return;
    const deleteRequest = {
      lang,
      id,
      ownId,
      token,
    };
    const result = await dispatch(deletePostAsync(deleteRequest));
    if (result.meta.requestStatus === 'fulfilled' && onDelete) onDelete();
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
    <Card
      className={styles.post}
      style={{
        backgroundColor: ownHighlight && isOwnPost ? theme.palette.grey[100] : undefined,
      }}
    >
      <CardContent sx={{ padding: '0' }}>
        <div className={styles.media}>
          <MediaContainer src={mediaURL} audioMargin />
        </div>
        {single ? (
          <div className={styles.heading}>{heading}</div>
        ) : (
          <Link to={postURL} className={styles.heading}>
            {heading}
          </Link>
        )}

        <div className={styles.subHeading}>
          <Link to={`/user/${userId}`} className={styles.author}>
            <Avatar user={userId} avatarSrc={ownerAvatar} size="1.8rem" />
            <span className={styles.nickname}>{ownerNickname}</span>
          </Link>
          <PostDate style={{ opacity: 0.7 }} date={date} editDate={editDate} />
        </div>
        <div className={styles.body}>
          <pre>{text}</pre>
        </div>
      </CardContent>
      <CardActions disableSpacing>
        {isOwnPost && (
          <Tooltip title={language(lng.postEdit)}>
            <IconButton component="label" onClick={() => setEditPostModalOpen(true)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
        )}
        <Tooltip title={language(lng.postCopyLink)}>
          <IconButton component="label" onClick={handleCopyLink}>
            <CopyLinkIcon />
          </IconButton>
        </Tooltip>
        {isDeletable && (
          <Tooltip title={language(lng.postDelete)}>
            <IconButton
              component="label"
              color="warning"
              onClick={() => setDeletePostModalOpen(true)}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        )}

        {!single && (
          <Tooltip title={language(lng.postOpen)}>
            <IconButton
              sx={{ marginLeft: 'auto' }}
              component="label"
              onClick={() => navigate(postURL)}
            >
              <OpenIcon />
            </IconButton>
          </Tooltip>
        )}
      </CardActions>
      <EditPostModal
        open={editPostModalOpen}
        id={id}
        postHeading={heading}
        postText={text}
        onClose={() => setEditPostModalOpen(false)}
        onSuccess={(heading, text) => {
          setHeading(heading);
          setText(text);
          if (onEdit) onEdit();
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
