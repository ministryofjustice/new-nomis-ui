import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import BookingsDetailsHeaderMobile from 'components/Bookings/Details/headerMobile';

import { selectHeaderDetail } from '../selectors';
import { openAddCaseNoteModal, showLargePhoto } from '../actions';

class Header extends PureComponent { // eslint-disable-line react/prefer-stateless-function

  render() {
    const { headerDetails, openAddCaseNote, showPhoto } = this.props;
    return (
      <BookingsDetailsHeaderMobile
        inmateData={headerDetails}
        openAddCaseNote={openAddCaseNote}
        onImageClick={showPhoto}
      />
    );
  }
}

Header.propTypes = {
  headerDetails: PropTypes.object.isRequired,
  openAddCaseNote: PropTypes.func.isRequired,
};

export function mapDispatchToProps(dispatch) {
  return {
    openAddCaseNote: () => dispatch(openAddCaseNoteModal()),
    showPhoto: (imageId) => dispatch(showLargePhoto(imageId)),
  };
}

const mapStateToProps = createStructuredSelector({
  headerDetails: selectHeaderDetail(),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(Header);
