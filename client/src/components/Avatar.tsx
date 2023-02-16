import React, { useEffect, useState } from 'react';
import { Avatar as MUIAvatar } from '@mui/material';
import { Person as PersonIcon } from '@mui/icons-material';
import { purple } from '@mui/material/colors';
import { useAppSelector } from 'app/hooks';
import { getAvatarSrc, getIsAuthorized, getUserId } from 'app/mainSlice';

interface AvatarProps {
  size?: number | string;
  user?: number;
  avatarSrc?: string | null;
  className?: string;
  onClick?: () => void;
}

export default function Avatar({ size = 32, user, avatarSrc, className, onClick }: AvatarProps) {
  const isAuthorized = useAppSelector(getIsAuthorized);
  const ownAvatarSrc = useAppSelector(getAvatarSrc);
  const userId = useAppSelector(getUserId);

  const [src, setSrc] = useState<string>();

  useEffect(() => {
    if (user === undefined) {
      setSrc(
        isAuthorized
          ? ownAvatarSrc && ownAvatarSrc !== ''
            ? `/${userId}/avatar/${ownAvatarSrc}`
            : undefined
          : undefined
      );
    } else {
      setSrc(avatarSrc ? `/${user}/avatar/${avatarSrc}` : undefined);
    }
  }, [user, avatarSrc, ownAvatarSrc, isAuthorized, userId]);

  return (
    <MUIAvatar
      className={className}
      src={src}
      sx={{ width: size, height: size, bgcolor: purple[50], color: purple[300] }}
      onClick={onClick}
    >
      {!src && <PersonIcon sx={{ width: '70%', height: '70%' }}></PersonIcon>}
    </MUIAvatar>
  );
}
