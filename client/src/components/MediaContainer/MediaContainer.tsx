import getURLContentType from 'lib/URLContentType';
import React from 'react';

import styles from './MediaContainer.module.scss';

interface MediaContainerProps {
  src?: string;
  fileName?: string;
  maxHeight?: string;
  contain?: boolean;
}

export const MediaContainer = ({ src, fileName, maxHeight, contain }: MediaContainerProps) => {
  const contentType = getURLContentType(fileName || src || '');
  return (
    <>
      {contentType === 'img' && (
        <img
          className={styles.image}
          src={src}
          alt="Post image"
          style={{ maxHeight: maxHeight, width: '100%', objectFit: contain ? 'contain' : 'cover' }}
        />
      )}
      {contentType === 'video' && (
        <video
          className={styles.video}
          controls
          autoPlay
          muted
          loop
          style={{ maxHeight: maxHeight, width: '100%', objectFit: contain ? 'contain' : 'cover' }}
        >
          <source src={src} />
        </video>
      )}
      {contentType === 'audio' && (
        <audio controls className={styles.audio} style={{ width: '100%', margin: '1rem' }}>
          <source src={src} />
        </audio>
      )}
    </>
  );
};
