import React from 'react';

import './Footer.scss';

export const Footer = () => {
  return (
    <footer>
      <a
        href="https://github.com/DeguzBelarus"
        target={'_blank'}
        className="footer-author-link"
        title="DeguzBelarus"
        rel="noreferrer"
      >
        Anton <span className="last-name"> Dektyarev</span>
      </a>
      <a
        href="https://github.com/shalick"
        target={'_blank'}
        className="footer-author-link"
        title="Shalick"
        rel="noreferrer"
      >
        Aliaksandr <span className="last-name">Shabanovich</span>
      </a>
      <a
        href="https://github.com/elquespera"
        target={'_blank'}
        className="footer-author-link"
        title="Elquespera"
        rel="noreferrer"
      >
        Pavel <span className="last-name">Grinkevich</span>
      </a>
      <a
        className="rsschool-footer-link"
        href="https://rs.school/js/"
        target="_blank"
        title="RS School"
        rel="noreferrer"
      />
      <p>2023</p>
    </footer>
  );
};
