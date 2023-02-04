import React from 'react';
import { useAppDispatch, useAppSelector } from 'app/hooks';

import { getAuthMessage, setAuthMessage } from 'app/mainSlice';
import { VoidMethod } from 'types/types';
import './AuthMessage.scss';

export const AuthMessage = () => {
  const dispatch = useAppDispatch();

  const authMessage = useAppSelector(getAuthMessage);

  const clearMessage: VoidMethod = () => {
    dispatch(setAuthMessage(null));
  };

  return (
    <div className="auth-message-wrapper">
      <div className="message-container">{`${authMessage || ''}`}</div>
      <button type="button" className="clear-message-button" onClick={clearMessage}>
        х
      </button>
    </div>
  );
};
