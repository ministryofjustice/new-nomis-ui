import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { Map, List } from 'immutable'
import styled from 'styled-components'

import qs from 'querystring'
import moment from 'moment'
import { BLUE } from 'govuk-colours'
import Button from '@govuk-react/button'

import PreviousNextNavigation, { paginationType } from '../../../../components/PreviousNextNavigation'
import AlertsFilterForm from './alertsFilterForm'
import AlertList from '../../../../components/Bookings/Details/AlertList'

import { DATE_ONLY_FORMAT_SPEC } from '../../../App/constants'
import { loadBookingAlerts } from '../../../EliteApiLoader/actions'
import alertsModel from '../../../../helpers/dataMappers/alerts'
import { alertTypesFilterType } from './selectors'
import { getQueryParams } from '../../../../helpers'
import history from '../../../../history'
import ResultsFilter from '../../../../components/ResultsFilter'
import { userType } from '../../../../types'

const ButtonContainer = styled.div`
  display: flex;
  flex: 1 0 auto;
  align-items: flex-end;
  justify-content: flex-end;
`

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
    const {
      alerts,
      totalResults,
      pagination,
      pagination: { perPage, pageNumber },
      offenderNo,
      setPagination,
      setFilter,
      deviceFormat,
      filter,
      prisonStaffHubUrl,
      user,
    } = this.props

    return (
      <div id="tab-content">
        <AlertsFilterForm
          deviceFormat={deviceFormat}
          setFilter={filterValues => setFilter(offenderNo, filterValues)}
          initialFilterValues={filter}
        />

        <ResultsFilter perPage={perPage} pageNumber={pageNumber} totalResults={totalResults}>
          <ResultsFilter.PerPageDropdown
            handleChange={value => setPagination(offenderNo, { perPage: value, pageNumber: 0 })}
            totalResults={totalResults}
            perPage={pagination.perPage}
          />
          {user.canUpdateAlerts && (
            <ButtonContainer>
              <Button
                buttonColour={BLUE}
                type="submit"
                mb={0}
                onClick={() => {
                  window.location = `${prisonStaffHubUrl}offenders/${offenderNo}/create-alert`
                }}
              >
                Add alert
              </Button>
            </ButtonContainer>
          )}
        </ResultsFilter>

        <AlertList
          alerts={alerts}
          deviceFormat={deviceFormat}
          offenderNo={offenderNo}
          prisonStaffHubUrl={prisonStaffHubUrl}
        />

        <PreviousNextNavigation
          pagination={pagination}
          totalRecords={totalResults}
          pageAction={id => {
            setPagination(offenderNo, { perPage: pagination.perPage, pageNumber: id }, id)
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
  prisonStaffHubUrl: PropTypes.string.isRequired,
  user: userType.isRequired,

  // mapDispatchToProps
  loadAlerts: PropTypes.func.isRequired,
  setPagination: PropTypes.func.isRequired,
  setFilter: PropTypes.func.isRequired,
}

Alerts.defaultProps = {
  totalResults: 0,
}

const buildUrl = (offenderNo, queryParams) => `/offenders/${offenderNo}/alerts?${qs.stringify({ ...queryParams })}`
const adaptFilterValues = ({ fromDate, toDate, alertType }) => {
  const momentToDateString = m => (m ? m.format(DATE_ONLY_FORMAT_SPEC) : '')
  return {
    perPage: 20,
    pageNumber: 0,
    fromDate: momentToDateString(fromDate),
    toDate: momentToDateString(toDate),
    alertType,
  }
}

const mapDispatchToProps = (dispatch, props) => {
  const queryParams = getQueryParams(props.location.search)

  return {
    loadAlerts: (id, pagination, filter) => dispatch(loadBookingAlerts(id, pagination, filter)),
    setPagination: (offenderNo, pagination) => history.push(buildUrl(offenderNo, { ...queryParams, ...pagination })),
    // filter is {alertType: string, fromDate: moment, toDate: moment }
    setFilter: (offenderNo, filter) => history.push(buildUrl(offenderNo, adaptFilterValues(filter))),
  }
}

const mapStateToProps = (immutableState, props) => {
  const queryParams = getQueryParams(props.location.search)
  const momentFromDateString = dateString => (dateString ? moment(dateString, DATE_ONLY_FORMAT_SPEC) : '')
  const alerts =
    immutableState.getIn(['eliteApiLoader', 'Bookings', 'Details', props.offenderNo, 'Alerts']) || alertsModel
  const alertItems = alerts.get('items') || List([])
  const totalResults = alerts.getIn(['MetaData', 'TotalRecords'])
  const deviceFormat = immutableState.getIn(['app', 'deviceFormat'])
  const { fromDate, toDate, alertType = '', perPage, pageNumber } = queryParams
  const filter = { fromDate: momentFromDateString(fromDate), toDate: momentFromDateString(toDate), alertType }
  const pagination = { perPage: Number.parseInt(perPage, 10) || 20, pageNumber: Number.parseInt(pageNumber, 10) || 0 }
  const prisonStaffHubUrl = immutableState.getIn(['app', 'prisonStaffHubUrl'])
  const user = immutableState.getIn(['authentication', 'user'])

  return {
    filter,
    pagination,
    offenderNo: props.offenderNo,
    alerts: alertItems,
    totalResults,
    deviceFormat,
    prisonStaffHubUrl,
    user,
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Alerts)
