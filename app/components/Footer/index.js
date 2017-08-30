import React from 'react';
import PropTypes from 'prop-types';

import "./footer.scss"

function Footer({ modalData, setModalOpen, setModalData }) {

  const linkClick = (e) => {
    setModalOpen(true);
    setModalData(modalData[e.currentTarget.dataset.name]);
  };

  return (
    <footer className="FooterContainer visible-lg visible-md col-lg-12 col-md-12" data-name={'Footer'}>
      <div className="FooterLinksContainer">
        <div className="FooterLink" data-name={'updates'} onClick={linkClick}>Updates</div>
        <div className="FooterLink" data-name={'help'} onClick={linkClick}>Help</div>
        <div className="FooterLink" data-name={'terms'} onClick={linkClick}>Terms and conditions</div>
      </div>
      <div className="FooterSignature">Powered by Syscon Justice Systems</div>
    </footer>
  );
}

Footer.propTypes = {
  setModalOpen: PropTypes.func.isRequired,
  setModalData: PropTypes.func.isRequired,
  modalData: PropTypes.object.isRequired,
};

Footer.defaultProps = {

};

export default Footer;
