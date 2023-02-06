import React, { FC, useEffect } from 'react';
import { useAppSelector } from 'app/hooks';
import { Socket } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

import { getIsAuthorized, getUserEmail, getUserNickname } from 'app/mainSlice';
import './UserRoom.scss';

interface Props {
  socket: Socket<DefaultEventsMap, DefaultEventsMap>;
}

export const UserRoom: FC<Props> = (socket): JSX.Element => {
  const isAuthorized = useAppSelector(getIsAuthorized);
  const userEmail = useAppSelector(getUserEmail);
  const userNickname = useAppSelector(getUserNickname);

  useEffect(() => {
    socket.socket.emit('userOnline', userNickname);
  }, []);
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
