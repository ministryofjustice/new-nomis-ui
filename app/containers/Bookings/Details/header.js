import React, { Component } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Map } from 'immutable';
import { connect } from 'react-redux';

import BookingsDetailsHeader from 'components/Bookings/Details/header';

import { showLargePhoto } from '../actions';

class Header extends Component { 
  render() {
    const { headerDetails, showPhoto, offenderNo } = this.props;

    return (
      <BookingsDetailsHeader
        offenderNo={offenderNo}
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
    keyworker: null,
  }),
  showPhoto: () => {},
};

export function mapDispatchToProps(dispatch) {
  return {
    showPhoto: (imageId) => dispatch(showLargePhoto(imageId)),
  };
}

const mapStateToProps = (immutableState, props) => {
  const headerDetails = immutableState.getIn(['eliteApiLoader', 'Bookings', 'Details', props.offenderNo, 'Data']);

  return {
    headerDetails,
  }
};

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(Header);
