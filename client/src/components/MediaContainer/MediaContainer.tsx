import useLanguage from 'hooks/useLanguage';
import { lng } from 'hooks/useLanguage/types';
import getURLContentType from 'lib/URLContentType';
import React from 'react';

import styles from './MediaContainer.module.scss';

interface MediaContainerProps {
  src?: string;
}

export const MediaContainer = ({ src }: MediaContainerProps) => {
  const contentType = getURLContentType(src || '');

  return (
    <>
      {contentType === 'img' && <img className={styles.image} src={src} alt="Post image" />}
      {contentType === 'video' && (
        <video className={styles.video}>
          <source src={src} />
        </video>
      )}
      {contentType === 'audio' && (
        <audio className={styles.audio}>
          <source src={src} />
        </audio>
      )}
    </>
  );
};
