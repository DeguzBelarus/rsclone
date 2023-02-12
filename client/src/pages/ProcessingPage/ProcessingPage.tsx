import React from 'react';
import { Preloader } from '../../components/Preloader/Spinner';

import './ProcessingPage.scss';

export const ProcessingPage = () => {
  return (
    <div className="processing-wrapper">
      <Preloader />
      <h2 className="processing-heading">Processing...</h2>
    </div>
  );
};
