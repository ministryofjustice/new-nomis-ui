import React, { Component } from 'react'
import PropTypes from 'prop-types'
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
    const {
      user,
      omicUrl,
      whereaboutsUrl,
      establishmentRollcheckUrl,
      adminUtilitiesUrl,
      globalSearchUrl,
      addBulkAppointmentsUrl,
    } = this.props
    if (!user) {
      return <div />
    }

    return (
      <Page title="Welcome back" showBreadcrumb={false}>
        {user.activeCaseLoadId && <SearchForm />}
        <div>
          <ActionLinks
            isKeyWorkerAdmin={user.isKeyWorkerAdmin}
            isKeyWorker={user.isKeyWorker}
            isWhereabouts={user.isWhereabouts}
            omicUrl={omicUrl}
            whereaboutsUrl={whereaboutsUrl}
            isEstablishmentRollCheck={Boolean(user.activeCaseLoadId)}
            establishmentRollcheckUrl={establishmentRollcheckUrl}
            hasAdminRights={user.hasAdminRights}
            adminUtilitiesUrl={adminUtilitiesUrl}
            isGlobalSearch={user.canGlobalSearch}
            globalSearchUrl={globalSearchUrl}
            isAddBulkAppointments={user.canAddBulkAppointments}
            addBulkAppointmentsUrl={addBulkAppointmentsUrl}
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
  whereaboutsUrl: PropTypes.string,
  establishmentRollcheckUrl: PropTypes.string,
  adminUtilitiesUrl: PropTypes.string,
  globalSearchUrl: PropTypes.string,
  addBulkAppointmentsUrl: PropTypes.string,

  // mapDispatchToProps
  boundLoadLocations: PropTypes.func.isRequired,
}

HomePage.defaultProps = {
  user: {},
  omicUrl: null,
  whereaboutsUrl: null,
  establishmentRollcheckUrl: null,
  adminUtilitiesUrl: null,
  globalSearchUrl: null,
  addBulkAppointmentsUrl: null,
}

const mapDispatchToProps = dispatch => ({
  boundLoadLocations: () => dispatch(loadLocations()),
})

const mapStateToProps = state => ({
  user: state.getIn(['authentication', 'user']),
  omicUrl: state.getIn(['app', 'omicUrl']),
  adminUtilitiesUrl: state.getIn(['app', 'adminUtilitiesUrl']),
  establishmentRollcheckUrl: state.getIn(['app', 'establishmentRollcheckUrl']),
  whereaboutsUrl: state.getIn(['app', 'whereaboutsUrl']),
  globalSearchUrl: state.getIn(['app', 'globalSearchUrl']),
  addBulkAppointmentsUrl: state.getIn(['app', 'addBulkAppointmentsUrl']),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomePage)
