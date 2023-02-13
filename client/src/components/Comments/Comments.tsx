import { useAppDispatch, useAppSelector } from 'app/hooks';
import React, { useState } from 'react';
import { createCommentAsync, getCurrentLanguage, getToken, getUserId } from 'app/mainSlice';
import useLanguage from 'hooks/useLanguage';
import { lng } from 'hooks/useLanguage/types';
import styles from './Comments.module.scss';
import { ICommentModel } from 'types/types';
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

  const handleAddComment = async () => {
    const isValid = touched && validateComment(commentValue);
    // console.log(isValid, token, userId, postId);
    if (!isValid || !token || !userId || !postId) return;

    const requestData = {
      lang,
      token,
      postId,
      userId,
      requestData: {
        commentText: commentValue,
      },
    };

    const result = await dispatch(createCommentAsync(requestData));
    // console.log(result);
    if (result.meta.requestStatus === 'fulfilled') {
      console.log('added');
      setCommentValue('');
      setCommentError(false);
      setTouched(false);
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
          placeholder="Write your comment here..."
          value={commentValue}
          // label={language(lng.postTitle)}
          // error={commentError}
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
                <Tooltip title={language(lng.userAddPost)}>
                  <span>
                    <IconButton disabled={commentError} color="inherit" onClick={handleAddComment}>
                      <SendIcon />
                    </IconButton>
                  </span>
                </Tooltip>
                {commentValue.length > 0 && (
                  <Tooltip title={language(lng.userAddPost)}>
                    <IconButton color="inherit" onClick={handleAddComment}>
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
          {data.map(({ id, commentText, date, editDate }) => (
            <ListItem key={id} className={styles.comment}>
              <ListItemAvatar>
                <Avatar />
              </ListItemAvatar>
              <ListItemText className={styles.commentText}>
                <span>{commentText}</span>
                <span className={styles.date}>
                  <PostDate date={date} editDate={editDate} />
                </span>
              </ListItemText>
              <div className={styles.commentActions}>
                <Tooltip title={language(lng.userAddPost)}>
                  <span>
                    <IconButton disabled={commentError} color="inherit" onClick={handleAddComment}>
                      <EditIcon />
                    </IconButton>
                  </span>
                </Tooltip>
                <Tooltip title={language(lng.userAddPost)}>
                  <span>
                    <IconButton disabled={commentError} color="warning" onClick={handleAddComment}>
                      <DeleteIcon />
                    </IconButton>
                  </span>
                </Tooltip>
              </div>
            </ListItem>
          ))}
        </List>
      ) : (
        <div>NO Comments added</div>
      )}
    </div>
  );
};
