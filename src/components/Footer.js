import React from 'react';

const Footer = props => {
  return (
    <div className="app-footer">
      <button className="footer-btn" onClick={() => props.reloadPage()}>
        <img className="footer-img" src={'./assets/reload.svg'} alt="reload button" />
      </button>
    </div>
  );
}

export default Footer;