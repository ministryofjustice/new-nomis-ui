import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import BookingsDetailsHeader from 'components/Bookings/Details/headerMobile';

import { setModalOpen, setModalData } from 'globalReducers/app';

import { selectHeaderDetail } from '../selectors';

import {showLargePhoto} from '../actions';

class Header extends PureComponent { // eslint-disable-line react/prefer-stateless-function
  // componentWillMount() {
  // }

  render() {
    return (<BookingsDetailsHeader
      inmateData={this.props.headerDetails}
      setModalOpen={this.props.setModalOpen}
      setModalData={this.props.setModalData}
      onImageClick={this.props.showLargePhoto}
    />);
  }
}

Header.propTypes = {
  headerDetails: PropTypes.object.isRequired,
  setModalOpen: PropTypes.func.isRequired,
  setModalData: PropTypes.func.isRequired,
};

export function mapDispatchToProps(dispatch) {
  return {
    setModalOpen: (bool) => dispatch(setModalOpen(bool)),
    setModalData: (obj) => dispatch(setModalData(obj)),
    showLargePhoto: (imageId) => dispatch(showLargePhoto(imageId)),
  };
}

const mapStateToProps = createStructuredSelector({
  headerDetails: selectHeaderDetail(),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(Header);
