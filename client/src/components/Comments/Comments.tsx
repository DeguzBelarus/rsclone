import { useAppDispatch, useAppSelector } from 'app/hooks';
import React, { useState } from 'react';
import {
  createCommentAsync,
  deleteCommentAsync,
  getCurrentLanguage,
  getToken,
  getUserId,
  getUserRole,
  updateCommentAsync,
} from 'app/mainSlice';
import useLanguage from 'hooks/useLanguage';
import { lng } from 'hooks/useLanguage/types';
import styles from './Comments.module.scss';
import { ICommentModel, ICreateCommentRequest, IUpdateCommentRequest } from 'types/types';
import {
  alpha,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Tooltip,
  useTheme,
} from '@mui/material';
import { DeleteForever as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import Avatar from 'components/Avatar/Avatar';
import { PostDate } from 'components/PostDate/PostDate';
import { CommentInput } from 'components/CommentInput/CommentInput';
import { Link } from 'react-router-dom';

interface CommentsProps {
  postId?: number;
  data?: ICommentModel[];
  onChange?: () => void;
}

export const Comments = ({ postId, data, onChange }: CommentsProps) => {
  const dispatch = useAppDispatch();
  const lang = useAppSelector(getCurrentLanguage);
  const token = useAppSelector(getToken);
  const userId = useAppSelector(getUserId);
  const role = useAppSelector(getUserRole);
  const language = useLanguage();
  const theme = useTheme();
  const [editingId, setEditingId] = useState<number>();

  const handleAddComment = async (value: string) => {
    if (!token || !userId || !postId) return;
    setEditingId(undefined);

    const requestData: ICreateCommentRequest = {
      lang,
      token,
      postId,
      userId,
      requestData: {
        commentText: value,
      },
    };

    const result = await dispatch(createCommentAsync(requestData));
    if (onChange && result.meta.requestStatus === 'fulfilled') {
      onChange();
    }
  };

  const handleUpdateComment = async (commentText: string, id?: number) => {
    if (!token || !id) return;
    setEditingId(undefined);

    const requestData: IUpdateCommentRequest = {
      id,
      lang,
      token,
      requestData: {
        commentText,
      },
    };

    const result = await dispatch(updateCommentAsync(requestData));
    if (onChange && result.meta.requestStatus === 'fulfilled') {
      onChange();
    }
  };

  const handleDeleteComment = async (id?: number) => {
    if (!token || !id) return;
    setEditingId(undefined);

    const result = await dispatch(deleteCommentAsync({ lang, token, id }));
    if (onChange && result.meta.requestStatus === 'fulfilled') {
      onChange();
    }
  };

  return (
    <div className={styles.wrapper}>
      <h3 id="comments">{language(lng.commentsHeading)}</h3>
      <div className={styles.add}>
        <CommentInput
          value=""
          onSubmit={handleAddComment}
          onReset={() => setEditingId(undefined)}
        />
      </div>
      {data && data?.length > 0 ? (
        <List className={styles.comments}>
          {data.map(
            ({
              id,
              userId: authorId,
              commentText,
              authorNickname,
              authorAvatar,
              date,
              authorRole,
              editDate,
            }) => {
              const canEdit = authorId === userId || (role === 'ADMIN' && authorRole !== 'ADMIN');
              const isEditing = id === editingId;
              return (
                <ListItem
                  sx={{
                    backgroundColor: isEditing ? alpha(theme.palette.info.main, 0.15) : undefined,
                    '&:hover': {
                      backgroundColor: isEditing ? undefined : alpha(theme.palette.info.main, 0.1),
                    },
                    cursor: canEdit ? 'pointer' : undefined,
                  }}
                  key={id}
                  className={styles.comment}
                  onClick={() => canEdit && !isEditing && setEditingId(id)}
                >
                  <ListItemAvatar>
                    <Link to={`/user/${authorId}`}>
                      <Avatar size="2.5rem" user={authorId} avatarSrc={authorAvatar} />
                    </Link>
                  </ListItemAvatar>
                  {isEditing ? (
                    <CommentInput
                      value={commentText}
                      autoFocus
                      onSubmit={(value) => handleUpdateComment(value, id)}
                      onReset={() => setEditingId(undefined)}
                    />
                  ) : (
                    <>
                      <ListItemText>
                        <div className={styles.text}>{commentText}</div>
                        <div className={styles.additional}>
                          <span className={styles.date}>
                            <PostDate date={date} editDate={editDate} />
                          </span>
                          <span className={styles.nickname}>
                            <Link to={`/user/${authorId}`}>{authorNickname}</Link>
                          </span>
                        </div>
                      </ListItemText>
                      {canEdit && (
                        <Paper className={styles.commentActions} elevation={2}>
                          {authorId === userId && (
                            <Tooltip
                              title={language(lng.commentEdit)}
                              PopperProps={{ disablePortal: true, keepMounted: true }}
                            >
                              <IconButton color="inherit" onClick={() => setEditingId(id)}>
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                          {canEdit && (
                            <Tooltip
                              title={language(lng.commentDelete)}
                              PopperProps={{ disablePortal: true, keepMounted: true }}
                            >
                              <IconButton color="warning" onClick={() => handleDeleteComment(id)}>
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Paper>
                      )}
                    </>
                  )}
                </ListItem>
              );
            }
          )}
        </List>
      ) : (
        <div className={styles.noComments}>{language(lng.commentsNoneMsg)}</div>
      )}
    </div>
  );
};
