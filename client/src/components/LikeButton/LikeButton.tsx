import React from 'react';
import LikedIcon from '@mui/icons-material/Favorite';
import NotLikedIcon from '@mui/icons-material/FavoriteBorder';

import { IconButton, Tooltip } from '@mui/material';

import styles from './LikeButton.module.scss';
import { ILikeModel } from 'types/types';
import { useAppSelector } from 'app/hooks';
import { getUserId } from 'app/mainSlice';

interface LikeButtonProps {
  className?: string;
  data?: ILikeModel[];
  onLike?: () => void;
  onUnlike?: () => void;
}

export const LikeButton = ({ className, onLike, onUnlike, data }: LikeButtonProps) => {
  const userId = useAppSelector(getUserId);
  const isLiked = data?.find(({ userId: id }) => id === userId) !== undefined;

  const handleClick = () => {
    if (isLiked) {
      if (onUnlike) onUnlike();
    } else {
      if (onLike) onLike();
    }
  };
  return (
    <Tooltip title="Likes">
      <IconButton onClick={handleClick} color="error">
        {isLiked ? <LikedIcon /> : <NotLikedIcon />}
      </IconButton>
    </Tooltip>
  );
};
