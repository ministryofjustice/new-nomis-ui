import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import Modal from 'components/Modal';

import { setModalOpen } from 'globalReducers/app';
import { selectModalOpen, selectModalData } from 'selectors/app';

class ModalContainer extends Component {
  render() {
    const { modalOpen, modalData } = this.props;
    console.log('modalData', modalData);

    return modalOpen ? <Modal modalData={modalData} setModalOpen={this.props.setModalOpen} /> : null;
  }

}

ModalContainer.propTypes = {
  modalOpen: PropTypes.bool.isRequired,
  modalData: PropTypes.object.isRequired,
  setModalOpen: PropTypes.func.isRequired,
};

ModalContainer.defaultProps = {
};

const mapStateToProps = createStructuredSelector({
  modalOpen: selectModalOpen(),
  modalData: selectModalData(),
});

const mapDispatchToProps = {
  setModalOpen,
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalContainer);
