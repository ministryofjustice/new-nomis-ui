import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import BookingsDetailsHeader from 'components/Bookings/Details/header';
import BookingsDetailsHeaderMobile from 'components/Bookings/Details/headerMobile';

import { selectHeaderDetail } from '../selectors';
import { openAddCaseNoteModal, showLargePhoto } from '../actions';

class Header extends PureComponent { // eslint-disable-line react/prefer-stateless-function

  render() {
    const { headerDetails, openAddCaseNote, deviceFormat } = this.props;

    if (deviceFormat === 'desktop') {
      return (
        <BookingsDetailsHeader
          inmateData={headerDetails}
          openAddCaseNote={openAddCaseNote}
          setModalOpen={this.props.setModalOpen}
          setModalData={this.props.setModalData}
        />);
    }
    return (
      <BookingsDetailsHeaderMobile
        inmateData={headerDetails}
        openAddCaseNote={openAddCaseNote}
        onImageClick={this.props.showLargePhoto}
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
    showLargePhoto: (imageId) => dispatch(showLargePhoto(imageId)),

  };
}

const mapStateToProps = createStructuredSelector({
  headerDetails: selectHeaderDetail(),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(Header);
