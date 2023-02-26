import {
  DeleteForever as DeleteIcon,
  Edit as EditIcon,
  Link as CopyLinkIcon,
  Launch as OpenIcon,
} from '@mui/icons-material';
import { Socket } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import {
  alpha,
  Badge,
  Card,
  CardActions,
  CardContent,
  IconButton,
  Tooltip,
  useTheme,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import {
  createLikeAsync,
  deleteLikeAsync,
  deletePostAsync,
  getCurrentLanguage,
  getGuestUserData,
  getToken,
  getUserId,
  getUserRole,
  setAlert,
} from 'app/mainSlice';
import { EditPostModal } from 'components/EditPostModal/EditPostModal';
import { MediaContainer } from 'components/MediaContainer/MediaContainer';
import useLanguage from 'hooks/useLanguage';
import { lng } from 'hooks/useLanguage/types';
import { PostDate } from 'components/PostDate/PostDate';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ICreateLikeRequest,
  IDeleteLikeRequest,
  IPostModel,
  LikeThunkLocationType,
} from 'types/types';

import styles from './Post.module.scss';
import Avatar from 'components/Avatar/Avatar';
import { USER_ROLE_ADMIN } from 'consts';
import CommentsIcon from '@mui/icons-material/SpeakerNotes';
import { RichEditor } from 'components/RichEditor/RichEditor';
import useConfirmModal from 'hooks/useConfirmModal';
import { LikeButton } from 'components/LikeButton/LikeButton';

interface PostProps {
  data: IPostModel;
  origin: LikeThunkLocationType;
  single?: boolean;
  ownHighlight?: boolean;
  onDelete?: () => void;
  onEdit?: () => void;
  socket: Socket<DefaultEventsMap, DefaultEventsMap>;
}

export const Post = ({
  data,
  origin,
  single,
  ownHighlight,
  onDelete,
  onEdit,
  socket,
}: PostProps) => {
  const language = useLanguage();
  const dispatch = useAppDispatch();
  const token = useAppSelector(getToken);
  const lang = useAppSelector(getCurrentLanguage);
  const ownId = useAppSelector(getUserId);
  const role = useAppSelector(getUserRole);
  const userNickname = useAppSelector(getUserRole);
  const guestUserData = useAppSelector(getGuestUserData);
  const navigate = useNavigate();
  const theme = useTheme();

  const [editPostModalOpen, setEditPostModalOpen] = useState(false);
  const [DeletePostModal, openDeletePostModal] = useConfirmModal();

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
    socket.emit('userDeletePost', { userNickname, userId: ownId });
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

  const handleLike = () => {
    if (!token || !userId || !data.id) return;

    if (ownId) {
      const request: ICreateLikeRequest = {
        token,
        userId: ownId,
        lang,
        guestId: guestUserData?.id,
        postId: data.id,
        locationType: origin,
      };
      dispatch(createLikeAsync(request));
    }
  };

  const handleUnlike = (id: number) => {
    if (!token || !userId || !data.id) return;

    if (ownId) {
      const request: IDeleteLikeRequest = {
        id,
        token,
        userId: ownId,
        guestId: guestUserData?.id,
        lang,
        postId: data.id,
        locationType: origin,
      };
      dispatch(deleteLikeAsync(request));
    }
  };

  return (
    <Card
      className={styles.post}
      style={{
        backgroundColor:
          ownHighlight && isOwnPost ? alpha(theme.palette.info.main, 0.1) : undefined,
      }}
    >
      <CardContent className={styles.content}>
        <div className={styles.media}>
          <MediaContainer src={mediaURL} audioMargin />
        </div>
        <h4 className={styles.heading}>
          {single ? heading : <Link to={postURL}>{heading} </Link>}
        </h4>

        <div className={styles.subHeading}>
          <Link to={`/user/${userId}`} className={styles.author}>
            <Avatar user={userId} avatarSrc={ownerAvatar} size="1.8rem" />
            <span className={styles.nickname}>{ownerNickname}</span>
          </Link>
          <PostDate style={{ opacity: 0.7 }} date={date} editDate={editDate} />
        </div>
        <div className={styles.body}>
          <RichEditor readOnly initialValue={text} />
        </div>
      </CardContent>
      <CardActions disableSpacing>
        <LikeButton data={data.likes} onLike={handleLike} onUnlike={handleUnlike} />
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
            <IconButton component="label" color="warning" onClick={openDeletePostModal}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        )}

        {data.comments && (
          <Tooltip title={language(lng.commentsHeading)}>
            <IconButton
              component="a"
              href={single ? '#comments' : `${postURL}#comments`}
              sx={{ marginLeft: 'auto' }}
            >
              <Badge badgeContent={data.comments.length} color="warning">
                <CommentsIcon />
              </Badge>
            </IconButton>
          </Tooltip>
        )}
        {!single && (
          <Tooltip title={language(lng.postOpen)}>
            <IconButton component="label" onClick={() => navigate(postURL)}>
              <OpenIcon />
            </IconButton>
          </Tooltip>
        )}
      </CardActions>
      <EditPostModal
        open={editPostModalOpen}
        id={id}
        socket={socket}
        postHeading={heading}
        postText={text}
        onClose={() => setEditPostModalOpen(false)}
        onSuccess={(heading, text) => {
          setHeading(heading);
          setText(text);
          if (onEdit) onEdit();
        }}
      />
      <DeletePostModal title={language(lng.postDelete)} onSuccess={handleDelete}>
        {language(lng.postDeleteMsg)}
      </DeletePostModal>
    </Card>
  );
};
