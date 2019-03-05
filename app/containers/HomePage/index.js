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

class HomePage extends Component {
  componentDidMount() {
    const { boundLoadLocations } = this.props
    boundLoadLocations()
  }

  render() {
    const { user, omicUrl, prisonStaffHubUrl, locations } = this.props
    if (!user) {
      return <div />
    }

    return (
      <Page title="Welcome back" showBreadcrumb={false}>
        {locations.size > 0 && <SearchForm />}
        <div>
          <ActionLinks
            isKeyWorkerAdmin={user.isKeyWorkerAdmin}
            isKeyWorker={user.isKeyWorker}
            isWhereabouts={user.isWhereabouts}
            omicUrl={omicUrl}
            prisonStaffHubUrl={prisonStaffHubUrl}
            isEstablishmentRollCheck={Boolean(user.activeCaseLoadId)}
            hasAdminRights={user.hasAdminRights}
            isGlobalSearch={user.canGlobalSearch}
            isAddBulkAppointments={user.canAddBulkAppointments}
          />
        </div>
      </Page>
    )
  }
}

HomePage.propTypes = {
  // mapStateToProps
  user: userType,
  omicUrl: PropTypes.string,
  prisonStaffHubUrl: PropTypes.string,
  locations: ImmutablePropTypes.list.isRequired,

  // mapDispatchToProps
  boundLoadLocations: PropTypes.func.isRequired,
}

HomePage.defaultProps = {
  user: {},
  omicUrl: null,
  prisonStaffHubUrl: null,
}

const mapDispatchToProps = dispatch => ({
  boundLoadLocations: () => dispatch(loadLocations()),
})

const mapStateToProps = state => ({
  user: state.getIn(['authentication', 'user']),
  omicUrl: state.getIn(['app', 'omicUrl']),
  prisonStaffHubUrl: state.getIn(['app', 'prisonStaffHubUrl']),
  locations: state.getIn(['home', 'locations']),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomePage)
