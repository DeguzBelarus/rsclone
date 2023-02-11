import React, { ChangeEvent, useEffect, useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
  TextField,
  Tooltip,
  IconButton,
} from '@mui/material';
import useLanguage from 'hooks/useLanguage';
import { lng } from 'hooks/useLanguage/types';

import styles from './EditPostModal.module.scss';
import useValidateInput from 'hooks/useValidateInput';
import { POST_BODY_PATTERN, POST_TITLE_PATTERN } from 'consts';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { createPostAsync, getCurrentLanguage, getToken, getUserId } from 'app/mainSlice';
import { ICreatePostRequestData } from '../../types/types';
import { AddAPhoto, DeleteForever } from '@mui/icons-material';

export interface EditPostModalProps {
  open: boolean;
  id?: number;
  onClose?: () => void;
  onSuccess?: () => void;
}

export const EditPostModal = ({ id, open, onClose, onSuccess }: EditPostModalProps) => {
  const [titleValue, setTitleValue] = useState('');
  const [bodyValue, setBodyValue] = useState('');
  const [titleError, setTitleError] = useState(false);
  const [bodyError, setBodyError] = useState(false);
  const [mediaValue, setMediaValue] = useState<File>();
  const [touched, setTouched] = useState(false);

  const language = useLanguage();
  const dispatch = useAppDispatch();
  const currentLanguage = useAppSelector(getCurrentLanguage);
  const token = useAppSelector(getToken);
  const userId = useAppSelector(getUserId);

  const validateTitle = useValidateInput(
    POST_TITLE_PATTERN,
    setTitleValue,
    setTitleError,
    setTouched
  );

  const validateBody = useValidateInput(POST_BODY_PATTERN, setBodyValue, setBodyError, setTouched);

  const resetInputs = () => {
    setTitleValue('');
    setBodyValue('');
    setTitleError(false);
    setBodyError(false);
    setMediaValue(undefined);
    setTouched(false);
  };

  const handleClose = () => {
    if (onClose) onClose();
  };

  const handleMediaChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    setMediaValue(files ? files[0] : undefined);
    setTouched(true);
  };

  const handleSave = async () => {
    const isValid = touched && validateTitle(titleValue) && validateBody(bodyValue);
    if (!isValid || !token || userId === null) return;

    const requestData = new FormData();
    requestData.append('lang', currentLanguage);
    requestData.append('date', String(Date.now()));
    requestData.append('postHeading', titleValue);
    requestData.append('postText', bodyValue);
    if (id === undefined) {
      if (mediaValue) requestData.append('media', mediaValue);
    } else {
      requestData.append('id', String(id));
    }
    const postData: ICreatePostRequestData = {
      ownId: userId,
      token,
      requestData,
    };

    const result = await dispatch(createPostAsync(postData));
    if (result && result.meta.requestStatus === 'fulfilled') {
      handleClose();
      if (onSuccess) onSuccess();
    }
  };

  useEffect(() => {
    if (open) resetInputs();
  }, [open]);

  return (
    <Dialog
      className={styles.dialog}
      open={open}
      scroll="paper"
      onClose={(_, reason) => {
        if (reason === 'escapeKeyDown') handleClose();
      }}
      PaperProps={{ sx: { minWidth: { xs: '90vw', sm: 'min(80vw, 600px)' } } }}
    >
      <DialogTitle>{language(id ? lng.editPostTitle : lng.newPostTitle)}</DialogTitle>
      <DialogContent className={styles.content}>
        <TextField
          value={titleValue}
          label={language(lng.postTitle)}
          error={titleError}
          onChange={validateTitle}
          helperText={titleError ? language(lng.postTitleHint) : ' '}
        />
        <TextField
          multiline
          minRows={3}
          maxRows={8}
          value={bodyValue}
          label={language(lng.postBody)}
          error={bodyError}
          onChange={validateBody}
          helperText={bodyError ? language(lng.postBodyHint) : ' '}
        />
        {id === undefined && (
          <div className={styles.media}>
            <Tooltip title={language(lng.postUploadMedia)}>
              <IconButton component="label" color="primary">
                <input
                  id="avatar-image"
                  accept="image/*"
                  hidden
                  type="file"
                  onChange={handleMediaChange}
                />
                <AddAPhoto />
              </IconButton>
            </Tooltip>
            {mediaValue && (
              <Tooltip title={language(lng.postUploadMediaDelete)}>
                <IconButton
                  component="label"
                  color="warning"
                  onClick={() => setMediaValue(undefined)}
                >
                  <DeleteForever />
                </IconButton>
              </Tooltip>
            )}
            <span className={styles.file}>{mediaValue && mediaValue.name}</span>
          </div>
        )}
        {mediaValue && <img className={styles.preview} src={URL.createObjectURL(mediaValue)} />}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>{language(lng.cancel)}</Button>
        <Button color="success" variant="contained" onClick={handleSave} disabled={!touched}>
          {language(lng.save)}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
