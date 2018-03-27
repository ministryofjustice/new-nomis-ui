import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Map, List } from 'immutable';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import BookingsDetailsHeader from 'components/Bookings/Details/header';

import { selectHeaderDetail } from '../selectors';
import { showLargePhoto } from '../actions';

class Header extends PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { headerDetails, showPhoto, bookingId } = this.props;

    return (
      <BookingsDetailsHeader
        bookingId={bookingId}
        inmateData={headerDetails}
        onImageClick={showPhoto}
      />
    );
  }
}

Header.propTypes = {
  headerDetails: ImmutablePropTypes.map.isRequired,
};

Header.defaultProps = {
  headerDetails: Map({
    firstName: '',
    lastName: '',
    offenderNo: '',
    facialImageId: '',
    activeAlertCount: '',
    inactiveAlertCount: '',
    assignedLivingUnit: Map({
      description: '',
      agencyName: '',
    }),
    assignedOfficerId: '',
    iepLevel: '',
    csra: '',
  }),
  showPhoto: () => {},
};

export function mapDispatchToProps(dispatch) {
  return {
    showPhoto: (imageId) => dispatch(showLargePhoto(imageId)),
  };
}

const mapStateToProps = (immutableState, props) => {
  const headerDetails = immutableState.getIn(['eliteApiLoader', 'Bookings', 'Details', props.bookingId.toString(), 'Data']);

  return {
    headerDetails,
  }
};

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(Header);
