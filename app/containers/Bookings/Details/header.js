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
  categorisationLinkText,
  categorisationUrl,
  prisonStaffHubUrl,
  userCanEdit,
  isUseOfForce,
  useOfForceUrl,
  isPathfinderUser,
  pathfinderUrl,
}) => {
  const showAlertTab = () => showAlertTabForOffenderNo(offenderNo)

  return (
    <BookingsDetailsHeader
      offenderNo={offenderNo}
      inmateData={headerDetails}
      onImageClick={showPhoto}
      onAlertFlagClick={showAlertTab}
      showAddKeyworkerSessionLink={showAddKeyworkerSessionLink}
      categorisationLinkText={categorisationLinkText}
      categorisationUrl={categorisationUrl}
      prisonStaffHubUrl={prisonStaffHubUrl}
      userCanEdit={userCanEdit}
      isUseOfForce={isUseOfForce}
      useOfForceUrl={useOfForceUrl}
      isPathfinderUser={isPathfinderUser}
      pathfinderUrl={pathfinderUrl}
    />
  )
}

Header.propTypes = {
  headerDetails: ImmutablePropTypes.map,
  showPhoto: PropTypes.func,
  showAlertTabForOffenderNo: PropTypes.func.isRequired,
  offenderNo: PropTypes.string.isRequired,
  showAddKeyworkerSessionLink: PropTypes.bool.isRequired,
  categorisationLinkText: PropTypes.string.isRequired,
  categorisationUrl: PropTypes.string.isRequired,
  prisonStaffHubUrl: PropTypes.string.isRequired,
  userCanEdit: PropTypes.bool,
  useOfForceUrl: PropTypes.string.isRequired,
  isUseOfForce: PropTypes.bool.isRequired,
  isPathfinderUser: PropTypes.bool,
  pathfinderUrl: PropTypes.string,
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
    categorisationUrl: null,
    useOfForceUrl: null,
    isUseOfForce: false,
  }),
  userCanEdit: true,
  showPhoto: () => {},
  isPathfinderUser: false,
  pathfinderUrl: '',
}

const mapDispatchToProps = dispatch => ({
  showPhoto: imageId => dispatch(showLargePhoto(imageId)),
  showAlertTabForOffenderNo: offenderNo => dispatch(viewDetails(offenderNo, DETAILS_TABS.ALERTS)),
})

const mapStateToProps = (immutableState, props) => {
  const { isKeyWorker, isCatToolUser, isUseOfForce, isPathfinderUser } =
    immutableState.getIn(['authentication', 'user']) || {}
  const userCanEdit = immutableState.getIn(['eliteApiLoader', 'Bookings', 'Details', props.offenderNo, 'UserCanEdit'])
  const offenderInCaseload = immutableState.getIn([
    'eliteApiLoader',
    'Bookings',
    'Details',
    props.offenderNo,
    'OffenderInCaseload',
  ])
  const categorisationLinkText = (isCatToolUser && 'Manage category') || (offenderInCaseload && 'View category') || ''

  return {
    headerDetails: immutableState.getIn(['eliteApiLoader', 'Bookings', 'Details', props.offenderNo, 'Data']),
    userCanEdit,
    showAddKeyworkerSessionLink: Boolean(isKeyWorker),
    categorisationLinkText,
    categorisationUrl: immutableState.getIn(['app', 'categorisationUrl']),
    isUseOfForce: Boolean(isUseOfForce),
    useOfForceUrl: immutableState.getIn(['app', 'useOfForceUrl']),
    isPathfinderUser,
    pathfinderUrl: immutableState.getIn(['app', 'pathfinderUrl']),
  }
}

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(Header)
