import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import BookingsDetailsHeader from 'components/Bookings/Details/header';

import { selectHeaderDetail } from '../selectors';
import { showLargePhoto } from '../actions';

class Header extends PureComponent { // eslint-disable-line react/prefer-stateless-function

  render() {
    const { headerDetails, showPhoto } = this.props;
    return (
      <BookingsDetailsHeader
        inmateData={headerDetails}
        onImageClick={showPhoto}
      />
    );
  }
}

Header.propTypes = {
  headerDetails: PropTypes.object.isRequired,
};

export function mapDispatchToProps(dispatch) {
  return {
    showPhoto: (imageId) => dispatch(showLargePhoto(imageId)),
  };
}

const mapStateToProps = createStructuredSelector({
  headerDetails: selectHeaderDetail(),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(Header);
