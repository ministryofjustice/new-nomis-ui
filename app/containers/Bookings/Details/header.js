import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import BookingsDetailsHeader from 'components/Bookings/Details/header';

import { setModalOpen, setModalData } from 'globalReducers/app';

import { selectHeaderDetail } from '../selectors';
import { openAddCaseNoteModal } from '../actions';

class Header extends PureComponent { // eslint-disable-line react/prefer-stateless-function

  render() {
    const { headerDetails, openAddCaseNote } = this.props;
    return (<BookingsDetailsHeader
      inmateData={headerDetails}
      openAddCaseNote={openAddCaseNote}
      setModalOpen={this.props.setModalOpen}
      setModalData={this.props.setModalData}
    />);
  }
}

Header.propTypes = {
  headerDetails: PropTypes.object.isRequired,
  openAddCaseNote: PropTypes.func.isRequired,
  setModalOpen: PropTypes.func.isRequired,
  setModalData: PropTypes.func.isRequired,
};

export function mapDispatchToProps(dispatch) {
  return {
    openAddCaseNote: () => dispatch(openAddCaseNoteModal()),
    setModalOpen: (bool) => dispatch(setModalOpen(bool)),
    setModalData: (obj) => dispatch(setModalData(obj)),
  };
}

const mapStateToProps = createStructuredSelector({
  headerDetails: selectHeaderDetail(),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(Header);
