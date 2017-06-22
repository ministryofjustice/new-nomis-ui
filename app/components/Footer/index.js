import React from 'react';
import PropTypes from 'prop-types';

import { FooterContainer, FooterLinksContainer, FooterLink, FooterSignature } from './theme';

function Footer({ modalData, setModalOpen, setModalData }) {
  const linkClick = (e) => {
    setModalOpen(true);
    setModalData(modalData[e.currentTarget.dataset.name]);
  };

  return (
    <FooterContainer data-name={'Footer'}>
      <FooterLinksContainer>
        <FooterLink data-name={'updates'} onClick={linkClick}>Updates</FooterLink>
        <FooterLink data-name={'help'} onClick={linkClick}>Help</FooterLink>
        <FooterLink data-name={'terms'} onClick={linkClick}>Terms and conditions</FooterLink>
      </FooterLinksContainer>
      <FooterSignature>Powered by Syscon Justice Systems</FooterSignature>
    </FooterContainer>
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
