import React from 'react';
import { Avatar as MUIAvatar } from '@mui/material';
import { Person as PersonIcon } from '@mui/icons-material';
import { purple } from '@mui/material/colors';
import { useAppSelector } from 'app/hooks';
import { getAvatarSrc, getIsAuthorized, getUserId } from 'app/mainSlice';
import { Nullable } from 'types/types';

interface AvatarProps {
  size?: number | string;
}

export default function Avatar({ size = 32 }: AvatarProps) {
  const isAuthorized = useAppSelector(getIsAuthorized);
  const avatarSrc = useAppSelector(getAvatarSrc);
  const userId = useAppSelector<Nullable<number>>(getUserId);
  const src = isAuthorized && avatarSrc ? `/${userId}/avatar/${avatarSrc}` || undefined : undefined;

  return (
    <MUIAvatar
      src={src}
      sx={{ width: size, height: size, bgcolor: purple[50], color: purple[300] }}
    >
      {!src && <PersonIcon sx={{ width: '70%', height: '70%' }}></PersonIcon>}
    </MUIAvatar>
  );
}
