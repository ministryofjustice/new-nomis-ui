import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import Footer from 'components/Footer';

import { setModalOpen, setModalData } from 'globalReducers/app';

import ModalData from './modal-data';

class FooterContainer extends Component {  // eslint-disable-line react/prefer-stateless-function
  render() {
    return (<Footer
      modalData={ModalData}
      setModalOpen={this.props.setModalOpen}
      setModalData={this.props.setModalData}
    />);
  }

}

FooterContainer.propTypes = {
  setModalOpen: PropTypes.func.isRequired,
  setModalData: PropTypes.func.isRequired,
};

FooterContainer.defaultProps = {
};

const mapStateToProps = createStructuredSelector({
});

const mapDispatchToProps = {
  setModalOpen,
  setModalData,
};

export default connect(mapStateToProps, mapDispatchToProps)(FooterContainer);
