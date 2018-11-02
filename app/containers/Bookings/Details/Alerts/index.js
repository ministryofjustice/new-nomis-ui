import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { push } from 'react-router-redux'
import { Map, List } from 'immutable'

import qs from 'querystring'
import moment from 'moment'

import PreviousNextNavigation, { paginationType } from '../../../../components/PreviousNextNavigation'
import AlertsFilterForm from './alertsFilterForm'
import AlertList from '../../../../components/Bookings/Details/AlertList'

import { DATE_ONLY_FORMAT_SPEC } from '../../../App/constants'
import { loadBookingAlerts } from '../../../EliteApiLoader/actions'
import alertsModel from '../../../../helpers/dataMappers/alerts'
import { alertTypesFilterType } from './selectors'

class Alerts extends Component {
  componentDidMount() {
    const { loadAlerts, offenderNo, pagination, filter } = this.props

    loadAlerts(offenderNo, pagination, filter)
  }

  componentDidUpdate(prevProps) {
    const { loadAlerts, offenderNo, pagination, filter } = this.props
    if (!Map({ ...prevProps.pagination, ...prevProps.filter }).equals(Map({ ...pagination, ...filter }))) {
      loadAlerts(offenderNo, pagination, filter)
    }
  }

  render() {
    const { alerts, totalResults, pagination, offenderNo, setPagination, setFilter, deviceFormat, filter } = this.props

    return (
      <div>
        <AlertsFilterForm
          deviceFormat={deviceFormat}
          setFilter={filterValues => setFilter(offenderNo, filterValues)}
          initialFilterValues={filter}
        />

        <AlertList alerts={alerts} deviceFormat={deviceFormat} />

        <PreviousNextNavigation
          pagination={pagination}
          totalRecords={totalResults}
          pageAction={pageNumber => {
            setPagination(offenderNo, { perPage: pagination.perPage, pageNumber }, pageNumber)
            if (window) window.scrollTo(0, 0)
          }}
        />
      </div>
    )
  }
}

Alerts.propTypes = {
  totalResults: PropTypes.number,
  offenderNo: PropTypes.string.isRequired,
  filter: alertTypesFilterType.isRequired,
  pagination: paginationType.isRequired,
  alerts: ImmutablePropTypes.list.isRequired,
  deviceFormat: PropTypes.string.isRequired,

  // mapDispatchToProps
  loadAlerts: PropTypes.func.isRequired,
  setPagination: PropTypes.func.isRequired,
  setFilter: PropTypes.func.isRequired,
}

Alerts.defaultProps = {
  totalResults: 0,
}

const buildUrl = (offenderNo, queryParams) =>
  `/offenders/${offenderNo}/alerts?${qs.stringify({ perPage: 10, pageNumber: 0, ...queryParams })}`
const adaptFilterValues = ({ fromDate, toDate, alertType }) => {
  const momentToDateString = m => (m ? m.format(DATE_ONLY_FORMAT_SPEC) : '')
  return {
    fromDate: momentToDateString(fromDate),
    toDate: momentToDateString(toDate),
    alertType,
  }
}

const mapDispatchToProps = (dispatch, props) => ({
  loadAlerts: (id, pagination, filter) => dispatch(loadBookingAlerts(id, pagination, filter)),
  setPagination: (offenderNo, pagination) =>
    dispatch(push(buildUrl(offenderNo, { ...props.location.query, ...pagination }))),
  // filter is {alertType: string, fromDate: moment, toDate: moment }
  setFilter: (offenderNo, filter) => dispatch(push(buildUrl(offenderNo, adaptFilterValues(filter)))),
})

const mapStateToProps = (immutableState, props) => {
  const momentFromDateString = dateString => (dateString ? moment(dateString, DATE_ONLY_FORMAT_SPEC) : '')
  const alerts =
    immutableState.getIn(['eliteApiLoader', 'Bookings', 'Details', props.offenderNo, 'Alerts']) || alertsModel
  const alertItems = alerts.get('items') || List([])
  const totalResults = alerts.getIn(['MetaData', 'TotalRecords'])
  const deviceFormat = immutableState.getIn(['app', 'deviceFormat'])
  const { fromDate, toDate, alertType = '', perPage, pageNumber } = props.location.query
  const filter = { fromDate: momentFromDateString(fromDate), toDate: momentFromDateString(toDate), alertType }
  const pagination = { perPage: perPage || 10, pageNumber: pageNumber || 0 }

  return {
    filter,
    pagination,
    offenderNo: props.offenderNo,
    alerts: alertItems,
    totalResults,
    deviceFormat,
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Alerts)
