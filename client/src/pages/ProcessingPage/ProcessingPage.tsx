import React from 'react';
import { Spinner } from '../../components/Spinner/Spinner';

import './ProcessingPage.scss';

export const ProcessingPage = () => {
  return (
    <div className="processing-wrapper">
      <Spinner />
      <h2 className="processing-heading">Processing...</h2>
    </div>
  );
};
