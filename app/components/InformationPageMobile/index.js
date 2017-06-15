import React from 'react';
import PropTypes from 'prop-types';

import {
  ModalTypeInfoContainer,
  ModalTitle,
  ModalBody,
} from 'components/Modal/theme';

function InformationPageMobile({ modalData }) {
  return (
    <div>
      <ModalTypeInfoContainer data-name={'ModalTypeInfoContainer'} >
        <ModalTitle>{modalData.title}</ModalTitle>
        <ModalBody>{modalData.body}</ModalBody>
      </ModalTypeInfoContainer>
    </div>
  );
}

InformationPageMobile.propTypes = {
  modalData: PropTypes.object.isRequired,
};

InformationPageMobile.defaultProps = {
};

export default InformationPageMobile;
