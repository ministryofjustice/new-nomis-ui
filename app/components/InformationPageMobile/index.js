import React from 'react';
import PropTypes from 'prop-types';

import './index.scss';

function InformationPageMobile({ modalData }) {
  return (
    <div>
      <div className="info-container" data-name={'ModalTypeInfoContainer'} >
        <h1>{modalData.title}</h1>
        <div>{modalData.body}</div>
      </div>
    </div>
  );
}

InformationPageMobile.propTypes = {
  modalData: PropTypes.object.isRequired,
};

InformationPageMobile.defaultProps = {
};

export default InformationPageMobile;
