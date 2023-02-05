import React from 'react';

import './Footer.scss';

export const Footer = () => {
  return (
    <footer>
      <div className="footer-authors">
        <a
          href="https://github.com/DeguzBelarus"
          target={'_blank'}
          className="footer-author-link"
          title="DeguzBelarus"
          rel="noreferrer"
        >
          Anton Dektyarev
        </a>
        <a
          href="https://github.com/shalick"
          target={'_blank'}
          className="footer-author-link"
          title="Shalick"
          rel="noreferrer"
        >
          Aliaksandr Shabanovich
        </a>
        <a
          href="https://github.com/elquespera"
          target={'_blank'}
          className="footer-author-link"
          title="Elquespera"
          rel="noreferrer"
        >
          Pavel Grinkevich
        </a>
      </div>
      <div className="footer-logo-year">
        <a href="https://rs.school/js/" target={'_blank'} title="RS School" rel="noreferrer">
          <div className="rsschool-footer-link"></div>
        </a>
        <p>2023</p>
      </div>
    </footer>
  );
};
