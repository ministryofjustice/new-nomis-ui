import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { Map } from 'immutable'
import { connect } from 'react-redux'

import BookingsDetailsHeader from '../../../components/Bookings/Details/header'

import { showLargePhoto, viewDetails } from '../actions'
import { DETAILS_TABS } from '../constants'

const Header = ({ headerDetails, showPhoto, offenderNo, showAlertTabForOffenderNo }) => {
  const showAlertTab = () => showAlertTabForOffenderNo(offenderNo)

  return (
    <BookingsDetailsHeader
      offenderNo={offenderNo}
      inmateData={headerDetails}
      onImageClick={showPhoto}
      onAlertFlagClick={showAlertTab}
    />
  )
}

Header.propTypes = {
  headerDetails: ImmutablePropTypes.map,
  showPhoto: PropTypes.func,
  showAlertTabForOffenderNo: PropTypes.func.isRequired,
  offenderNo: PropTypes.string.isRequired,
}

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
}

const mapDispatchToProps = dispatch => ({
  showPhoto: imageId => dispatch(showLargePhoto(imageId)),
  showAlertTabForOffenderNo: offenderNo => dispatch(viewDetails(offenderNo, DETAILS_TABS.ALERTS)),
})

const mapStateToProps = (immutableState, props) => ({
  headerDetails: immutableState.getIn(['eliteApiLoader', 'Bookings', 'Details', props.offenderNo, 'Data']),
})

// Wrap the component to inject dispatch and state into it
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header)
