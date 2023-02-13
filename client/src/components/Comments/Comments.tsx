import { useAppDispatch, useAppSelector } from 'app/hooks';
import React, { useState } from 'react';
import {
  createCommentAsync,
  deleteCommentAsync,
  getCurrentLanguage,
  getToken,
  getUserId,
  getUserRole,
} from 'app/mainSlice';
import useLanguage from 'hooks/useLanguage';
import { lng } from 'hooks/useLanguage/types';
import styles from './Comments.module.scss';
import { ICommentModel, ICreateCommentRequest, IDeleteCommentRequest } from 'types/types';
import {
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
  Tooltip,
} from '@mui/material';
import {
  Send as SendIcon,
  Clear as ClearIcon,
  DeleteForever as DeleteIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import useValidateInput from 'hooks/useValidateInput';
import Avatar from 'components/Avatar';
import { PostDate } from 'components/PostDate/PostDate';

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

  const [commentValue, setCommentValue] = useState('');
  const [commentError, setCommentError] = useState(false);
  const [touched, setTouched] = useState(false);

  const validateComment = useValidateInput(
    (value) => value.length < 3,
    setCommentValue,
    setCommentError,
    setTouched
  );

  const resetInputs = () => {
    setCommentValue('');
    setCommentError(false);
    setTouched(false);
  };

  const handleAddComment = async () => {
    const isValid = touched && validateComment(commentValue);
    if (!isValid || !token || !userId || !postId) return;

    const requestData: ICreateCommentRequest = {
      lang,
      token,
      postId,
      userId,
      requestData: {
        commentText: commentValue,
      },
    };

    const result = await dispatch(createCommentAsync(requestData));
    if (result.meta.requestStatus === 'fulfilled') {
      resetInputs();
      if (onChange) onChange();
    }
  };

  const handleDeleteComment = async (id?: number) => {
    if (!token || !id) return;

    const requestData: IDeleteCommentRequest = {
      lang,
      token,
      id,
    };
    const result = await dispatch(deleteCommentAsync(requestData));
    if (result.meta.requestStatus === 'fulfilled') {
      if (onChange) onChange();
    }
  };

  return (
    <div className={styles.wrapper}>
      <h2>Comments</h2>
      <div className={styles.add}>
        <TextField
          sx={{ width: '100%' }}
          variant="standard"
          placeholder={language(lng.commentWrite)}
          value={commentValue}
          onChange={validateComment}
          onKeyDownCapture={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              handleAddComment();
            }
          }}
          InputProps={{
            endAdornment: (
              <>
                <Tooltip title={language(lng.commentPublish)}>
                  <span>
                    <IconButton disabled={commentError} color="inherit" onClick={handleAddComment}>
                      <SendIcon />
                    </IconButton>
                  </span>
                </Tooltip>
                {commentValue.length > 0 && (
                  <Tooltip title={language(lng.clear)}>
                    <IconButton color="inherit" onClick={resetInputs}>
                      <ClearIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </>
            ),
          }}
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
            }) => (
              <ListItem key={id} className={styles.comment}>
                <ListItemAvatar>
                  <Avatar size="2.5rem" user={authorId} avatarSrc={authorAvatar} />
                </ListItemAvatar>
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
                      <IconButton
                        disabled={commentError}
                        color="inherit"
                        onClick={handleAddComment}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                  {(authorId === userId || (role === 'ADMIN' && authorRole !== 'ADMIN')) && (
                    <Tooltip title={language(lng.commentDelete)}>
                      <IconButton
                        disabled={commentError}
                        color="warning"
                        onClick={() => handleDeleteComment(id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                </div>
              </ListItem>
            )
          )}
        </List>
      ) : (
        <div>NO Comments added</div>
      )}
    </div>
  );
};
