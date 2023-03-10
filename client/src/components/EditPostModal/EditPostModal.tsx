import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
  TextField,
  Tooltip,
  IconButton,
  Chip,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';

import useLanguage from 'hooks/useLanguage';
import { lng } from 'hooks/useLanguage/types';
import { Socket } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

import styles from './EditPostModal.module.scss';
import useValidateInput from 'hooks/useValidateInput';
import { POST_TITLE_PATTERN } from 'consts';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import {
  createPostAsync,
  getAllPostsAsync,
  getCurrentLanguage,
  getToken,
  getUserId,
  updatePostAsync,
} from 'app/mainSlice';
import { FullScreenMode, IUpdatePostRequest } from '../../types/types';
import { AddAPhoto } from '@mui/icons-material';
import { MediaContainer } from 'components/MediaContainer/MediaContainer';
import { useNavigate } from 'react-router-dom';
import { RecorderButton } from 'components/RecorderButton/RecorderButton';
import { Recorder } from 'components/Recorder/Recorder';
import { RichEditor } from 'components/RichEditor/RichEditor';
import { compressToUTF16 } from 'async-lz-string';
import { getLocalStorageData, setLocalStorageData } from 'app/storage';
import { Spinner } from 'components/Spinner/Spinner';

export interface EditPostModalProps {
  open: boolean;
  id?: number;
  postText?: string;
  postHeading?: string;
  onClose?: () => void;
  onSuccess?: (heading: string, text: string) => void;
  socket: Socket<DefaultEventsMap, DefaultEventsMap>;
}

export const EditPostModal = ({
  id,
  open,
  postText,
  postHeading,
  onClose,
  onSuccess,
  socket,
}: EditPostModalProps) => {
  const [titleValue, setTitleValue] = useState(postHeading || '');
  const [bodyValue, setBodyValue] = useState(postText || '');
  const [bodyRaw, setBodyRaw] = useState('');
  const [titleError, setTitleError] = useState(false);
  const [bodyError, setBodyError] = useState(false);
  const [mediaValue, setMediaValue] = useState<Blob>();
  const [mediaFileName, setMediaFileName] = useState<string>();
  const [touched, setTouched] = useState(false);
  const [recording, setRecording] = useState<'video' | 'audio'>();
  const [mediaLoading, setMediaLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [fullScreen, setFullScreen] = useState<FullScreenMode>(
    getLocalStorageData()?.fullScreenPostEdit || 'auto'
  );

  const language = useLanguage();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down('sm'));
  const lang = useAppSelector(getCurrentLanguage);
  const token = useAppSelector(getToken);
  const userId = useAppSelector(getUserId);
  const userNickname = useAppSelector(getUserId);

  const isFullScreen = fullScreen === 'fullscreen' || (fullScreen === 'auto' && mobile);

  const validateTitle = useValidateInput(
    POST_TITLE_PATTERN,
    setTitleValue,
    setTitleError,
    setTouched
  );

  const validateBody = (value: string) => value.trim() !== '';

  const handlePostBodyChange = (value: string, raw: string) => {
    setBodyValue(value);
    setBodyRaw(raw);
    setBodyError(!validateBody(value));
    setTouched(true);
  };

  const handleClose = () => {
    if (mediaLoading || isSaving) return;
    if (onClose) onClose();
  };

  const handleMediaChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    setMediaFileName(files && files[0] ? files[0].name : undefined);
    setMediaValue(files ? files[0] : undefined);
    setTouched(true);
  };

  const createPost = async (ownId: number, token: string, postText: string): Promise<boolean> => {
    const requestData = new FormData();
    requestData.append('lang', lang);
    requestData.append('postHeading', titleValue);
    requestData.append('postText', postText);
    if (mediaValue) requestData.append('media', mediaValue);

    const result = await dispatch(createPostAsync({ ownId, token, requestData }));
    socket.emit('userAddPost', { userNickname, userId });
    return result && result.meta.requestStatus === 'fulfilled';
  };

  const editPost = async (id: number, token: string, postText: string): Promise<boolean> => {
    const postData: IUpdatePostRequest = {
      lang,
      postId: id,
      token,
      requestData: {
        postHeading: titleValue,
        postText,
      },
    };
    const result = await dispatch(updatePostAsync(postData));
    return result && result.meta.requestStatus === 'fulfilled';
  };

  const handleSave = async () => {
    const isValid = touched && validateTitle(titleValue) && validateBody(bodyValue);
    if (!isValid || !token || userId === null) return;
    const postText = await compressToUTF16(bodyRaw);
    let result = false;
    try {
      setIsSaving(true);
      result =
        id === undefined
          ? await createPost(userId, token, postText)
          : await editPost(id, token, postText);
    } finally {
      setIsSaving(false);
      if (result) {
        handleClose();
        if (onSuccess) onSuccess(titleValue, postText);
        const path = window.location.pathname;
        if (path === '/posts') {
          dispatch(getAllPostsAsync({ lang }));
        }
        if (['/posts', '/user'].some((item) => path.startsWith(item))) return;
        navigate(`/posts/`);
      }
    }
  };

  const handleStartRecording = (type: 'audio' | 'video' | undefined) => {
    setMediaValue(undefined);
    setMediaFileName(undefined);
    setRecording(type);
  };

  const handleEndRecording = useCallback((blob: Blob, fn: string) => {
    setRecording(undefined);
    setMediaFileName(fn);
    setMediaValue(blob);
  }, []);

  const handleRecorderLoadingStart = useCallback(() => setMediaLoading(true), []);
  const handleRecorderLoadingEnd = useCallback(() => setMediaLoading(false), []);

  const handleFullScreenClick = () => {
    const fullScreen = isFullScreen ? 'window' : 'fullscreen';
    setFullScreen(fullScreen);
    setLocalStorageData({ fullScreenPostEdit: fullScreen });
  };

  useEffect(() => {
    if (open) {
      setTitleValue(postHeading || '');
    }
    setTitleError(false);
    setBodyError(false);
    setMediaValue(undefined);
    setTouched(false);
    setRecording(undefined);
  }, [open, postHeading, postText]);

  return (
    <Dialog
      className={styles.dialog}
      open={open}
      disableScrollLock={!isFullScreen}
      scroll="paper"
      fullScreen={isFullScreen}
      onClose={(_, reason) => {
        if (reason === 'escapeKeyDown') handleClose();
      }}
      PaperProps={{ sx: { minWidth: { xs: '90vw', sm: 'min(80vw, 600px)' } } }}
    >
      <DialogTitle className={styles.title}>
        {language(id ? lng.editPostTitle : lng.newPostTitle)}
        <Tooltip title={language(isFullScreen ? lng.fullScreenExit : lng.fullScreen)}>
          <IconButton size="small" onClick={handleFullScreenClick}>
            {isFullScreen ? (
              <CloseFullscreenIcon fontSize="small" />
            ) : (
              <FullscreenIcon fontSize="small" />
            )}
          </IconButton>
        </Tooltip>
      </DialogTitle>
      <DialogContent className={styles.content}>
        <TextField
          variant="standard"
          value={titleValue}
          label={language(lng.postTitle)}
          error={titleError}
          onChange={validateTitle}
          helperText={titleError ? language(lng.postTitleHint) : ' '}
        />
        <RichEditor
          className={styles.editor}
          label={language(lng.postBody)}
          error={bodyError}
          initialValue={postText}
          onChange={handlePostBodyChange}
          helperText={bodyError ? language(lng.postBodyHint) : ' '}
        />
        {id === undefined && (
          <div className={styles.media}>
            <Tooltip title={language(lng.postUploadMedia)}>
              <span>
                <IconButton
                  component="label"
                  color="primary"
                  disabled={mediaLoading}
                  onClick={() => setRecording(undefined)}
                >
                  <input
                    id="avatar-image"
                    accept="image/*"
                    hidden
                    type="file"
                    onChange={handleMediaChange}
                  />
                  <AddAPhoto />
                </IconButton>
              </span>
            </Tooltip>
            <RecorderButton
              video
              recording={recording === 'video'}
              disabled={mediaLoading}
              onClick={() => handleStartRecording('video')}
            />
            <RecorderButton
              recording={recording === 'audio'}
              disabled={mediaLoading}
              onClick={() => handleStartRecording('audio')}
            />
            {mediaValue && mediaFileName && (
              <Tooltip title={language(lng.postUploadMediaDelete)}>
                <Chip
                  className={styles.file}
                  variant="outlined"
                  label={
                    mediaFileName.lastIndexOf('.') >= 0
                      ? mediaFileName.slice(0, mediaFileName.lastIndexOf('.'))
                      : mediaFileName
                  }
                  onDelete={() => setMediaValue(undefined)}
                  onClick={() => setMediaValue(undefined)}
                />
              </Tooltip>
            )}
          </div>
        )}
        {mediaValue && (
          <MediaContainer
            fileName={mediaFileName}
            src={URL.createObjectURL(mediaValue)}
            autoPlay
            contain
            maxHeight="min(250px, 30vh)"
          />
        )}
        <Recorder
          active={recording !== undefined}
          video={recording === 'video'}
          onLoadingStart={handleRecorderLoadingStart}
          onLoadingEnd={handleRecorderLoadingEnd}
          onRecordingEnd={handleEndRecording}
        />
      </DialogContent>
      <DialogActions>
        {isSaving && <Spinner size={24} />}
        <Button disabled={isSaving || mediaLoading} onClick={handleClose}>
          {language(lng.cancel)}
        </Button>
        <Button
          color="success"
          variant="contained"
          onClick={handleSave}
          disabled={!touched || isSaving || mediaLoading}
        >
          {language(lng.save)}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
