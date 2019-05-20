import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { Map } from 'immutable'
import { connect } from 'react-redux'

import BookingsDetailsHeader from '../../../components/Bookings/Details/header'

import { showLargePhoto, viewDetails } from '../actions'
import { DETAILS_TABS } from '../constants'

const Header = ({
  headerDetails,
  showPhoto,
  offenderNo,
  showAlertTabForOffenderNo,
  showAddKeyworkerSessionLink,
  prisonStaffHubUrl,
  iepLinkEnabled,
}) => {
  const showAlertTab = () => showAlertTabForOffenderNo(offenderNo)
  return (
    <BookingsDetailsHeader
      offenderNo={offenderNo}
      inmateData={headerDetails}
      onImageClick={showPhoto}
      onAlertFlagClick={showAlertTab}
      showAddKeyworkerSessionLink={showAddKeyworkerSessionLink}
      prisonStaffHubUrl={prisonStaffHubUrl}
      iepLinkEnabled={iepLinkEnabled}
    />
  )
}

Header.propTypes = {
  headerDetails: ImmutablePropTypes.map,
  showPhoto: PropTypes.func,
  showAlertTabForOffenderNo: PropTypes.func.isRequired,
  offenderNo: PropTypes.string.isRequired,
  showAddKeyworkerSessionLink: PropTypes.bool.isRequired,
  prisonStaffHubUrl: PropTypes.string.isRequired,
  iepLinkEnabled: PropTypes.bool,
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
    prisonStaffHubUrl: null,
  }),
  showPhoto: () => {},
  iepLinkEnabled: false,
}

const mapDispatchToProps = dispatch => ({
  showPhoto: imageId => dispatch(showLargePhoto(imageId)),
  showAlertTabForOffenderNo: offenderNo => dispatch(viewDetails(offenderNo, DETAILS_TABS.ALERTS)),
})

const mapStateToProps = (immutableState, props) => {
  const { isKeyWorker } = immutableState.getIn(['authentication', 'user']) || {}
  return {
    headerDetails: immutableState.getIn(['eliteApiLoader', 'Bookings', 'Details', props.offenderNo, 'Data']),
    showAddKeyworkerSessionLink: Boolean(isKeyWorker),
    iepLinkEnabled: immutableState.getIn(['app', 'iepLinkEnabled']),
  }
}

// Wrap the component to inject dispatch and state into it
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header)
