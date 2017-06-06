import React from 'react';
import PropTypes from 'prop-types';

import Button from 'components/Button';
import { ModalContainer, ModalBackground, ModalEnclosure, ModalContentContainer, ModalTitle, ModalBody } from './theme';

function Modal({ modalData, setModalOpen }) {
  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <ModalContainer data-name={'Modal'}>
      <ModalBackground onClick={closeModal} />
      <ModalEnclosure>
        <ModalContentContainer>
          <ModalTitle>{modalData.title}</ModalTitle>
          <ModalBody>{modalData.body}</ModalBody>
          <Button onClick={closeModal} buttonstyle="submit" style={{ pointerEvents: 'auto', marginTop: '50px' }}>Ok - continue</Button>
        </ModalContentContainer>
      </ModalEnclosure>
    </ModalContainer>
  );
}

Modal.propTypes = {
  modalData: PropTypes.object.isRequired,
  setModalOpen: PropTypes.func.isRequired,
};

Modal.defaultProps = {
};

export default Modal;
