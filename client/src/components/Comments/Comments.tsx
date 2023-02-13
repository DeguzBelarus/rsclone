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
import { IconButton, List, ListItem, ListItemAvatar, ListItemText, Tooltip } from '@mui/material';
import { DeleteForever as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import Avatar from 'components/Avatar';
import { PostDate } from 'components/PostDate/PostDate';
import { CommentInput } from 'components/CommentInput/CommentInput';

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
  const [editingId, setEditingId] = useState<number>();

  console.log(data);

  const handleAddComment = async (value: string) => {
    if (!token || !userId || !postId) return;

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

    const result = await dispatch(deleteCommentAsync({ lang, token, id }));
    if (onChange && result.meta.requestStatus === 'fulfilled') {
      onChange();
    }
  };

  return (
    <div className={styles.wrapper}>
      <h2>{language(lng.commentsHeading)}</h2>
      <div className={styles.add}>
        <CommentInput value="" onSubmit={handleAddComment} />
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
            }) => (
              <ListItem key={id} className={styles.comment}>
                <ListItemAvatar>
                  <Avatar size="2.5rem" user={authorId} avatarSrc={authorAvatar} />
                </ListItemAvatar>
                {id === editingId ? (
                  <div>
                    <CommentInput
                      value={commentText}
                      autoFocus
                      onSubmit={(value) => handleUpdateComment(value, id)}
                      onReset={() => setEditingId(undefined)}
                    />
                  </div>
                ) : (
                  <>
                    <ListItemText className={styles.commentText}>
                      <span>{commentText}</span>
                      <span className={styles.date}>
                        <PostDate date={date} editDate={editDate} />
                        <span style={{ textTransform: 'uppercase' }}>{authorNickname}</span>
                      </span>
                    </ListItemText>
                    <div className={styles.commentActions}>
                      {authorId === userId && (
                        <Tooltip title={language(lng.commentEdit)}>
                          <IconButton color="inherit" onClick={() => setEditingId(id)}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                      {(authorId === userId || (role === 'ADMIN' && authorRole !== 'ADMIN')) && (
                        <Tooltip title={language(lng.commentDelete)}>
                          <IconButton color="warning" onClick={() => handleDeleteComment(id)}>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                    </div>
                  </>
                )}
              </ListItem>
            )
          )}
        </List>
      ) : (
        <div className={styles.noComments}>{language(lng.commentsNoneMsg)}</div>
      )}
    </div>
  );
};
