import { useAppSelector } from 'app/hooks';
import { getIsAuthorized, getUserEmail, getUserNickname } from 'app/mainSlice';
import React, { FC } from 'react';

import './UserRoom.scss';

export const UserRoom: FC = (): JSX.Element => {
  const isAuthorized = useAppSelector(getIsAuthorized);
  const userEmail = useAppSelector(getUserEmail);
  const userNickname = useAppSelector(getUserNickname);

  return (
    <div className="user-room-wrapper">
      <div>UserRoom works!</div>
      {isAuthorized && (
        <div className="user-data">
          <div>Email: {userEmail}</div>
          <div>Nickname: {userNickname}</div>
        </div>
      )}
    </div>
  );
};
