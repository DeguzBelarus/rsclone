import React, { FormEvent, ChangeEvent, useState, useEffect } from 'react';

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
  DialogContentText,
  useTheme,
  Divider,
} from '@mui/material';
import useLanguage from 'hooks/useLanguage';
import { lng } from 'hooks/useLanguage/types';
import { AddAPhoto } from '@mui/icons-material';
import styles from './AvatarModal.module.scss';

import avatarImage1 from 'assets/avatars/1.jpg';
import avatarImage2 from 'assets/avatars/2.jpg';
import avatarImage3 from 'assets/avatars/3.jpg';
import avatarImage4 from 'assets/avatars/4.jpg';
import avatarImage5 from 'assets/avatars/5.jpg';
import avatarImage6 from 'assets/avatars/6.jpg';
import avatarImage7 from 'assets/avatars/7.jpg';
import avatarImage8 from 'assets/avatars/8.jpg';
import avatarImage9 from 'assets/avatars/9.jpg';
import avatarImage10 from 'assets/avatars/10.jpg';
import avatarImage11 from 'assets/avatars/11.jpg';
import avatarImage12 from 'assets/avatars/12.jpg';
import avatarImage13 from 'assets/avatars/13.jpg';
import avatarImage14 from 'assets/avatars/14.jpg';
import avatarImage15 from 'assets/avatars/15.jpg';
import avatarImage16 from 'assets/avatars/16.jpg';
import avatarImage17 from 'assets/avatars/17.jpg';
import avatarImage18 from 'assets/avatars/18.jpg';
import Avatar from 'components/Avatar/Avatar';
import combineClasses from 'lib/combineClasses';

const defaultAvatars = [
  { id: 1, src: avatarImage1 },
  { id: 2, src: avatarImage2 },
  { id: 3, src: avatarImage3 },
  { id: 4, src: avatarImage4 },
  { id: 5, src: avatarImage5 },
  { id: 6, src: avatarImage6 },
  { id: 7, src: avatarImage7 },
  { id: 8, src: avatarImage8 },
  { id: 9, src: avatarImage9 },
  { id: 10, src: avatarImage10 },
  { id: 11, src: avatarImage11 },
  { id: 12, src: avatarImage12 },
  { id: 13, src: avatarImage13 },
  { id: 14, src: avatarImage14 },
  { id: 15, src: avatarImage15 },
  { id: 16, src: avatarImage16 },
  { id: 17, src: avatarImage17 },
  { id: 18, src: avatarImage18 },
];

export interface AvatarModalProps {
  open: boolean;
  onSuccess?: (avatar?: Blob) => void;
  onClose?: () => void;
}

export const AvatarModal = ({ open, onClose, onSuccess }: AvatarModalProps) => {
  const language = useLanguage();
  const { palette } = useTheme();

  const [selectedAvatar, setSelectedAvatar] = useState<number>();
  const [avatarSrc, setAvatarSrc] = useState<string>();
  const [blob, setBlob] = useState<Blob>();
  const [touched, setTouched] = useState(false);

  const handleClose = () => {
    if (onClose) onClose();
  };

  const handleConfirm = async () => {
    if (onSuccess && (blob || avatarSrc)) {
      if (blob) {
        onSuccess(blob);
      } else if (avatarSrc) {
        const response = await fetch(avatarSrc);
        const imageBlob = await response.blob();
        if (imageBlob) onSuccess(imageBlob);
      }
    }
    handleClose();
  };

  const handleAvatarClick = (id: number, src: string) => {
    setTouched(true);
    setSelectedAvatar(id);
    setAvatarSrc(src);
    setBlob(undefined);
  };

  const handleAvatarUpdate = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files?.[0]) return;
    setTouched(true);
    setSelectedAvatar(undefined);
    setBlob(files[0]);
    setAvatarSrc(URL.createObjectURL(files[0]));
  };

  useEffect(() => {
    setSelectedAvatar(undefined);
    setAvatarSrc(undefined);
    setBlob(undefined);
    setTouched(false);
  }, [open]);

  return (
    <Dialog
      open={open}
      disableScrollLock
      scroll="paper"
      onClose={handleClose}
      PaperProps={{ sx: { minWidth: { xs: '90vw', sm: 'min(80vw, 520px)' } } }}
    >
      <DialogTitle>{language(lng.chooseAvatar)}</DialogTitle>
      <DialogContent className={styles.content}>
        <Avatar demo={touched} avatarSrc={avatarSrc} size="clamp(5rem, 30vw, 12rem)" />
        <Button component="label" color="info" startIcon={<AddAPhoto />}>
          <input
            id="avatar-image"
            accept="image/*"
            hidden
            type="file"
            onChange={handleAvatarUpdate}
          />
          {language(lng.uploadPhoto)}
        </Button>
        <Divider style={{ alignSelf: 'stretch' }} />
        <DialogContentText>{language(lng.chooseDefault)}</DialogContentText>
        <div className={styles.avatarList}>
          {defaultAvatars.map(({ id, src }) => (
            <Avatar
              key={id}
              className={combineClasses(styles.avatarItem, [
                styles.selected,
                selectedAvatar === id,
              ])}
              style={{ outlineColor: palette.primary.main }}
              demo
              avatarSrc={src}
              size="4rem"
              onClick={() => handleAvatarClick(id, src)}
              onDoubleClick={handleConfirm}
            />
          ))}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>{language(lng.cancel)}</Button>
        <Button disabled={!avatarSrc} onClick={handleConfirm}>
          {language(lng.confirm)}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
