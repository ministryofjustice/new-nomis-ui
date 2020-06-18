import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { connect } from 'react-redux'
import ActionLinks from '../../components/ActionLinks'
import SearchForm from './SearchForm'
import { loadLocations } from '../Bookings/actions'
import './homepage.scss'
import Page from '../../components/Page'
import { userType } from '../../types'
import NotificationBar from '../NotificationBar'

class HomePage extends Component {
  componentDidMount() {
    const { boundLoadLocations } = this.props
    boundLoadLocations()
  }

  render() {
    const {
      user,
      omicUrl,
      manageAuthAccountsUrl,
      prisonStaffHubUrl,
      categorisationUrl,
      locations,
      useOfForceUrl,
      pathfinderUrl,
      moicUrl,
      pecsUrl,
      licencesUrl,
    } = this.props
    if (!user) {
      return <div />
    }

    return (
      <React.Fragment>
        <NotificationBar />
        <Page docTitle="Home" showBreadcrumb={false}>
          {locations.size > 0 && <SearchForm />}
          <div>
            <ActionLinks
              isKeyWorkerAdmin={user.isKeyWorkerAdmin && Boolean(locations.size > 0)}
              isKeyWorker={user.isKeyWorker}
              isWhereabouts={user.isWhereabouts}
              omicUrl={omicUrl}
              manageAuthAccountsUrl={manageAuthAccountsUrl}
              prisonStaffHubUrl={prisonStaffHubUrl}
              useOfForceUrl={useOfForceUrl}
              isEstablishmentRollCheck={Boolean(locations.size > 0)}
              hasAdminRights={user.hasAdminRights}
              isGlobalSearch={user.canGlobalSearch}
              isAddBulkAppointments={user.canAddBulkAppointments}
              isCatToolUser={user.isCatToolUser}
              categorisationUrl={categorisationUrl}
              isUseOfForce={user.isUseOfForce}
              pathfinderUrl={pathfinderUrl}
              isPathfinderUser={user.isPathfinderUser}
              moicUrl={moicUrl}
              pecsUrl={pecsUrl}
              isPomAllocUser={user.isPomAllocUser}
              licencesUrl={licencesUrl}
              isLicenceUser={user.isLicenceUser}
              isPecsUser={user.isPecsUser}
              isPrisonUser={user.isPrisonUser}
              staffId={user.staffId}
            />
          </div>
        </Page>
      </React.Fragment>
    )
  }
}

HomePage.propTypes = {
  // mapStateToProps
  user: userType.isRequired,
  omicUrl: PropTypes.string.isRequired,
  manageAuthAccountsUrl: PropTypes.string.isRequired,
  prisonStaffHubUrl: PropTypes.string.isRequired,
  categorisationUrl: PropTypes.string.isRequired,
  locations: ImmutablePropTypes.list.isRequired,
  useOfForceUrl: PropTypes.string.isRequired,
  pathfinderUrl: PropTypes.string.isRequired,
  moicUrl: PropTypes.string.isRequired,
  pecsUrl: PropTypes.string.isRequired,
  licencesUrl: PropTypes.string.isRequired,

  // mapDispatchToProps
  boundLoadLocations: PropTypes.func.isRequired,
}

const mapDispatchToProps = dispatch => ({
  boundLoadLocations: () => dispatch(loadLocations()),
})

const mapStateToProps = state => ({
  user: state.getIn(['authentication', 'user']),
  omicUrl: state.getIn(['app', 'omicUrl']),
  manageAuthAccountsUrl: state.getIn(['app', 'manageAuthAccountsUrl']),
  prisonStaffHubUrl: state.getIn(['app', 'prisonStaffHubUrl']),
  categorisationUrl: state.getIn(['app', 'categorisationUrl']),
  locations: state.getIn(['home', 'locations']),
  useOfForceUrl: state.getIn(['app', 'useOfForceUrl']),
  pathfinderUrl: state.getIn(['app', 'pathfinderUrl']),
  moicUrl: state.getIn(['app', 'moicUrl']),
  pecsUrl: state.getIn(['app', 'pecsUrl']),
  licencesUrl: state.getIn(['app', 'licencesUrl']),
})

export default connect(mapStateToProps, mapDispatchToProps)(HomePage)
