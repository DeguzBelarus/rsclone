import React from 'react';
import LikedIcon from '@mui/icons-material/Favorite';
import NotLikedIcon from '@mui/icons-material/FavoriteBorder';

import { IconButton, Tooltip, useTheme } from '@mui/material';

import styles from './LikeButton.module.scss';
import { ILikeModel } from 'types/types';
import { useAppSelector } from 'app/hooks';
import { getUserId } from 'app/mainSlice';
import useTruncateUserList from 'hooks/useTruncateUserList';

interface LikeButtonProps {
  data?: ILikeModel[];
  onLike?: () => void;
  onUnlike?: (id: number) => void;
}

export const LikeButton = ({ onLike, onUnlike, data }: LikeButtonProps) => {
  const { palette } = useTheme();
  const userId = useAppSelector(getUserId);

  const userLike = data?.find(({ userId: id }) => id === userId);
  const isLiked = userLike !== undefined;
  const users = useTruncateUserList(
    (
      data?.map(({ ownerNickname, userId: ownerId }) =>
        userId === ownerId ? 'You' : ownerNickname
      ) || []
    ).sort((a, b) => (b === 'You' ? 1 : 0))
  );

  const handleClick = () => {
    if (isLiked) {
      if (onUnlike && userLike?.id) onUnlike(userLike.id);
    } else {
      if (onLike) onLike();
    }
  };
  return (
    <Tooltip
      title={
        <ul>
          {users.length > 0 ? (
            users.map((user) => {
              return <li key={user}>{user}</li>;
            })
          ) : (
            <li>Be the first one to like</li>
          )}
        </ul>
      }
      arrow
    >
      <div className={styles.likes}>
        {data && data.length > 0 && (
          <span style={{ color: palette.text.secondary }} className={styles.number}>
            {data.length}
          </span>
        )}
        <IconButton onClick={handleClick} color="error">
          {isLiked ? <LikedIcon /> : <NotLikedIcon />}
        </IconButton>
      </div>
    </Tooltip>
  );
};
