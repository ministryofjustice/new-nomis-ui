import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import Modal from 'components/Modal';
import ModalMobile from 'components/Modal/mobile';

import { setModalOpen } from 'globalReducers/app';
import { selectModalOpen, selectModalData, selectDeviceFormat } from 'selectors/app';

class ModalContainer extends Component {
  render() {
    const { modalOpen, modalData, deviceFormat } = this.props;
    // console.log('modalData', modalData);

    const modalForRender = deviceFormat === 'desktop' ?
      <Modal modalData={modalData} setModalOpen={this.props.setModalOpen} /> :
      <ModalMobile modalData={modalData} setModalOpen={this.props.setModalOpen} />;

    return modalOpen ? modalForRender : null;
  }

}

ModalContainer.propTypes = {
  modalOpen: PropTypes.bool.isRequired,
  modalData: PropTypes.object.isRequired,
  deviceFormat: PropTypes.string.isRequired,
  setModalOpen: PropTypes.func.isRequired,
};

ModalContainer.defaultProps = {
};

const mapStateToProps = createStructuredSelector({
  modalOpen: selectModalOpen(),
  modalData: selectModalData(),
  deviceFormat: selectDeviceFormat(),
});

const mapDispatchToProps = {
  setModalOpen,
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalContainer);
