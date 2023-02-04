import React from 'react';
import { useAppSelector } from 'app/hooks';

import { getAlert } from 'app/mainSlice';

export const AuthMessage = () => {
  const authMessage = useAppSelector(getAlert);

  return (
    <div className="auth-message-wrapper">
      <div className="message-container">{`${authMessage || ''}`}</div>
      <button type="button" className="clear-message-button">
        х
      </button>
    </div>
  );
};
